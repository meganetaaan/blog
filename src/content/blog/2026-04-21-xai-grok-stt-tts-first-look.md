---
title: 'xAI Grok STT/TTS API を Stack-chan 観点で試した'
description: 'xAI の Grok Speech to Text / Text to Speech API を実際に動かし、音声生成、Speech Tags、リアルタイム文字起こし、短い日本語発話の扱いを確認しました。'
pubDate: '2026-04-21'
heroImage: '../../assets/blog-placeholder-5.jpg'
---

2026年4月17日、xAI は Grok Speech to Text API と Grok Text to Speech API を公開しました。

Stack-chan や音声エージェントの部品として使えるかを見るために、仕様だけでなく、実際に短い音声生成と文字起こしを試しました。TTS と通常長の STT は十分に次へ進む価値があります。一方で、短すぎる日本語コマンドと固有名詞の認識には注意が必要です。

## 何を試したか

今回試したのは、REST TTS、REST STT、Streaming STT です。

TTS では、日本語の短文を複数の voice で生成し、Speech Tags も試しました。STT では、生成した 16kHz PCM WAV を使って、通常長の日本語、英語、多言語混在、そして `はい。` のような短い発話を確認しました。

APIキーは `XAI_API_KEY` を使います。秘密情報は記事にもログにも残していません。

## Text to Speech は素直に動いた

TTS は `https://api.x.ai/v1/tts` に JSON を投げ、返ってきた音声バイト列を保存する形です。最低限必要なのは `text` と `language` で、`voice_id` を指定すると声を選べます。

今回の実行では、すべて MP3 24kHz / mono / 128kbps で生成されました。

### ara と rex の聴き比べ

xAI の voice は、少なくとも今回の API レスポンスでは `ara`, `eve`, `leo`, `rex`, `sal`, `una` が返りました。公式ドキュメント本文には5 voice と書かれている箇所がありますが、実 API は `una` を含む6件でした。

男性・女性というラベルは公式には見当たらないので、ここでは便宜的に `ara` と `rex` を、雰囲気の違う二つの声として選んでいます。

同じ台詞で生成した音声です。

`ara`

<audio controls src="/blog/audio/xai-grok-stt-tts-2026-04-21/female-ish-ara-ja.mp3"></audio>

台詞: `こんにちは、スタックチャンです。今日は新しい音声APIを試しています。`

`rex`

<audio controls src="/blog/audio/xai-grok-stt-tts-2026-04-21/male-ish-rex-ja.mp3"></audio>

台詞: `こんにちは、スタックチャンです。今日は新しい音声APIを試しています。`

生成時間は `ara` が約1.70秒、`rex` が約1.58秒でした。短文のREST生成としては、ブログ用の素材作成や非リアルタイムの返答生成には扱いやすい速さです。

## Speech Tags は日本語でも試せる

公式ドキュメントでは、発話表現の制御は Speech Tags として説明されています。`[laugh]`, `[pause]`, `[sigh]` のようなインラインタグと、`<whisper>...</whisper>`, `<slow>...</slow>`, `<emphasis>...</emphasis>` のような囲みタグがあります。

`[laugh]` と `[pause]` を入れた例です。

<audio controls src="/blog/audio/xai-grok-stt-tts-2026-04-21/expressive-ara-ja.mp3"></audio>

台詞: `こんにちは、スタックチャンです。[laugh] 今日は音声の表現力を試しています。[pause] うまく聞こえますか？`

`<whisper>` と `<slow>` を入れた例です。

<audio controls src="/blog/audio/xai-grok-stt-tts-2026-04-21/whisper-slow-rex-ja.mp3"></audio>

台詞: `通常の声で話します。<whisper>ここだけ小声で話します。</whisper> <slow>最後はゆっくり話します。</slow>`

この機能は、Stack-chan のようなキャラクター性を持つデバイスとは相性がよいと思います。ただし、タグを多用すると演技が過剰になりやすいはずなので、実際の会話では少数のタグを慎重に使うのがよさそうです。

## instructions フィールドは公式には見当たらない

TTS の request body として公式ドキュメントに載っているのは、主に `text`, `voice_id`, `language`, `output_format` です。OpenAI の一部音声APIのような、明示的な `instructions` フィールドは見当たりませんでした。

試しに未知フィールドとして `instructions` を含めたところ、API は HTTP 200 を返しました。

<audio controls src="/blog/audio/xai-grok-stt-tts-2026-04-21/instruction-field-ara-ja.mp3"></audio>

台詞: `こんにちは、スタックチャンです。落ち着いた案内役として話してください。`

追加で投げたフィールド: `instructions: Speak like a calm robot guide.`

ただし、これは「拒否されない」ことの確認です。意味的に効いているかは、同じ台詞で `instructions` なしの対照音源を作り、聴き比べる必要があります。現時点では、Grok TTS の制御は Speech Tags を本線として見るのが安全です。

## REST STT の結果

REST STT は `https://api.x.ai/v1/stt` に `multipart/form-data` で音声を送ります。`file` か `url` が必要です。

通常長の日本語は、意味としては問題なく取れました。

入力: `こんにちは、スタックチャンです。音声認識のテストをしています。`

出力: `こんにちはスタックちゃんです 音声認識のテストをしています`

所要時間は約0.96秒でした。句読点は落ち、`スタックチャン` は `スタックちゃん` になりましたが、会話用途で意味を取るには十分です。固有名詞として正確に残したい場合は、後処理か用語補正が必要です。

英語では、`Stack-chan` が `Stack Chat` になりました。

入力: `Hello, this is Stack-chan. We are testing real time transcription.`

出力: `"Hello, this is Stack Chat. We are testing real time transcription.`

ここも、Stack-chan 用途ではそのまま信用しすぎない方がよいです。

## 多言語混在はまだ慎重に見る

英語と日本語を混ぜた入力も試しました。

入力: `Hello, I am Stack-chan. こんにちは、音声APIをテストしています。`

REST の言語判定は Japanese になり、出力は次のようになりました。

`ハロウ、アイムスタックチェン、こんにちはオンセイピアをテストしています`

英語部分はカタカナ寄りに倒れ、日本語部分も `音声API` が少し崩れました。多言語リアルタイム会話の入口としては面白いですが、自然な会話ログとしてそのまま採用するにはまだ不安があります。

言語判定そのものはあります。REST のレスポンスには `language` が返ります。ただし、`format=true` を使う場合は `language` が必須で、指定しないと HTTP 400 になります。つまり「自動判定しつつ整形」には制限があります。

## Streaming STT は部分結果が取れる

Streaming STT は `wss://api.x.ai/v1/stt` を使います。16kHz PCM を100ms程度のチャンクで送り、JSON の transcript events を受け取る形です。

`interim_results=true` にすると、途中結果が流れます。今回の通常長日本語では、接続開始から約1.0秒で最初の partial が来ました。

入力: `こんにちは、スタックチャンです。音声認識のテストをしています。`

途中結果は次のように流れました。

- `こんにちは`
- `スタックチャンです`
- `音声認識`
- `音声認識のテスト`
- `音声認識のテストをしています`

これは、会話UIの字幕や、聞き取り中の状態表示には十分試す価値があります。

## サーバーサイド VAD 相当はある

公式ドキュメントでは、Streaming STT の query parameter に `endpointing` があります。説明は「utterance-final event を出す前の無音継続時間」です。範囲は `0-5000` ms で、`0` は VAD の無音境界で即時に発火する扱いです。

また、`transcript.partial` には `is_final` と `speech_final` があり、途中結果、チャンク確定、発話確定を区別できます。

Stack-chan のような会話デバイスでは、これはかなり大事です。ユーザーが話し終わったかどうかをクライアント側だけで抱え込まず、サーバー側の endpointing を使って turn-taking を組める可能性があります。

## 短すぎる日本語は弱い

今回いちばん注意が必要だったのは、短い日本語です。

入力: `はい。`

REST では `Hi`、Streaming では `Height` になりました。`language=ja` を指定しても改善しませんでした。

これは Stack-chan 用途では無視できません。実際の会話では、「はい」「いや」「うん」「これ」「次」のような短い発話が頻繁に出ます。短いコマンドをそのまま STT に任せると、英語っぽい誤認識に寄る可能性があります。

対策としては、次のようなものが必要です。

- wake word やボタン操作で文脈を補う
- 短い返答は確認フローを入れる
- コマンド候補を限定して後処理する
- 本番評価では実マイク音声で再測定する

## OpenAI や ElevenLabs と比べると

料金だけ見ると、xAI はかなり攻めています。

STT は REST が $0.10/hour、Streaming が $0.20/hour です。ElevenLabs Scribe は確認時点で $0.22/hour、Scribe Realtime は $0.39/hour でした。OpenAI の `gpt-4o-mini-transcribe` は推定 $0.003/minute とされていて、分単価ではこちらも強いです。

TTS は $4.20 / 1M characters です。ElevenLabs の API pricing は Flash/Turbo が $0.05 / 1K characters、Multilingual v2/v3 が $0.10 / 1K characters なので、文字単価では xAI がかなり安く見えます。OpenAI の legacy TTS は $15 / 1M characters、TTS HD は $30 / 1M characters です。

ただし、音声APIは料金だけでは決められません。Stack-chan では、短い応答の自然さ、固有名詞、短い発話、会話の間、キャラクター性が重要です。ここは実測で見ないと判断できません。

## 今の判断

Grok STT/TTS は、Stack-chan 周辺で次に試す価値があります。

特に TTS は、短文生成の速さ、価格、Speech Tags の存在が魅力です。キャラクターの声として合うかは聴き比べが必要ですが、ブログ素材やプロトタイプ用にはすぐ使えます。

STT は、通常長の日本語発話と Streaming partial はよい手触りでした。一方で、短い日本語と固有名詞、多言語混在はまだ弱いです。

つまり、いまの採用判断はこうです。

- TTS: 継続検証する価値が高い
- STT REST: 通常長の発話なら試す価値あり
- STT Streaming: 会話UI向けに試す価値あり
- 短い日本語コマンド: そのまま採用するのは危険
- 多言語リアルタイム会話: 可能性はあるが、実マイク音声で再評価が必要

次は、TTS の声を実際に聴いて Stack-chan に合う voice を選ぶこと、そして実マイク音声で OpenAI / ElevenLabs と横並び比較することです。

参考:

- [Grok Speech to Text and Text to Speech APIs](https://x.ai/news/grok-stt-and-tts-apis)
- [Speech to Text | xAI Docs](https://docs.x.ai/developers/model-capabilities/audio/speech-to-text)
- [Text to Speech | xAI Docs](https://docs.x.ai/developers/model-capabilities/audio/text-to-speech)
- [Models and Pricing | xAI Docs](https://docs.x.ai/developers/models)
- [OpenAI API Pricing](https://platform.openai.com/docs/pricing/)
- [ElevenLabs API Pricing](https://elevenlabs.io/pricing/api/)
