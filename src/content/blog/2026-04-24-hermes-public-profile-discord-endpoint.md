---
title: 'Hermes の public profile で Discord 向け公開エンドポイントを分けて作る'
description: 'Hermes の profile 機能を使って、個人用の環境とは別に Discord から呼べる public profile を作った記録です。将来的な公開運用を見据えつつ、まずは信頼できる一部の人だけが使えるように権限を絞りました。'
pubDate: '2026-04-24'
heroImage: '../../assets/blog-placeholder-1.jpg'
---

Hermes を自分用の Slack や CLI だけで使うなら、ひとつの profile で足ります。けれど、Discord サーバーに置き、最終的に不特定多数から呼べるようにしたいなら、同じ設定のまま外へ出すわけにはいきません。

最終的には、不特定多数から呼べる Hermes にしたいです。ただ、現時点ではスパムアカウントが大量に呼び出したときに守る仕組みがまだ足りません。具体的には、呼び出し頻度や消費トークン量に応じた制限を実装する必要があります。

そのため今回は、Hermes の `public` profile を作り、まず信頼できる一部の人だけが Discord から呼べる入口として分離しました。個人用 profile とは memory、config、gateway、実行環境を分けます。さらに Discord 側では role と channel と mention で入口を絞り、terminal は Podman/Docker サンドボックスに閉じ込めました。

この記事は、同じ構成を試したい人向けの手順メモです。秘密情報は出さずに、必要な設定の形と、詰まりやすかった点を残します。

## 目標にした構成

最終目標は、もっと広い人から呼べる公開 bot です。ただし、その前に呼び出し頻度やトークン量に応じた制限が必要です。そこが未実装のうちは、スパムアカウントに大量に呼ばれたときの防御が弱いままになります。

今回作ったのは、その一歩手前の構成です。公開サーバーに置きつつ、まずは信頼できる一部の人だけが呼べる Hermes にしました。

最終的な方針はこうしました。

- profile 名は `public`
- default profile とは別の `~/.hermes/profiles/public/` を使う
- Discord gateway は `hermes-gateway-public.service` として別 systemd service にする
- Discord では mention 必須にする
- 呼べる channel と role を絞り、信頼できる一部の人だけに開く
- 将来の不特定多数公開に向けて、頻度制限やトークン量制限は別途実装する前提にする
- terminal は local ではなく Podman/Docker backend にする
- public profile から見えるリポジトリは curated な read-only ghq tree に限定する
- `SOUL.md` は read-only mount、`memory/` は profile-local にする
- file / code execution / messaging / cronjob は外す

Hermes の profile 機能は v0.6.0 で入りました。release note には、profile ごとに config、API keys、memory、sessions、skills、gateway service を分離できると書かれています。

- [Hermes Agent v0.6.0 — Profiles / Multi-Instance](https://github.com/NousResearch/hermes-agent/blob/main/RELEASE_v0.6.0.md#highlights)

この分離が、将来の公開運用に向けた試験場を、個人用環境から切り離すうえでいちばん効きました。

## 前提

この記事の手順は、次を前提にしています。

- Hermes v0.6.0 以上がインストール済み
- `hermes` コマンドが shell から実行できる
- OpenAI 互換 API の API key がある
- Discord Developer Portal で bot を作成済みで、bot token を取得済み
- Linux または WSL 上で `systemctl --user` が使える
- Docker または Podman が使える
- `git` が使える

確認例は次の通りです。

```bash
hermes --version
hermes doctor
docker --version || podman --version
systemctl --user status
```

## public profile を作る

まず profile を作ります。

```bash
hermes profile create public
```

以後、public profile に対する操作は `--profile public` または `-p public` を付けます。

```bash
hermes --profile public config
hermes --profile public doctor
hermes --profile public gateway status
```

profile の中身は、通常の `~/.hermes/` ではなく次の下に置かれます。

```text
~/.hermes/profiles/public/
├── .env
├── SOUL.md
├── config.yaml
├── memory/
├── logs/
├── state.db
└── ...
```

個人用 profile の token や memory は共有しません。Discord に出す bot は、別の HERMES_HOME を持つ別個体として扱います。

## model と最小 toolset を決める

私の public profile では、model は OpenAI API 側へ向けました。例としては次のような形です。

```yaml
model:
  provider: custom
  default: gpt-4.1
  base_url: https://api.openai.com/v1
  api_mode: chat_completions
```

API key は `~/.hermes/profiles/public/.env` に置きます。記事や GitHub には絶対に書きません。

```bash
# ~/.hermes/profiles/public/.env
OPENAI_API_KEY=sk-...
DISCORD_BOT_TOKEN=...
DISCORD_ALLOWED_ROLES=123456789012345678
```

toolset は狭くしました。特に `file` は read-only ではなく write や patch も含むので、公開 profile では外しています。

```yaml
toolsets:
  - public-safe

custom_toolsets:
  public-safe:
    - clarify
    - memory
    - session_search
    - terminal
    - todo
    - vision
    - web
```

`terminal` は残していますが、後述のサンドボックス前提です。サンドボックスなしで public profile に terminal を出すのはおすすめしません。

## terminal を Podman/Docker sandbox に閉じる

terminal backend は `docker` にします。Hermes は Docker 互換 runtime として Podman も使えます。WSL では Podman を使い、明示的に runtime を指定しておくと安定しました。

```bash
# ~/.hermes/profiles/public/.env
HERMES_DOCKER_BINARY=/usr/bin/podman
```

`config.yaml` 側は、たとえば次のようにします。

```yaml
terminal:
  backend: docker
  cwd: /workspace/ghq
  docker_image: docker.io/nikolaik/python-nodejs:python3.11-nodejs20
  docker_mount_cwd_to_workspace: false
  docker_env:
    GHQ_ROOT: /workspace/ghq
  docker_volumes:
    - /home/YOUR_USER/.hermes/profiles/public/SOUL.md:/workspace/profile/SOUL.md:ro
    - /home/YOUR_USER/.hermes/profiles/public/memory:/workspace/profile/memory
    - /home/YOUR_USER/.hermes/profiles/public/ghq:/workspace/ghq:ro
```

短い image 名ではなく、`docker.io/...` まで書きます。Podman では unqualified image name の解決に失敗することがあります。

公開 profile から読ませたいリポジトリは、個人用の ghq root ではなく、public profile 専用の場所へ置きます。mount するディレクトリも先に作っておきます。

```bash
mkdir -p ~/.hermes/profiles/public/{memory,ghq/github.com/stack-chan}
touch ~/.hermes/profiles/public/SOUL.md
cd ~/.hermes/profiles/public/ghq/github.com/stack-chan
git clone https://github.com/stack-chan/stack-chan.git
```

`SOUL.md` は profile 作成時に存在していればそのままで構いません。ここでは、container mount が存在しない path で失敗しないように明示しています。

必要な repository だけをこの tree に入れ、container には read-only mount します。これで、Discord から呼ばれた Hermes が見られる範囲をかなり小さくできます。

## Discord 側の入口を絞る

Discord は、見えていることと呼べることを分けて考えます。最終的には広く呼べる bot にしたいですが、頻度制限やトークン量制限がない段階では、全員が使える状態にはしません。

現在の Hermes config では、Discord の設定は top-level の `discord:` に書けます。Hermes 側では、mention 必須、role allowlist、必要なら channel allowlist を設定します。channel 制限は Discord 側の権限でも必ず絞ります。

```yaml
discord:
  require_mention: true
  allowed_channels:
    - "1095727441416290394"
  auto_thread: true
  reactions: true
  allow_mentions:
    everyone: false
    roles: false
    users: true
    replied_user: false
```

role 制限は `.env` に置きます。

```bash
DISCORD_ALLOWED_ROLES=123456789012345678
```

ここは role 名ではなく、**Discord role ID** です。`bot-tester` のような名前を書いても一致しません。

`allowed_channels` の ID は例です。自分の Discord server の channel ID に置き換えてください。

channel ごとに補足 context を渡したい場合は、`discord.channel_prompts` を使えます。たとえば、public profile の sandbox から見える repository を明示しておくと、bot が最初から正しい場所を見に行きやすくなります。次の channel ID と repository path も例です。

```yaml
discord:
  channel_prompts:
    "1095727441416290394": |
      Public Discord context.

      The terminal sandbox starts in /workspace/ghq and the following repositories
      are mounted read-only there:

      - /workspace/ghq/github.com/stack-chan/stack-chan

      When the user asks about repository locations or contents, check these mounted
      paths first. They are reference repositories only; do not assume write access.
```

channel ID も role ID も、自分の Discord server の値へ置き換えます。

## Discord Developer Portal で必要だった設定

Hermes の設定だけでは足りません。Discord Developer Portal 側の bot 設定も必要です。

私が詰まったのは privileged intents でした。ログには次のようなエラーが出ました。

```text
discord.errors.PrivilegedIntentsRequired:
Shard ID None is requesting privileged intents that have not been explicitly enabled in the developer portal.
```

public profile で role allowlist を使う場合、Hermes は member 情報を見る必要があります。そのため Discord Developer Portal で、少なくとも次を確認します。

- Message Content Intent を有効にする
- Server Members Intent を有効にする（role allowlist を使う場合）
- bot に対象 channel の `View Channels` / `Send Messages` / `Read Message History` を付ける
- auto thread を使うなら `Create Public Threads` / `Send Messages in Threads` も付ける
- response にリンクや埋め込みが必要なら `Embed Links` も付ける

実際、privileged intents を直したあと、gateway は Discord に接続できるようになりました。bot 名や slash command 数は環境によって変わります。

```text
[Discord] Connected as kasane-agent#5541
✓ discord connected
Gateway running with 1 platform(s)
[Discord] Synced 41 slash command(s)
```

## gateway を public profile 用 service として動かす

systemd user service は profile ごとに分けます。次の内容を `~/.config/systemd/user/hermes-gateway-public.service` として保存します。

```ini
[Unit]
Description=Hermes Gateway public profile
After=network-online.target

[Service]
Type=simple
WorkingDirectory=/home/YOUR_USER/.hermes/hermes-agent
Environment="HERMES_HOME=/home/YOUR_USER/.hermes/profiles/public"
ExecStart=/home/YOUR_USER/.hermes/hermes-agent/venv/bin/python -m hermes_cli.main --profile public gateway run --replace
Restart=on-failure
RestartSec=30
RestartForceExitStatus=75
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=default.target
```

`/home/YOUR_USER/.hermes/hermes-agent/...` は私のインストール例です。`which hermes` や自分のインストール手順に合わせて、`ExecStart` と `WorkingDirectory` を置き換えてください。

```bash
systemctl --user daemon-reload
systemctl --user enable --now hermes-gateway-public.service
systemctl --user status hermes-gateway-public.service --no-pager -l
journalctl --user -u hermes-gateway-public.service -f
```

起動後は、Hermes 側でも profile を指定して確認します。

```bash
hermes --profile public gateway status
hermes --profile public doctor
```

default profile の `hermes gateway status` だけを見ると、public profile の状態を見落とします。

`gateway status` で Discord platform が running / connected になっていれば、少なくとも gateway 側は起動しています。そこから先は Discord の権限や allowlist を確認します。

## 無反応に見えたときに見るところ

Discord bot が gateway に接続していても、mention に反応しないことがあります。その場合は、だいたい入口のどこかで落ちています。

確認した順番は次の通りです。

1. systemd service が `active (running)` か
2. `journalctl --user -u hermes-gateway-public.service -f` に Discord 接続ログが出ているか
3. Discord Developer Portal で Message Content Intent が有効か
4. role allowlist を使うなら Server Members Intent が有効か
5. `DISCORD_ALLOWED_ROLES` が role 名ではなく role ID か
6. 対象ユーザーにその role が付いているか
7. bot に対象 channel の閲覧・送信権限があるか
8. `discord.require_mention: true` の場合、実際に bot を mention しているか
9. `discord.auto_thread: true` の場合、返信が親 channel ではなく thread に出ていないか

特に `auto_thread` は見落としやすいです。親 channel に何も出ていないように見えて、実際には作成された thread 側に返答が出ることがあります。

## 最小構成のまとめ

読者が試すなら、まずはこのくらいまで削った構成がよいと思います。以下を `~/.hermes/profiles/public/config.yaml` に保存します。既存の設定がある場合は、同じ top-level key を重複させずに merge してください。

```yaml
model:
  provider: custom
  default: gpt-4.1
  base_url: https://api.openai.com/v1
  api_mode: chat_completions

toolsets:
  - public-safe

custom_toolsets:
  public-safe:
    - clarify
    - memory
    - session_search
    - terminal
    - todo
    - vision
    - web

terminal:
  backend: docker
  cwd: /workspace/ghq
  docker_image: docker.io/nikolaik/python-nodejs:python3.11-nodejs20
  docker_mount_cwd_to_workspace: false
  docker_env:
    GHQ_ROOT: /workspace/ghq
  docker_volumes:
    - /home/YOUR_USER/.hermes/profiles/public/SOUL.md:/workspace/profile/SOUL.md:ro
    - /home/YOUR_USER/.hermes/profiles/public/memory:/workspace/profile/memory
    - /home/YOUR_USER/.hermes/profiles/public/ghq:/workspace/ghq:ro

discord:
  require_mention: true
  allowed_channels:
    - "1095727441416290394"
  auto_thread: true
  reactions: true
  allow_mentions:
    everyone: false
    roles: false
    users: true
    replied_user: false
```

`.env` は `~/.hermes/profiles/public/.env` に保存します。実際の token や API key は記事や repository に commit しないでください。

```bash
OPENAI_API_KEY=...
DISCORD_BOT_TOKEN=...
DISCORD_ALLOWED_ROLES=123456789012345678
HERMES_DOCKER_BINARY=/usr/bin/podman
```

この状態で、Discord の対象 channel から `@your-bot hello` と呼びます。role と channel の権限が合っていれば、public profile の Hermes が応答します。

## まとめ

今回の構成でよかったのは、将来の公開 Discord 連携を「個人用 Hermes をそのまま外へ出す」のではなく、profile と sandbox で別個体にできたことです。

Hermes の profile は、memory、config、gateway service、実行環境を分けられます。外向きの入口を作るとき、この分離はかなり使いやすいです。

一方で、Discord 側の privileged intents、role ID、channel 権限、auto thread は詰まりやすいです。gateway が起動しているのに無反応に見えるときは、model より先に Discord の入口を確認した方が早い場面がありました。

公開 server に置く bot は、便利さより先に境界線を決める必要があります。呼び出し頻度やトークン量で制限できるまでは、信頼できる一部の人にだけ開く。この段階を作るうえで、今回の `public` profile は素直に扱える構成でした。
