const DEFAULT_PATTERNS = [
  {
    pattern: 'この記事では',
    message: '「この記事では」は本文の主語や視点が弱くなりやすい定型句です。何を見た／作った／試したのかから始めると、AI っぽさが薄まります。',
  },
  {
    pattern: '本記事では',
    message: '「本記事では」は説明文の定型句に寄りやすい表現です。読者に渡す具体的な観察や判断から始めることを検討してください。',
  },
  {
    pattern: '解説します',
    message: '「解説します」は汎用的な締めになりやすい表現です。「何を確認した」「どこで詰まった」など、本文固有の動詞に置き換えられないか確認してください。',
  },
  {
    pattern: 'ご紹介します',
    message: '「ご紹介します」は宣伝・量産記事っぽさが出やすい表現です。実体験や判断を含む表現へ寄せることを検討してください。',
  },
  {
    pattern: 'いかがでしたでしょうか',
    message: '「いかがでしたでしょうか」は定型的なまとめ表現です。記事で得た判断や次の行動を具体的に書く方が自然です。',
  },
  {
    pattern: '詳しく見ていきましょう',
    message: '「詳しく見ていきましょう」は AI 生成文で頻出する導入句です。すぐに具体的な対象・差分・観察へ入ることを検討してください。',
  },
  {
    pattern: '結論から言うと',
    message: '「結論から言うと」は便利ですが定型的です。結論そのものを主語にして短く書けないか確認してください。',
  },
  {
    pattern: '結論から書くと',
    message: '「結論から書くと」は便利ですが定型的です。結論そのものを主語にして短く書けないか確認してください。',
  },
  {
    pattern: '非常に重要',
    message: '「非常に重要」は強調だけが先に立ちやすい表現です。何に効くのか、失敗すると何が起きるのかを具体化してください。',
  },
  {
    pattern: 'とても重要',
    message: '「とても重要」は強調だけが先に立ちやすい表現です。何に効くのか、失敗すると何が起きるのかを具体化してください。',
  },
  {
    pattern: 'さまざまな',
    message: '「さまざまな」は範囲がぼやけやすい表現です。代表例を 2〜3 個に絞るか、範囲を明示してください。',
  },
  {
    pattern: 'することができます',
    message: '「することができます」は冗長になりやすい表現です。「できます」「使えます」など短くできないか確認してください。',
  },
];

function compilePattern(pattern) {
  if (pattern instanceof RegExp) return pattern;
  return new RegExp(escapeRegExp(pattern), 'g');
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function reportMatches(context, node, source, rule) {
  const { RuleError, report } = context;
  const regexp = compilePattern(rule.pattern);
  let match;

  while ((match = regexp.exec(source)) !== null) {
    report(
      node,
      new RuleError(rule.message, {
        index: match.index,
      }),
    );

    if (match[0].length === 0) {
      regexp.lastIndex += 1;
    }
  }
}

export default function noAiLikeExpressions(context, options = {}) {
  const { Syntax, getSource } = context;
  const rules = options.patterns ?? DEFAULT_PATTERNS;

  return {
    [Syntax.Str](node) {
      const source = getSource(node);
      for (const rule of rules) {
        reportMatches(context, node, source, rule);
      }
    },
  };
}
