import { afterEach, describe, expect, it } from 'vitest';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const gatePath = fileURLToPath(new URL('../../scripts/check-local-foundation.mjs', import.meta.url));
const fixtureRoots: string[] = [];

const createFixture = (dependencies: Record<string, string> = {}): string => {
  const root = mkdtempSync(join(tmpdir(), 'fusionstructure-local-foundation-'));
  fixtureRoots.push(root);
  mkdirSync(join(root, 'src'), { recursive: true });
  writeFileSync(
    join(root, 'package.json'),
    JSON.stringify({ name: 'fixture-web', dependencies }, null, 2),
  );
  return root;
};

const writeSource = (root: string, relativePath: string, source: string): void => {
  const target = join(root, 'src', relativePath);
  mkdirSync(join(target, '..'), { recursive: true });
  writeFileSync(target, source);
};

const runGate = (root: string) => {
  const result = spawnSync(process.execPath, [gatePath, '--root', root], {
    encoding: 'utf8',
  });
  return {
    status: result.status ?? 1,
    output: `${result.stdout ?? ''}${result.stderr ?? ''}`,
  };
};

afterEach(() => {
  for (const root of fixtureRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe('local Foundation boundary gate', () => {
  it('allows local Foundation imports and ignores test-only fixture strings', () => {
    const root = createFixture();
    writeSource(root, 'App.tsx', "import { PRODUCT_LINKS } from './foundation/productLinks';\nvoid PRODUCT_LINKS;");
    writeSource(root, 'foundation/localFoundationBoundary.test.ts', "import '@fusionstructure/foundation';");

    expect(runGate(root).status).toBe(0);
  });

  it.each(['bridge.ts', 'bridge.tsx'])('rejects archived Foundation imports in production %s', (fileName) => {
    const root = createFixture();
    writeSource(root, fileName, "import '@fusionstructure/foundation';");

    const result = runGate(root);

    expect(result.status).toBe(1);
    expect(result.output).toContain(`src/${fileName}`);
    expect(result.output).toContain('archived Foundation');
  });

  it('rejects archived Foundation values used by computed production imports', () => {
    const root = createFixture();
    writeSource(root, 'bridge.ts', "const archived = '@fusionstructure/foundation';\nvoid import(archived);");

    const result = runGate(root);

    expect(result.status).toBe(1);
    expect(result.output).toContain('src/bridge.ts');
    expect(result.output).toContain('archived Foundation');
  });

  it('rejects sibling-product package dependencies', () => {
    const root = createFixture({ '@fusionstructure/space3d': '1.0.0' });
    writeSource(root, 'App.tsx', 'export {};');

    const result = runGate(root);

    expect(result.status).toBe(1);
    expect(result.output).toContain('package.json');
    expect(result.output).toContain('sibling product dependency');
  });

  it.each([
    ['dependencies', 'foundation-npm-alias', 'npm:@fusionstructure/foundation@1.0.0', 'archived Foundation'],
    ['devDependencies', 'fstructure-file-alias', 'file:../fstructure', 'sibling product dependency'],
    ['optionalDependencies', 'space3d-workspace-alias', 'workspace:@fusionstructure/space3d@*', 'sibling product dependency'],
    ['peerDependencies', 'foundation-workspace-alias', 'workspace:@fusionstructure/foundation@*', 'archived Foundation'],
  ])('rejects aliases in %s that target local-only products', (section, alias, target, reason) => {
    const root = createFixture();
    writeFileSync(
      join(root, 'package.json'),
      JSON.stringify({ name: 'fixture-web', [section]: { [alias]: target } }, null, 2),
    );
    writeSource(root, 'App.tsx', 'export {};');

    const result = runGate(root);

    expect(result.status).toBe(1);
    expect(result.output).toContain(reason);
    expect(result.output).toContain(`${section}.${alias}`);
  });

  it.each([
    ['file', 'file:../foundation'],
    ['file', 'file:../fusionstructure-foundation'],
    ['link', 'link:../foundation'],
    ['link', 'link:../fusionstructure-foundation'],
    ['workspace', 'workspace:../foundation'],
    ['workspace', 'workspace:../fusionstructure-foundation'],
  ])('rejects %s aliases that resolve to local Foundation paths', (_protocol, target) => {
    const root = createFixture({ 'local-foundation-alias': target });
    writeSource(root, 'App.tsx', 'export {};');

    const result = runGate(root);

    expect(result.status).toBe(1);
    expect(result.output).toContain('archived Foundation');
  });

  it.each([
    ['file:C:\\review\\foundation', 'archived Foundation'],
    ['file:C:\\review\\fusionstructure-foundation\\src', 'archived Foundation'],
    ['file:C:\\review\\fstructure', 'sibling product dependency'],
    ['file:C:\\review\\space3d\\src', 'sibling product dependency'],
    ['file:C:\\review\\fusionstructure-space3d', 'sibling product dependency'],
    ['file:C:\\review\\fusionstructure-web\\src', 'sibling product dependency'],
    ['file:C:\\review\\web', 'sibling product dependency'],
    ['file:/opt/fusionstructure-foundation', 'archived Foundation'],
    ['/opt/fusionstructure-foundation', 'archived Foundation'],
  ])('rejects absolute aliases that contain a local product directory', (target, reason) => {
    const root = createFixture({ 'absolute-local-product-alias': target });
    writeSource(root, 'App.tsx', 'export {};');

    const result = runGate(root);

    expect(result.status).toBe(1);
    expect(result.output).toContain(reason);
  });

  it.each([
    ['foundation', 'archived Foundation'],
    ['fusionstructure-foundation', 'archived Foundation'],
    ['fstructure', 'sibling product dependency'],
    ['space3d', 'sibling product dependency'],
    ['fusionstructure-space3d', 'sibling product dependency'],
  ])('rejects npm aliases that target the unscoped local product %s', (targetPackage, reason) => {
    const root = createFixture({ 'local-product-alias': `npm:${targetPackage}@1.0.0` });
    writeSource(root, 'App.tsx', 'export {};');

    const result = runGate(root);

    expect(result.status).toBe(1);
    expect(result.output).toContain(reason);
  });

  it('allows an npm alias that targets Web\'s unscoped package identity', () => {
    const root = createFixture({ 'web-alias': 'npm:fusionstructure-web@1.0.0' });
    writeSource(root, 'App.tsx', 'export {};');

    expect(runGate(root).status).toBe(0);
  });

  it.each([
    ['bundleDependencies', ['fusionstructure-foundation'], 'archived Foundation'],
    ['bundledDependencies', ['fstructure'], 'sibling product dependency'],
  ])('rejects local product names in %s', (section, values, reason) => {
    const root = createFixture();
    writeFileSync(
      join(root, 'package.json'),
      JSON.stringify({ name: 'fixture-web', [section]: values }, null, 2),
    );
    writeSource(root, 'App.tsx', 'export {};');

    const result = runGate(root);

    expect(result.status).toBe(1);
    expect(result.output).toContain(reason);
    expect(result.output).toContain(section);
  });
});
