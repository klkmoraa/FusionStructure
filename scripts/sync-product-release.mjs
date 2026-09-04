import {
  cpSync,
  existsSync,
  lstatSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, relative, resolve, sep } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const scriptDirectory = resolve(fileURLToPath(new URL('.', import.meta.url)));
const defaultRoot = resolve(scriptDirectory, '..');
const defaultManifestPath = resolve(defaultRoot, 'migration', 'product-releases.json');
const semanticRelease = /^v\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;
const reservedTargets = [
  '.github',
  'AGENTS.md',
  'MIGRATION.md',
  'README.md',
  'package.json',
  'package-lock.json',
  'src/App.tsx',
  'src/main.tsx',
  'src/foundation',
  'src/project-format',
  'tsconfig.app.json',
  'tsconfig.json',
  'tsconfig.node.json',
  'vite.config.ts',
];

const toPosix = (value) => value.split(sep).join('/').replace(/^\.\//, '').replace(/\/$/, '');
const pathsOverlap = (left, right) => left === right || left.startsWith(`${right}/`) || right.startsWith(`${left}/`);
const isInside = (root, candidate) => {
  const normalizedRoot = resolve(root);
  const normalizedCandidate = resolve(candidate);
  return normalizedCandidate === normalizedRoot || normalizedCandidate.startsWith(`${normalizedRoot}${sep}`);
};

export const validateReleaseRef = (ref) => {
  if (typeof ref !== 'string' || !semanticRelease.test(ref)) {
    throw new Error(`Release ref must be an immutable semantic release tag (vX.Y.Z): ${String(ref)}`);
  }
  return ref;
};

const repositorySlug = (value) => {
  const normalized = String(value).trim().replace(/\\/g, '/').replace(/\.git$/, '');
  const match = normalized.match(/(?:github\.com[/:])([^/]+\/[^/]+)$/i);
  return match?.[1]?.toLowerCase() ?? normalized.toLowerCase();
};

export const assertRepositoryIdentity = (actual, expected) => {
  if (repositorySlug(actual) !== repositorySlug(expected)) {
    throw new Error(`Repository mismatch: expected ${expected}, received ${actual}`);
  }
};

export const assertCleanWorktree = (status) => {
  if (String(status).trim().length > 0) {
    throw new Error('sync:product requires a clean worktree so the release diff remains reviewable.');
  }
};

const validatePath = (path, label) => {
  if (typeof path !== 'string' || path.length === 0 || path.startsWith('/') || path.includes('..') || path.includes('\\')) {
    throw new Error(`${label} must be a safe repository-relative POSIX path: ${String(path)}`);
  }
  return toPosix(path);
};

export const validateReleaseManifest = (manifest) => {
  if (manifest?.schemaVersion !== 1 || !manifest.products || typeof manifest.products !== 'object') {
    throw new Error('product-releases.json must declare schemaVersion 1 and a products object.');
  }
  const ownedTargets = [];
  for (const [product, record] of Object.entries(manifest.products)) {
    if (!/^[a-z0-9-]+$/.test(product) || !/^[^/]+\/[^/]+$/.test(record.repository ?? '')) {
      throw new Error(`Invalid product or repository identity: ${product}`);
    }
    validateReleaseRef(record.releaseTag);
    if (!/^[0-9a-f]{40}$/.test(record.commit ?? '')) throw new Error(`${product} commit must be an exact Git SHA.`);
    if (!record.contractVersions || typeof record.contractVersions !== 'object') {
      throw new Error(`${product} contractVersions must declare supported contract copies.`);
    }
    if (typeof record.contractVersions.algorithm !== 'string' || record.contractVersions.algorithm.length === 0) {
      throw new Error(`${product} contractVersions.algorithm must be explicit.`);
    }
    if (!record.gate || record.gate.command !== 'npm.cmd run check' || record.gate.result !== 'passed') {
      throw new Error(`${product} gate must record a passed npm.cmd run check.`);
    }
    if (record.pagesUrl !== null && !/^https:\/\/[^/]+\.github\.io\/.+\/$/.test(record.pagesUrl ?? '')) {
      throw new Error(`${product} pagesUrl must be a GitHub Pages HTTPS URL or null when unpublished.`);
    }
    if (!Array.isArray(record.paths) || record.paths.length === 0) throw new Error(`${product} must declare at least one owned path.`);
    for (const mapping of record.paths) {
      const source = validatePath(mapping.source, `${product} source`);
      const target = validatePath(mapping.target, `${product} target`);
      if (reservedTargets.some((reserved) => pathsOverlap(target, reserved))) {
        throw new Error(`${product} declares reserved target ${target}; bootstrap and local Foundation stay owned by the principal.`);
      }
      const collision = ownedTargets.find((entry) => pathsOverlap(entry.target, target));
      if (collision) throw new Error(`${product} has overlapping target ${target} with ${collision.product}:${collision.target}.`);
      ownedTargets.push({ product, source, target });
    }
  }
  return manifest;
};

export const buildSyncPlan = (manifest, product, ref) => {
  validateReleaseManifest(manifest);
  const record = manifest.products[product];
  if (!record) throw new Error(`Unknown product: ${product}`);
  return {
    product,
    repository: record.repository,
    ref: validateReleaseRef(ref),
    paths: record.paths.map(({ source, target }) => ({ source: toPosix(source), target: toPosix(target) })),
  };
};

const command = (program, args, cwd) => {
  const result = spawnSync(program, args, { cwd, encoding: 'utf8', windowsHide: true });
  if (result.status !== 0) {
    const detail = (result.stderr || result.stdout || `${program} exited with ${result.status}`).trim();
    throw new Error(detail);
  }
  return result.stdout.trim();
};

const assertNoSymbolicLinks = (path) => {
  const stat = lstatSync(path);
  if (stat.isSymbolicLink()) throw new Error(`Symbolic links are not accepted in synchronized paths: ${path}`);
  if (!stat.isDirectory()) return;
  for (const entry of readdirSync(path)) assertNoSymbolicLinks(resolve(path, entry));
};

const copyMappedPath = ({ sourceRoot, targetRoot, mapping, dryRun }) => {
  const source = resolve(sourceRoot, mapping.source);
  const target = resolve(targetRoot, mapping.target);
  if (!isInside(sourceRoot, source) || !isInside(targetRoot, target)) throw new Error(`Mapped path escapes its repository: ${mapping.source}`);
  if (!existsSync(source)) throw new Error(`Release is missing allowlisted path: ${mapping.source}`);
  assertNoSymbolicLinks(source);
  if (dryRun) return;
  rmSync(target, { recursive: true, force: true });
  cpSync(source, target, { recursive: true, errorOnExist: true, force: false });
};

const parseArguments = (argumentsList) => {
  const options = { product: undefined, ref: undefined, dryRun: false };
  for (let index = 0; index < argumentsList.length; index += 1) {
    const argument = argumentsList[index];
    if (argument === '--dry-run') {
      options.dryRun = true;
      continue;
    }
    if (!['--product', '--ref'].includes(argument) || !argumentsList[index + 1]) throw new Error(`Unknown or incomplete argument: ${argument}`);
    options[argument.slice(2)] = argumentsList[index + 1];
    index += 1;
  }
  if (!options.product || !options.ref) throw new Error('Usage: npm run sync:product -- --product <name> --ref <vX.Y.Z> [--dry-run]');
  return options;
};

export const syncProductRelease = ({ root = defaultRoot, manifestPath = defaultManifestPath, product, ref, dryRun = false }) => {
  const repositoryRoot = resolve(root);
  assertCleanWorktree(command('git', ['status', '--porcelain'], repositoryRoot));
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const plan = buildSyncPlan(manifest, product, ref);
  const temporaryRoot = mkdtempSync(resolve(tmpdir(), 'fusionstructure-release-sync-'));
  const sourceRoot = resolve(temporaryRoot, 'source');
  try {
    command('git', ['clone', '--quiet', '--filter=blob:none', '--depth', '1', '--branch', plan.ref, `https://github.com/${plan.repository}.git`, sourceRoot], temporaryRoot);
    assertRepositoryIdentity(command('git', ['remote', 'get-url', 'origin'], sourceRoot), plan.repository);
    const commit = command('git', ['rev-parse', 'HEAD'], sourceRoot);
    for (const mapping of plan.paths) copyMappedPath({ sourceRoot, targetRoot: repositoryRoot, mapping, dryRun });
    if (!dryRun) {
      manifest.products[product] = {
        ...manifest.products[product],
        releaseTag: plan.ref,
        commit,
        synchronizedAt: new Date().toISOString(),
      };
      writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
    }
    return { ...plan, commit, dryRun };
  } finally {
    rmSync(temporaryRoot, { recursive: true, force: true });
  }
};

const main = () => {
  try {
    const result = syncProductRelease({ ...parseArguments(process.argv.slice(2)) });
    console.log(JSON.stringify(result, null, 2));
    console.log(result.dryRun ? 'Release sync dry-run passed; no files changed.' : 'Release synchronized. Review the diff before committing.');
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
};

if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) main();
