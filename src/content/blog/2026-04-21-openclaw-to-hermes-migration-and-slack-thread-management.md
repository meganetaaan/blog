---
title: 'OpenClaw から Hermes へ移行したら、思ったより楽で Slack も快適だった'
description: 'OpenClaw から Hermes へ移行した実感をまとめます。Codex の model 名だけ手修正は必要でしたが、それ以外は認証情報込みでかなり素直に移り、Slack のスレッド会話管理もすぐ良くなりました。'
pubDate: '2026-04-21'
heroImage: '../../assets/blog-placeholder-2.jpg'
---

OpenClaw から Hermes への移行は、もっと手間がかかると思っていました。設定をどこまで引き継げるか分からず、認証情報まわりもやり直しになるかもしれないと見ていたからです。

実際にはかなり素直でした。私のケースでは、手で直したのは Codex の model 名くらいです。引っ越した直後から、Slack での会話管理が良くなったのもすぐ分かりました。

この記事では、移行作業そのものと、移行してすぐ感じた運用上の差を分けて書きます。

## 移行はほぼ一発で済んだ

setup 周りの評価はかなり高いです。

一言で言うと、**Codex の model 名だけ自動移行のあと手修正したが、ほかは認証情報含めコマンド一発で移行できて楽だった**、になります。

Hermes の公式 README にも、OpenClaw からの移行として `hermes claw migrate` と `hermes claw migrate --dry-run` が案内されています。

- [Migrating from OpenClaw — Hermes README](https://github.com/NousResearch/hermes-agent/blob/f81c0394/README.md#migrating-from-openclaw)
- [Messaging Gateway — Hermes docs](https://hermes-agent.nousresearch.com/docs/user-guide/messaging)

私のケースでも、中心になったのはこの移行コマンドでした。

```bash
hermes claw migrate
```

認証情報や接続設定まで含めて、日常運用に必要な土台がかなりそのまま引き継がれました。ゼロから組み直す感じではなく、既存の環境をそのまま持ってこられた感覚です。

移行機能は、問題なく終わると印象に残りにくいです。でも、それがいちばん大事です。移行のたびに「何が落ちたのか」「どの secret を入れ直せばよいのか」を掘る時間が必要だと、それだけで気持ちが削られます。今回の Hermes への移行では、その摩擦がかなり少なかったです。

## 唯一の手修正は Codex の model 名だった

完全にノータッチで終わったわけではありません。私の環境では、Codex の model 名だけは自動移行後に手で直しました。

とはいえ、調整が必要だったのはそこだけです。認証が壊れたとか、Slack 側の接続を全部やり直したとか、そういう重い話ではありませんでした。

移行後の確認で使ったコマンドは、たとえば次のようなものです。

```bash
hermes gateway status
hermes doctor
hermes gateway start
```

Slack 応答の切り分けでは、`provider: openai-codex` と `codex/gpt-5.4` の組み合わせが噛み合っていないことも確認しました。最終的には、Codex 側で通る model 名へ直すだけで済みました。

手修正が局所的で済んだので、移行全体の印象はかなり良いままです。自動移行は、完全無欠かどうかより、どこまで少ない手直しで着地できるかの方が大きいと思います。その意味で、今回の移行は十分に楽でした。

## Hermes に移ってすぐ良かったのは Slack の会話管理

移行後にすぐ分かったのは、Slack での会話のまとまり方です。

今こうしてやりとりしているこのスレッドも、Hermes は一つの会話として扱えています。話題が前後しても、同じ thread の文脈を続けて読めている感じがあります。

OpenClaw では、ここに少し不安がありました。同じチャンネルの中で複数スレッドが並んでいると、別の thread の会話が混ざっているように見える場面があり、会話の境界がやや怪しいことがありました。

Hermes の release note を見ると、v0.3.0 で「progress messages, responses, and session isolation all respect threads」と明記されています。

- [RELEASE v0.3.0 — Slack thread handling overhaul](https://github.com/NousResearch/hermes-agent/blob/f81c0394/RELEASE_v0.3.0.md#slack)

会話管理は外から完全に見えるものではありませんが、使っている側にはかなり分かります。文脈がずれた返答が減るか、話の継ぎ目が自然か、別スレッドの話を急に持ち込まないか。このあたりは、日常的に触っているとすぐ差が出ます。

Hermes には、後発らしいスマートさがあります。派手な新機能というより、会話の境界をちゃんと扱う基礎体力が上がっている印象です。

## この差は日々の任せやすさに効く

エージェントを日常で使うときは、単発で派手な答えを返すことより、会話を壊さないことの方が大事です。

たとえば Slack の thread ごとに相談内容が違うとき、欲しいのは「広く覚えている感じ」ではなく、「今この thread の話だけをちゃんと続けてくれる感じ」です。別の会話が混ざると、それだけで確認コストが上がりますし、任せる側の集中も切れます。

Hermes に移って最初に感じた価値もそこでした。会話の境界が安定したことで、任せるときの信頼感が上がりました。

地味な差ですが、日々使う道具として見ると、こういう部分の方があとから効いてきます。

## まとめ

OpenClaw から Hermes への移行は、私のケースではかなりスムーズでした。手で直したのは Codex の model 名くらいで、それ以外は認証情報を含めて素直に引き継げました。

移行の価値は setup の楽さだけではありません。Slack のスレッドを一つの会話として扱う感じが明確に良くなり、日常運用での安心感も上がりました。

OpenClaw からの移行を迷っているなら、少なくとも私の感触では試す価値は十分にあります。移行コストに対して、得られる改善は思ったより大きいです。
