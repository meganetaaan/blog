---
title: 'Perry を触ってみた, TypeScript ネイティブコンパイラの現在地'
description: 'Perry をローカルで試し、hello world から npm パッケージ互換まで手を動かして見えたことを整理します。'
pubDate: '2026-04-19'
heroImage: '../../assets/blog-placeholder-4.jpg'
---

Perry は、TypeScript をそのままネイティブ実行ファイルへ落とすことを掲げる、かなり野心的なプロジェクトです。最初に見たときの印象は、面白いけれど主張も大きい、というものでした。

そこで今回は、紹介文をなぞるのではなく、実際にローカルで触ってどこまで動くのかを確かめました。

先に結論を書くと、Perry はもう「雰囲気だけのデモ」ではありません。hello world や一部の実用的なコードは実際に動きます。ただし、モダンな TypeScript エコシステムをそのまま持ち込める段階には、まだ達していません。

## まず通ったもの

### prebuilt binary で導入できた

今回の環境では source build 用の `cargo` が入っていなかったため、まずは Perry の prebuilt binary を使いました。最初は `clang` 不足でビルドできませんでしたが、これを入れると `perry doctor` は通りました。

つまり、少なくとも Linux/WSL 上では、

- Perry の prebuilt binary
- `clang`

があれば最初の検証を始められます。

### hello world は素直に通る

最小の `console.log("Hello from Perry")` は問題なくコンパイルでき、生成されたバイナリは約 707KB でした。

この時点で、TypeScript から小さめのネイティブバイナリを作るという Perry の中核メッセージは、少なくとも形だけではありません。

### `fetch`, `fs`, `path`, `process` の一部も動いた

次に少しだけ現実寄りのコードを試しました。

- `fetch()` で JSON API を叩く
- `writeFileSync`, `readFileSync`, `existsSync`
- `path.join`
- `process.cwd()`, `process.platform`

このあたりは通りました。`fetch` を使ったサンプルは HTTP 200 と JSON parse まで成功し、バイナリサイズは約 5MB でした。CLI や小さなユーティリティ用途であれば、すでに一定の手触りがあります。

## 怪しさが見えたもの

ここからが大事でした。

### `axios` は「通るけど信用しにくい」

`axios` は compile 自体は通り、HTTP 200 も返りました。ただし、最初の試行では `res.data.title` のような素直なアクセスが期待通りに見えず、追試では `JSON.stringify(res.data)` は出るのに最後に `SIGSEGV` で落ちました。

これはかなり重要で、Perry の npm 互換は「ビルドが通るか」だけでは判断できないことが分かります。実行時の意味が合っているか、安定しているかまで見ないといけません。

### Hono はかなり早い段階で落ちる

Hono は標準 Web API 寄りなので、もしかすると Perry と相性がいいかもしれないと思って試しました。ですが、最小の `new Hono()` で compile が止まりました。

エラーは `JsNew not yet supported` です。

つまり、Node API の互換以前に、JavaScript 側の表現をどこまで lowering できるかという段階に、まだ大きな制約があります。

### `zod` と `URL` も未対応に当たる

さらに試すと、

- `zod` は `JsCallMethod not yet supported`
- `new URL(...)` は `UrlNew not yet supported`

で落ちました。

ここでかなり輪郭が見えました。Perry の現在地は「TypeScript なら広くいける」ではなく、「Perry がすでに面倒を見られる表現に収まっていれば強い」です。

### `uuid` は通るけれど意味が怪しい

`uuid` は compile / 実行ともに通りましたが、出力は期待する UUID 文字列ではなく `[object Object]` でした。

この挙動も示唆的です。コンパイル成功は、必ずしも実行結果の正しさを保証しません。

## 逆に意外だったもの

### `fastify` の最小は通った

いちばん意外だったのは `fastify` です。最小の route 定義コードは compile でき、実行時にも route 登録らしきログが出ました。

ただし、今回試したのは本当に最小限で、実際にサーバーとして待ち受けて叩き込むところまでは見ていません。ここは「完全に使える」と言うにはまだ早いですが、「docs の claim が全部空ではない」と感じたポイントでした。

## `perry init` はかなり素直

検証の最後に `perry init` を試しました。

結果はよくできています。

- `perry.toml`
- `src/main.ts`
- `tsconfig.json`
- `.perry/types/` の type stubs

が生成され、そのまま `perry compile src/main.ts -o app` でビルドし、`Hello from Perry!` まで確認できました。

少なくとも初回体験としては、ここはかなり良いです。インストール後に「何から始めればいいか分からない」で詰まる感じは薄いです。

## examples を見ると、Perry の「現在地」と「夢」が分かれる

リポジトリ同梱のサンプルを掘ると、Perry の examples は大きく 2 種類に分かれていました。

### `examples/` は比較的現実寄り

ここには `wasm_ui_demo.ts` と `widget_demo.ts` があります。

- `wasm_ui_demo.ts` は `--target wasm` で実際に HTML 出力まで成功しました
- `widget_demo.ts` は `--target android-widget` で Kotlin source 一式を生成できました

この 2 つは、少なくとも私の手元では「いま実際に見せられる能力」として成立している印象です。特に widget code generation は、ただの宣伝文句より一段踏み込んでいます。

### `example-code/` はかなり aspirational

一方で `example-code/` には、

- Express + PostgreSQL
- Fastify + Redis + MySQL
- Hono + MongoDB
- Koa + Redis
- NestJS + TypeORM
- Next.js + Prisma

のような、かなり大きなサーバー / フレームワーク例が並んでいます。

ここは読み方に注意が必要でした。たとえば `hono-mongodb` は、最小 Hono サンプルが通らなかったので、もしかすると Perry 向けの回避策があるのかと思いました。ですが、実際に compile すると `hono`, `@hono/node-server`, `zod`, `bcryptjs` などが unresolved import になり、一部 module は LLVM 段階で失敗し、それでも empty stub で linking を続けようとして最終的に link failure になりました。

つまり `example-code/` は、

- 「この方向も狙っている」という互換性目標
- あるいは「将来的に成立させたい統合例」

としては意味がありますが、現時点でそのまま成功例として受け取るのは危険です。

### Linux GUI はサポート対象らしい

docs を見る限り、Linux GUI は GTK4 ベースでかなり前面に押し出されています。README でも Linux は GTK4 がデフォルト扱いで、`perry/ui` による declarative UI をネイティブ widget へ落とす構成です。

ただし、今回の実測では UI サンプルまではまだ検証していません。npm や Web API まわりで lowering の限界が見えている以上、UI についても docs の見た目だけで信用しすぎない方がよさそうです。

## ロードマップとプラットフォームの見え方

公開情報をざっと見た範囲では、明確な GitHub milestone ベースのロードマップは見当たりませんでした。最新 release も直近は CI 修正中心で、外から追いやすい「次に何が来るか」はあまり強く見えません。

また、サポート対象として見えてくるのは、

- macOS, Windows, Linux
- iOS, Android, tvOS, watchOS
- Web, WASM
- 各種 widget ターゲット

であり、ESP32 のようなマイコン向けは入っていません。

この意味で Perry は、Moddable や ESP32 の系譜というより、デスクトップ / モバイル / Web を TypeScript からネイティブへ寄せる試みとして見る方が自然です。

## いまの結論

私の現時点の評価は次のとおりです。

- Perry は、すでに一部の TypeScript を本当にネイティブ実行ファイルへ落とせる
- hello world, `fetch`, 基本的な `fs/path/process`, `perry init` の体験はよい
- `examples/` の WASM / widget 系は比較的説得力がある
- ただし npm 互換や標準 Web API 互換は、まだかなり慎重に見るべき
- `example-code/` の大きなフレームワーク例は、現状では成功例というより互換性目標に近い
- compile 成功だけでなく、実行時の意味や安定性まで確認しないと危ない

ひとことで言えば、Perry は *面白いし、もう触る価値はある* です。
ただし、それは「広く実用になっている」という意味ではなく、「狭いが本物の領域がすでにある」という意味です。

現時点の私なら、Perry を

- 小さな CLI
- 実験的な native utility
- host-side tool
- 将来の可能性を探る検証対象

として扱います。逆に、既存の TypeScript / npm 資産を大きく載せ替える前提では、まだかなり慎重になります。

新しい技術は、大きな夢を語るほど実際に触ってみる価値があります。Perry はまさにそのタイプでした。夢だけでなく、ちゃんと動く部分もある。けれど、境界線はまだかなりはっきりしている。今はそんな段階に見えます。
