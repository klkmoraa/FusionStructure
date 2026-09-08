import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ARCHIVED_FOUNDATION_PACKAGES = new Set([
  '@fusionstructure/foundation',
  'foundation',
  'fusionstructure-foundation',
]);
const WEB_PACKAGES = new Set(['@fusionstructure/web', 'fusionstructure-web']);
const PRODUCT_SCOPE = '@fusionstructure/';
const SIBLING_PRODUCT_PACKAGES = new Set(['fstructure', 'fusionstructure-space3d', 'space3d']);
const DEPENDENCY_SECTIONS = [
  'dependencies',
  'devDependencies',
  'optionalDependencies',
  'peerDependencies',
];
const BUNDLED_DEPENDENCY_SECTIONS = ['bundleDependencies', 'bundledDependencies'];
const SOURCE_EXTENSIONS = new Set(['.ts', '.tsx']);
const TEST_SOURCE_PATTERN = /\.(?:test|spec)\.(?:ts|tsx)$/;
const FOUNDATION_PATH_PATTERN = /(?:^|\/)\.\.\/(?:foundation|fusionstructure-foundation)(?:\/|$)/i;
const SIBLING_PRODUCT_PATH_PATTERN = /(?:^|\/)\.\.\/(?:fstructure|fusionstructure-space3d|space3d)(?:\/|$)/i;
const ABSOLUTE_LOCAL_PATH_PATTERN = /^(?:[a-z]:\/|\/)/i;
const FOUNDATION_DIRECTORY_PATTERN = /(?:^|\/)(?:foundation|fusionstructure-foundation)(?:\/|$)/i;
const PRODUCT_DIRECTORY_PATTERN = /(?:^|\/)(?:fstructure|space3d|fusionstructure-space3d|fusionstructure-web|web)(?:\/|$)/i;
const SCOPED_PRODUCT_PACKAGE_PATTERN = /@fusionstructure\/[a-z0-9._/-]+/gi;
const NPM_ALIAS_PATTERN = /^npm:(@[^/@\s]+\/[^/@\s]+|[^@/\s]+)(?:@.*)?$/;
const SPECIFIER_PATTERNS = [
  /\bfrom\s*['"]([^'"]+)['"]/g,
  /\bimport\s*['"]([^'"]+)['"]/g,
  /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
  /\brequire\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
];

const normalizePath = (value) => value.replaceAll('\\', '/');

const isProductionSource = (filePath) => (
  SOURCE_EXTENSIONS.has(extname(filePath)) && !TEST_SOURCE_PATTERN.test(filePath)
);

const collectProductionSourceFiles = (directory) => {
  if (!existsSync(directory)) return [];

  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist') continue;

    const entryPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectProductionSourceFiles(entryPath));
    } else if (entry.isFile() && isProductionSource(entryPath)) {
      files.push(entryPath);
    }
  }
  return files;
};

const extractScopedProductPackages = (value) => (
  [...value.matchAll(SCOPED_PRODUCT_PACKAGE_PATTERN)].map((match) => match[0])
);

const extractNpmAliasTarget = (value) => value.match(NPM_ALIAS_PATTERN)?.[1];

const matchesPackage = (value, packageNames) => (
  [...packageNames].some((packageName) => value === packageName || value.startsWith(`${packageName}/`))
);

const forbiddenAbsoluteLocalPathReason = (value) => {
  if (!ABSOLUTE_LOCAL_PATH_PATTERN.test(value)) return undefined;
  if (FOUNDATION_DIRECTORY_PATTERN.test(value)) return 'uses archived Foundation';
  if (PRODUCT_DIRECTORY_PATTERN.test(value)) return 'uses a sibling product dependency';
  return undefined;
};

const extractModuleSpecifiers = (source) => {
  const specifiers = new Set();
  for (const pattern of SPECIFIER_PATTERNS) {
    pattern.lastIndex = 0;
    for (const match of source.matchAll(pattern)) {
      specifiers.add(match[1]);
    }
  }
  for (const packageName of extractScopedProductPackages(source)) {
    specifiers.add(packageName);
  }
  return [...specifiers];
};

const forbiddenSpecifierReason = (specifier) => {
  const normalized = normalizePath(specifier);
  if (matchesPackage(normalized, ARCHIVED_FOUNDATION_PACKAGES)) {
    return 'imports archived Foundation';
  }
  if (
    (normalized.startsWith(PRODUCT_SCOPE) && !matchesPackage(normalized, WEB_PACKAGES))
    || SIBLING_PRODUCT_PACKAGES.has(normalized)
    || SIBLING_PRODUCT_PATH_PATTERN.test(normalized)
  ) {
    return 'imports sibling product internals';
  }
  return undefined;
};

const forbiddenDependencyReason = (dependencyName, dependencyValue) => {
  const directReason = forbiddenSpecifierReason(dependencyName);
  if (directReason === 'imports archived Foundation') return 'uses archived Foundation';
  if (directReason) return 'uses a sibling product dependency';
  if (typeof dependencyValue === 'string') {
    const npmAliasTarget = extractNpmAliasTarget(dependencyValue);
    if (npmAliasTarget) {
      const targetReason = forbiddenSpecifierReason(npmAliasTarget);
      if (targetReason === 'imports archived Foundation') return 'uses archived Foundation';
      if (targetReason) return 'uses a sibling product dependency';
    }
    for (const packageName of extractScopedProductPackages(dependencyValue)) {
      const targetReason = forbiddenSpecifierReason(packageName);
      if (targetReason === 'imports archived Foundation') return 'uses archived Foundation';
      if (targetReason) return 'uses a sibling product dependency';
    }
    const localTarget = normalizePath(dependencyValue).replace(/^(?:file|link|workspace):/, '');
    const absolutePathReason = forbiddenAbsoluteLocalPathReason(localTarget);
    if (absolutePathReason) return absolutePathReason;
    if (FOUNDATION_PATH_PATTERN.test(localTarget)) return 'uses archived Foundation';
    if (SIBLING_PRODUCT_PATH_PATTERN.test(localTarget)) return 'uses a sibling product dependency';
  }
  return undefined;
};

const readPackageJson = (root) => {
  const packagePath = join(root, 'package.json');
  return {
    packagePath,
    packageJson: JSON.parse(readFileSync(packagePath, 'utf8')),
  };
};

export const validateLocalFoundationBoundary = (rootPath = process.cwd()) => {
  const root = resolve(rootPath);
  const violations = [];

  for (const sourcePath of collectProductionSourceFiles(join(root, 'src'))) {
    const source = readFileSync(sourcePath, 'utf8');
    for (const specifier of extractModuleSpecifiers(source)) {
      const reason = forbiddenSpecifierReason(specifier);
      if (reason) {
        violations.push(`${normalizePath(relative(root, sourcePath))}: ${reason} (${specifier})`);
      }
    }
  }

  const { packagePath, packageJson } = readPackageJson(root);
  for (const section of DEPENDENCY_SECTIONS) {
    const dependencies = packageJson[section];
    if (dependencies === undefined) continue;
    if (typeof dependencies !== 'object' || dependencies === null || Array.isArray(dependencies)) {
      violations.push(`${normalizePath(relative(root, packagePath))}: ${section} must be an object`);
      continue;
    }
    for (const [dependencyName, dependencyValue] of Object.entries(dependencies)) {
      const reason = forbiddenDependencyReason(dependencyName, dependencyValue);
      if (reason) {
        violations.push(
          `${normalizePath(relative(root, packagePath))}: ${reason} (${section}.${dependencyName})`,
        );
      }
    }
  }

  for (const section of BUNDLED_DEPENDENCY_SECTIONS) {
    const dependencies = packageJson[section];
    if (dependencies === undefined || typeof dependencies === 'boolean') continue;
    if (!Array.isArray(dependencies)) {
      violations.push(`${normalizePath(relative(root, packagePath))}: ${section} must be an array or boolean`);
      continue;
    }
    for (const dependencyName of dependencies) {
      if (typeof dependencyName !== 'string') {
        violations.push(`${normalizePath(relative(root, packagePath))}: ${section} entries must be strings`);
        continue;
      }
      const reason = forbiddenDependencyReason(dependencyName, dependencyName);
      if (reason) {
        violations.push(
          `${normalizePath(relative(root, packagePath))}: ${reason} (${section}.${dependencyName})`,
        );
      }
    }
  }

  return violations;
};

const rootFromArguments = () => {
  const rootFlag = process.argv.indexOf('--root');
  if (rootFlag === -1) return process.cwd();
  const root = process.argv[rootFlag + 1];
  if (!root) throw new Error('Missing path after --root.');
  return root;
};

const run = () => {
  const violations = validateLocalFoundationBoundary(rootFromArguments());
  if (violations.length === 0) {
    console.log('Local Foundation boundary passed.');
    return;
  }

  console.error('Local Foundation boundary failed:');
  for (const violation of violations) console.error(`- ${violation}`);
  process.exitCode = 1;
};

if (resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) run();
