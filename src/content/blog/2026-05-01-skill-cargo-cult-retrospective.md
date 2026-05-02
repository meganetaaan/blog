---
title: 'スキルの無駄遣いに気づいた日'
description: 'Codex のトークンが一週間分の上限に到達したことをきっかけに、raas の自動開発で起きていた「スキルの過剰適用」を点検し、cron lane 全廃と決定論的な spec への置き換えに踏み切った記録です。'
pubDate: '2026-05-01'
heroImage: '../../assets/blog-placeholder-3.jpg'
---

[Codex](https://developers.openai.com/codex/) のトークン消費が、一週間分の上限に到達してしまいました。今までこんなに早く上限に届いたことはなかったので、何か運用が壊れている合図だと思って、開発を止めて点検しました。

調べてみると、トークンを溶かしていたのは特定の機能でも特定の実装でもなく、私が [Hermes](https://github.com/NousResearch/hermes-agent) に渡していた「スキル」のひとつでした。スキルが自動開発のレーンを誤った方向に走らせていて、レーンはスキルに忠実に従うほど、本来守るべき大方針からは離れていきました。

この記事は、その点検の流れと、最終的にどうやって運用を建て直したかの記録です。

## きっかけ: 一週間分のトークンが消えた

まず、こちらが [raas](https://github.com/meganetaaan/raas) のリポジトリです。Stack-chan の管理用 Web サービスとして開発を進めていて、自動開発レーンも複数走らせています。

事象は単純で、[Codex](https://developers.openai.com/codex/) のトークン上限に思いのほか早く到達したことです。直近の PR やコミットを並べてみると、すぐに違和感がありました。1日のうちに、ほぼ同じテーマの細かい frontend リファクタ PR が連鎖的に並んでいます。

- `LoadingState` への移行 PR が 7 本
- `SectionPanel` への移行 PR が 10 本
- `FormField` への移行 PR が 5 本
- `Alert` への移行 PR が 10 本

しかも各 PR は `+4/-6` 行のような極小のものが多く、それぞれにフルセットの儀式（worktree 作成、RED テスト、UX レビューブロック、スクリーンショット、Project ボード移動）が付いていました。儀式コストが、コード変更の価値を完全に上回っています。

## スキルが「次にやる作業の台本」になっていた

調べてみると、原因の中心にあったのは `raas-frontend-ui-review-gates` というスキルでした。もともとはレビュー観点をまとめた薄いスキルだったのですが、運用しているうちに次のような節がどんどん追記され、6,000 語を超えるサイズに育っていました。

- 「`MasterDetailLayout` の follow-on migration はこの順序で進めるとよい」
- 「`SectionPanel` の次に安全な対象は audit history と members context」
- 「robots/からだの `FormField` follow-on は、`MasterDetailLayout`、`SectionPanel`、`EntityMeta`、`StatusBadge`、`Alert`、`LoadingState` が wrap されたあとに…」

レビュー観点のスキルだったはずなのに、いつの間にか「次にやる作業の台本」が大量に書き足されていました。これを cron で動く自動開発レーンが読むと、毎回そのまま「次の primitive の follow-on を進めよう」と機械的に解釈します。

その結果として起きていたのは、こういう流れです。

1. レーンが起動する
2. スキルを読む
3. 「次は SelectInput の follow-on を robots に当てるとよい」と書いてあるので、それを実行する
4. PR を作り、レビュー儀式を経て、+11/-9 行が main に入る
5. 11 分後にまたレーンが起動する
6. スキルには次の安全な migration target がまだ並んでいるので、また実行する

スキルに忠実に従うほど、PR は粒度が細かくなり、トークンは消費されていきます。

## 大方針はむしろ破られていた

皮肉なのは、こうして `primitives/` を肥大化させているあいだに、本来守りたかった大方針のほうは破られていたことです。

raas には [ADR](https://adr.github.io/) 0004 として「shadcn/ui と Tailwind の実装詳細を端に隠す」という決定があります。ところが現状の `apps/frontend/src/pages/*` は、Tailwind が直書きで残っているページが多数ありました。`primitives/` は同じ薄ラッパーが何種類も並ぶ一方で、ページ側は痩せていません。

著者本人（つまりレーンを設計した私）も、この問題には気づいていて、いくつもの follow-up Issue を立てていました。

- ADR 0004 違反が pages 全般で残っている
- `primitives/` が「薄いラッパー」と「合成 UI」の混合バケツになっている
- pages のファイル LOC は 280〜385 行のままで、薄くなっていない

つまり、レーンは「やれる小さな作業」を量産しつつ、**本丸には手を入れる体力を残していなかった**ということです。

## やったこと: cron 全廃 + スキル削除 + 決定論的な spec

直したことを順に書きます。

### 1. cron lane を全廃した

開発が安定するまで、自走レーンは一旦すべて止めました。9 件あった cron job を、設定の JSON を退避ディレクトリに保存してから削除しています。当面は会話ベースの開発に戻します。

「会話ベース」というのは、Slack 越しに私が各作業の進め方を判断する形です。レーンの自走は便利ですが、いまの私のスキルセットでは、レーンが暴走しても気づける速度が間に合っていないと判断しました。

### 2. `raas-frontend-ui-review-gates` を完全に削除した

このスキルは、観点（どう見るか）と作業選定（次に何をやるか）が混ざった結果として、自動レーンを誤誘導する装置になっていました。アクセシビリティやトンマナのレビューは、観点と対象を限定して、会話ベースで都度判断するほうが筋がよいと考え直しました。

スキルそのものの内容自体は archive ディレクトリに退避してあるので、必要なら戻せます。経験知のうち、機械的に検出できるものは、後述の spec / lint に逃がします。

### 3. ADR 番号の重複を spec で禁止した

採番が衝突しているのを発見したので、これを直しつつ、CI で同じ事故が起きないようにしました。

```ts
// apps/backend/src/docs-adr-numbering.spec.ts
const adrFilenameRegex = /^(\d{4})-[a-z0-9-]+\.md$/;

describe("ADR filename numbering", () => {
  it("uses the four-digit-prefix kebab-case convention", () => { /* ... */ });

  it("assigns each four-digit prefix to at most one ADR file", () => {
    // 0001/0011/0012 が重複している状態で RED にする
  });
});
```

実運用としては、ADR 0001 / 0011 / 0012 がそれぞれ 2 ファイルずつ衝突していたものを、新しい側を 0014 / 0015 / 0016 に振り直しました。`docs/adr/README.md` と他のドキュメント参照も合わせて修正しています。

### 4. 層境界の逸脱を AST ベースの spec で禁止した

ADR 0006 では、すでにレイヤー境界が文章で定義されていました。たとえば「`packages/contracts` に [neverthrow](https://github.com/supermacro/neverthrow) や [Prisma](https://www.prisma.io/) や [Hono](https://hono.dev/) を持ち込まない」「backend の domain と application は infrastructure に依存しない」「frontend は backend を直接 import しない」といったものです。

これらが守られているかは、これまで「気をつけて開発する」運用で守っていました。今回これを vitest spec で機械化しました。

最初の実装は raw text の正規表現でやったのですが、自動レビューに 2 つ指摘をもらいました。

- 相対 import (`../../backend`) が素通しになる
- コメントや文字列リテラル内の `from "neverthrow"` 風テキストを誤検知する

正しい指摘だったので、[TypeScript Compiler API](https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API) を使って AST ベースで書き直しました。`ts.createSourceFile` でパースしたあと、`ImportDeclaration` / `ImportEqualsDeclaration` / `ExportDeclaration` / 動的 `import(...)` / `require(...)` から specifier を抽出します。

```ts
const visit = (node: ts.Node): void => {
  if (ts.isImportDeclaration(node)) {
    const moduleSpecifier = node.moduleSpecifier;
    if (ts.isStringLiteral(moduleSpecifier)) {
      specifiers.push(moduleSpecifier.text);
    }
  }
  // ... (ImportEquals / ExportDeclaration / dynamic import / require)
  ts.forEachChild(node, visit);
};
```

bare specifier（`neverthrow` など）はパッケージ prefix で、相対 specifier は import 元ファイルからパス解決して、forbidden ディレクトリ配下に着地するかで判定します。AST にした副作用として、コメントや文字列内の偽 import が自動的に除外されるという利点もあります。

### 5. 効くことを fault injection で実証する

今回もう一つ強く意識するようになったのは、決定論ガードを書いたら、GREEN だけで満足しないことです。

レーンが既に守っている規約を spec で固める場合、GREEN は「すでに守られている」しか意味しません。「守られていない状態で本当に CI が止まるか」は別の話です。

そこで、bypass のパターンごとに違反を仕込み、RED が出るかを確認しました。

- `apps/frontend/src/x.ts` から `import { OK } from "../../backend/src/shared/result"` → RED
- `apps/backend/src/domain/x.ts` から `import { Z } from "../infrastructure/prisma/client"` → RED
- コメントと文字列リテラルに `import { ok } from "neverthrow"` を含む → 誤検知せず GREEN

すべて期待通りの挙動をしてから main にマージしました。

## なにを学んだか

スキルというものを、もう少し慎重に扱おうと思いました。

スキルが効くのは、観点（どう見るか）と、最低限の手順（どう手を動かすか）までです。「次にこれをやれ」という作業選定にまで踏み込んだ瞬間、自動レーンは台本として読みます。台本は便利な反面、台本通りに動いた結果が常に正しいとは限りません。今回は、台本通りに動いた結果として、本来やるべきだった大方針の修正からむしろ遠ざかっていました。

決定論で殴れる規約は、スキルや prose よりも spec / lint で守るほうが安全です。スキルは育つ過程で内容が増えがちで、増えるほど自動レーンへの影響も大きくなります。spec は増えても、増えたぶんだけ機械的に検証されるだけです。育っても暴走しません。

それから、決定論ガードは GREEN だけで十分ではないということも、改めて実感しました。意図した違反が RED を出すまで確認して初めて、効くことを示せます。これは今後のスキルの落とし穴セクションにも書き残しておきます。

## いま走っているもの

cron は全部止めました。代わりに：

- ADR 番号の一意性は `apps/backend/src/docs-adr-numbering.spec.ts` で守られています
- 層境界の逸脱は `apps/backend/src/layer-boundaries.spec.ts` で守られています

次は、`pages/*` の Tailwind 直書きを単調減少のみ許す ratchet 型 spec、`primitives/` のサイズ予算と `useState` 等の検出、といったあたりを同じ流儀で機械化していくつもりです。

トークン上限に当たる前に気づきたかった、というのが正直な気持ちですが、上限に当たったから一度立ち止まれた、とも言えます。便利な道具に乗せた処理ほど、暴走したときに見えにくいので、そこに使う燃料の量は普段から目に入る場所に置いておきたいです。
