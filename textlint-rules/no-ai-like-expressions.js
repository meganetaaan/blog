const DEFAULT_PATTERNS = [
  {
    pattern: 'この記事では',
    message:
      '「この記事では」は本文の主語や視点が弱くなりやすい定型句です。何を見た／作った／試したのかから始めると、AIっぽさが薄まります。',
  },
  {
    pattern: '本記事では',
    message:
      '「本記事では」は本文の主語や視点が弱くなりやすい定型句です。記事ではなく、観察・作業・結論そのものから書き始めてください。',
  },
  {
    pattern: '解説します',
    message:
      '「解説します」は汎用的な導入句になりやすい表現です。何をどう扱うのかを具体的に書くと、本文の温度が出ます。',
  },
  {
    pattern: 'ご紹介します',
    message:
      '「ご紹介します」は宣伝文の定型句に寄りやすい表現です。ブログ本文では、対象や気づきをそのまま書き始めるほうが自然です。',
  },
  {
    pattern: 'いかがでしたでしょうか',
    message:
      '「いかがでしたでしょうか」は締めの定型句としてAIっぽく見えやすい表現です。最後に残したい判断や感想を具体的に書いてください。',
  },
  {
    pattern: '詳しく見ていきましょう',
    message:
      '「詳しく見ていきましょう」は汎用的な接続句です。次に見る対象を具体的に置くと、文章の密度が上がります。',
  },
  {
    pattern: /(結論から言うと|結論から書くと)/g,
    message:
      '「結論から言うと／書くと」は便利ですが、冒頭の型として多用されがちです。必要な場面だけに絞り、普通に結論から書けないか確認してください。',
  },
  {
    pattern: /(非常に重要|とても重要)/g,
    message:
      '「非常に重要／とても重要」は強調だけが先に立ちやすい表現です。何が効くのかを具体的に書いてください。',
  },
  {
    pattern: 'さまざまな',
    message:
      '「さまざまな」は範囲をぼかしやすい表現です。具体例を出すか、不要なら削ってください。',
  },
  {
    pattern: 'することができます',
    message:
      '「することができます」は冗長になりやすい表現です。「できます」や具体的な動詞で言い切れないか確認してください。',
  },
  {
    pattern: /[^。\n]*なのは、?[^。\n]*ではありません。?[^。\n]*です/g,
    message:
      '「〜なのは〜ではありません。〜です」は、もったいぶった強調構文に見えやすい表現です。まず単純な肯定文に潰せないか確認してください。',
  },
  {
    pattern: /単に[^、。\n]+ではなく/g,
    message:
      '「単に〜ではなく」は便利ですが、多用すると機械的に見えます。必要な対比がないなら削り、言いたいことを先に書いてください。',
  },
  {
    pattern: /重要なのは/g,
    message:
      '「重要なのは」はAI文で多い強調句です。本当に重要な箇所だけに絞り、普通に言い切れないか確認してください。',
  },
  {
    pattern: /ここで(面白い|興味深い)のは/g,
    message:
      '「ここで面白いのは／興味深いのは」は雑な接続句になりやすい表現です。何が起きたのかを具体的に書き始めてください。',
  },
  {
    pattern: /(と言えるでしょう|といえるでしょう|と言えます|といえます)/g,
    message:
      '「〜と言えるでしょう／〜といえます」は断言を避ける癖が見えやすい表現です。ブログ本文では普通に言い切れないか確認してください。',
  },
];

function compilePattern(pattern) {
  if (pattern instanceof RegExp) return new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`);
  return new RegExp(escapeRegExp(pattern), 'g');
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default function noAiLikeExpressions(context, options = {}) {
  const { Syntax, getSource, RuleError, report } = context;
  const rules = options.patterns ?? DEFAULT_PATTERNS;

  return {
    [Syntax.Str](node) {
      const source = getSource(node);

      for (const rule of rules) {
        const regexp = compilePattern(rule.pattern);
        let match;
        while ((match = regexp.exec(source)) !== null) {
          report(node, new RuleError(rule.message, { index: match.index }));
          if (match[0].length === 0) regexp.lastIndex += 1;
        }
      }
    },
  };
}
