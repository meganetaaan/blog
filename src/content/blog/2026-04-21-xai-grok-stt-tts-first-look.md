---
title: 'xAI Grok STT/TTS API を Stack-chan 観点で見る'
description: 'xAI が公開した Grok Speech to Text / Text to Speech API を、仕様、料金、制約、Stack-chan 用途の観点で整理します。'
pubDate: '2026-04-21'
heroImage: '../../assets/blog-placeholder-5.jpg'
---

2026年4月17日、xAI は Grok Speech to Text API と Grok Text to Speech API を公開しました。

Stack-chan や音声エージェントの部品として使えるかを見るために、まずは一次情報から仕様と料金を確認しました。結論から言うと、仕様だけ見るとかなり試す価値があります。ただし、今回の手元環境には `XAI_API_KEY` が設定されていなかったため、実際の音声生成と文字起こしはまだ未検証です。

この記事は、実測前の評価メモです。動かした結果ではなく、次に何を試すべきかを決めるための整理として書いています。

## 公開されたもの

xAI の発表では、今回の API は Grok Speech to Text と Grok Text to Speech の二つです。

- Speech to Text は、音声ファイルの一括文字起こしと WebSocket によるリアルタイム文字起こしに対応します
- Text to Speech は、REST による音声生成と WebSocket によるリアルタイム生成に対応します
- どちらも Grok Voice と同じ系統の音声基盤を使う、と説明されています

Stack-chan 観点では、REST と WebSocket の両方がある点が大事です。簡単な検証は REST で始められます。一方で、会話体験を作るなら、最終的には WebSocket の遅延と扱いやすさを見る必要があります。

## Speech to Text の仕様

Speech to Text は `https://api.x.ai/v1/stt` に `multipart/form-data` で音声を送る REST API が基本です。`file` か `url` のどちらかを渡し、`format=true` と `language=ja` のような指定を組み合わせられます。

確認した範囲では、主な特徴は次のとおりです。

- 入力は WAV, MP3, OGG, Opus, FLAC, AAC, MP4, M4A, MKV などに対応
- raw PCM, μ-law, A-law も指定可能
- 最大ファイルサイズは 500MB
- word-level timestamp を返せる
- `format=true` で数字や通貨などの整形が入る
- diarization と multichannel に対応
- Streaming STT は `wss://api.x.ai/v1/stt` を使う

料金は REST が $0.10/hour、Streaming が $0.20/hour とされています。公開ページ上のモデル表では、STT は 600 RPM、10 RPS、Streaming は 100 concurrent sessions という記載がありました。

日本語は対応言語に含まれています。Stack-chan の短い発話認識で見るなら、まずは次の観点を試したいです。

- 短い日本語コマンドをどれくらい正確に拾うか
- 「ｽﾀｯｸﾁｬﾝ」や固有名詞をどう扱うか
- 句読点や数字の整形が日本語でも自然か
- WebSocket で部分結果がどれくらい早く返るか

## Text to Speech の仕様

Text to Speech は `https://api.x.ai/v1/tts` に JSON を投げ、レスポンスの raw audio bytes を保存する形で始められます。最低限必要なのは `text` と `language` で、`voice_id` は省略すると `eve` になります。

主な特徴は次のとおりです。

- `text` は1リクエスト最大 15,000 characters
- `language` は `ja`, `en`, `auto` などを指定できる
- voice は `ara`, `eve`, `leo`, `rex`, `sal` の5種類
- 出力は MP3, WAV, PCM, μ-law, A-law に対応
- 既定の出力は MP3 24kHz / 128kbps
- speech tags で `[laugh]`, `[sigh]`, `[pause]`, `<whisper>` などを指定できる
- Streaming TTS は `wss://api.x.ai/v1/tts` を使う

料金は $4.20 / 1M characters です。モデル表では 3,000 RPM、50 RPS、100 concurrent sessions と記載されています。ただし、ガイド内の WebSocket 制限には 50 concurrent sessions per team という説明もあるため、実運用前には xAI Console 上の実際のチーム制限を見る必要があります。

Stack-chan 観点で面白いのは speech tags です。表情のある読み上げが簡単に扱えるなら、ただの TTS よりキャラクター性を出しやすい可能性があります。一方で、タグが日本語発話でどれくらい自然に効くかは、実際に聞かないと判断できません。

## まだ動かせていないこと

今回の環境では `XAI_API_KEY` が設定されていませんでした。そのため、次の実測は未完です。

- 日本語 TTS の音質確認
- 英語 TTS の音質確認
- speech tags の効き方
- 日本語 STT の認識精度
- REST 呼び出し時の体感遅延
- WebSocket 時の部分結果の速さ

ここは明確なブロッカーです。APIキーが使える状態になったら、まずは REST で小さく試すのがよさそうです。

TTS は次の二文で始めます。

- 日本語: `こんにちは、スタックチャンです。今日は音声APIのテストをしています。`
- 英語: `Hello, I am Stack-chan. This is a quick voice test.`

STT は、同じ日本語文を読み上げた短い WAV か MP3 を用意し、`format=true` と `language=ja` で文字起こしします。

## OpenAI や ElevenLabs と比べるときの見方

この段階では、音質や認識精度を断定できません。まだ聞いていないからです。

ただし、比較観点はかなりはっきりしています。

- 料金: STT の時間単価はかなり安く見える。TTS は文字単価なので、短文中心の Stack-chan では試しやすい
- 遅延: REST で十分か、WebSocket が必要かを見る必要がある
- 日本語品質: 対応言語に日本語はあるが、自然さと固有名詞は実測が必要
- キャラクター表現: speech tags が日本語でも自然なら強い
- 運用: APIキーをクライアントに出さず、必ずバックエンド経由にする必要がある

Stack-chan では、長文読み上げよりも短い返答の自然さ、反応の速さ、声のキャラクター性が重要になります。つまり、ベンチマーク上の性能だけでは足りません。実際に短い会話を何度も往復させて、聞いていて疲れないかを見る必要があります。

## いまの判断

現時点の判断は、「次に試す価値はある。ただし採用判断はまだできない」です。

仕様と料金はかなり魅力があります。STT は REST と Streaming の両方があり、日本語も対象です。TTS は5 voice と speech tags があり、Stack-chan のキャラクター表現に合う可能性があります。

一方で、音声APIは仕様だけでは分かりません。特に日本語TTSの自然さ、短い音声コマンドの認識精度、WebSocket の遅延は、実際に動かして初めて判断できます。

次にやることは単純です。

1. `XAI_API_KEY` を使える環境にする
2. REST TTS で日本語と英語を1本ずつ生成する
3. REST STT で短い日本語音声を文字起こしする
4. 結果を聞いて、Stack-chan 用途で継続検証するか決める

ここまで通れば、OpenAI や ElevenLabs と並べた評価に進めます。今はその手前、試す理由と試す順番が見えた段階です。

参考:

- [Grok Speech to Text and Text to Speech APIs](https://x.ai/news/grok-stt-and-tts-apis)
- [Speech to Text | xAI Docs](https://docs.x.ai/developers/model-capabilities/audio/speech-to-text)
- [Text to Speech | xAI Docs](https://docs.x.ai/developers/model-capabilities/audio/text-to-speech)
- [Models and Pricing | xAI Docs](https://docs.x.ai/developers/models)
