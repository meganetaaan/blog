# textlint による記事レビュー

このリポジトリでは、日本語の技術文書としての読みやすさと、AI 生成文に寄りやすい定型表現を textlint で確認します。

```bash
npm run lint:text
```

## ルール構成

- `.textlintrc.json`
  - `textlint-rule-preset-ja-technical-writing` を低ノイズに調整しています。
  - 句読点数・文長・常体敬体混在など、ブログの文体と衝突しやすいルールは無効化しています。
  - 誤用、不自然な表現、制御文字、ゼロ幅スペース、括弧対応など、レビュー負荷を下げやすいルールを中心に有効化しています。
- `textlint-rules/no-ai-like-expressions.js`
  - `この記事では` や `詳しく見ていきましょう` など、AI 生成文で目立ちやすい定型句を検出します。
  - 検出時は単に禁止するのではなく、「具体的な観察・判断・作業内容から書き始める」方向のレビューコメントを出します。

## 独自ルールを増やすとき

まず `tests/textlint-ai-style.test.mjs` に、検出したい文例と通したい文例を追加して RED を確認します。
そのうえで `textlint-rules/no-ai-like-expressions.js` の `DEFAULT_PATTERNS` に次の形で追加します。

```js
{
  pattern: '検出したいフレーズ',
  message: 'なぜ弱いか、どう直すとよいかを短く書く。',
}
```

正規表現も使えます。単純な grep の置き換えにせず、レビューでそのまま使える説明文を添えるのがコツです。
