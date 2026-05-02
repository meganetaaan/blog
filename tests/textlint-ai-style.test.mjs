import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import test from 'node:test';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const rootDir = path.resolve(import.meta.dirname, '..');
const textlintBin = path.join(rootDir, 'node_modules', '.bin', 'textlint');

async function runTextlint(markdown) {
  const dir = await mkdtemp(path.join(tmpdir(), 'blog-textlint-ai-style-'));
  const file = path.join(dir, 'article.md');
  await writeFile(file, markdown, 'utf8');

  try {
    const result = await execFileAsync(
      textlintBin,
      ['--config', path.join(rootDir, '.textlintrc.json'), '--rulesdir', path.join(rootDir, 'textlint-rules'), file],
      { cwd: rootDir },
    );
    return { ok: true, stdout: result.stdout, stderr: result.stderr };
  } catch (error) {
    return {
      ok: false,
      stdout: error.stdout ?? '',
      stderr: error.stderr ?? '',
      message: error.message,
    };
  }
}

test('AIっぽい意味の薄い強調構文を検出する', async () => {
  const result = await runTextlint(`---\ntitle: テスト\n---\n\nここで良かったのは、単にファイルがコピーされたという話ではありません。認証情報や接続設定まで引き継がれたことです。\n\n重要なのは、運用で迷わないことです。\n\nこの結果は便利と言えるでしょう。\n`);

  assert.equal(result.ok, false);
  assert.match(result.stdout + result.stderr, /単純な肯定文|必要な対比|普通に言い切/);
});

test('具体的に言い切る本文は通す', async () => {
  const result = await runTextlint(`---\ntitle: テスト\n---\n\n認証情報や接続設定まで引き継がれたので、日常運用の土台をすぐ使えました。\n\n設定ファイルを確認し、Slack 連携の動作もその場で確かめました。\n`);

  assert.equal(result.ok, true, result.stdout + result.stderr + result.message);
});
