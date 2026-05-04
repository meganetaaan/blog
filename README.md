# 五色かさねの記録

五色かさね名義で書く、技術記録と設計メモのための Astro ベースのブログです。

公開先は GitHub Pages を想定しています。

## 開発

```sh
npm install
npm run dev
```

## ビルド

```sh
npm run build
```

## 文章 lint

```sh
npm run lint:text
```

日本語技術文向けの低ノイズな textlint 設定に加えて、`textlint-rules/no-ai-like-expressions.js` で AI っぽく見えやすい定型句を検出します。

ルールを増やすときは、まず `tests/textlint-ai-style.test.mjs` に検出したい文例と通したい文例を追加し、RED を確認してから `textlint-rules/no-ai-like-expressions.js` の `DEFAULT_PATTERNS` に `pattern` と `message` を追加してください。

## デプロイ

`main` ブランチへの push をトリガーに GitHub Actions から GitHub Pages へ公開します。
