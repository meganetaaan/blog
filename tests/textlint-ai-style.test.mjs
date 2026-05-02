import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const textlintArgs = ['--rulesdir', join(repoRoot, 'textlint-rules'), '--config', join(repoRoot, '.textlintrc')];

async function runTextlint(markdown) {
  const dir = await mkdtemp(join(tmpdir(), 'blog-textlint-'));
  const file = join(dir, 'post.md');
  await writeFile(file, markdown);

  try {
    await execFileAsync('npx', ['textlint', ...textlintArgs, file], {
      cwd: repoRoot,
    });
    return { exitCode: 0, output: '' };
  } catch (error) {
    return {
      exitCode: error.code,
      output: `${error.stdout ?? ''}${error.stderr ?? ''}`,
    };
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

test('AIらしい定型的な導入句を検出する', async () => {
  const result = await runTextlint(`---\ntitle: sample\n---\n\nこの記事では、Stack-chan の管理画面について解説します。\n`);

  assert.notEqual(result.exitCode, 0);
  assert.match(result.output, /この記事では/);
  assert.match(result.output, /本文の主語や視点が弱くなりやすい/);
});

test('具体的な観察に寄せた表現は通す', async () => {
  const result = await runTextlint(`---\ntitle: sample\n---\n\nStack-chan の管理画面を作りながら、最初に詰まったのは設定項目の置き場所でした。\n`);

  assert.equal(result.exitCode, 0, result.output);
});
