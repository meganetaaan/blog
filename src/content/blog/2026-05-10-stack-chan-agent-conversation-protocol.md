---
title: 'ｽﾀｯｸﾁｬﾝ同士が会話するためのプロトコルを考える'
description: 'M5版ｽﾀｯｸﾁｬﾝが広く出回り、独自ファームウェアも増えていく前提で、エージェント同士の会話プロトコルをレイヤーごとに整理します。'
pubDate: '2026-05-10'
heroImage: '../../assets/kasane-stackchan-portrait.png'
---

<!-- textlint-disable ja-technical-writing/no-hankaku-kana -->

この記事は、ししかわさんと軽くディスカッションした内容をもとにしたメモです。

M5版ｽﾀｯｸﾁｬﾝが、数千台のオーダーで世に出ようとしています。きっと、その多くはひとつの公式ファームウェアだけで動くわけではありません。すでに多くの人が、自分の好みに合わせたファームウェアや会話システムを作っています。

今は、人間と一体のｽﾀｯｸﾁｬﾝが話す体験が中心です。けれど、もし隣のｽﾀｯｸﾁｬﾝ、友人のｽﾀｯｸﾁｬﾝ、イベント会場の別ブースにいるｽﾀｯｸﾁｬﾝと会話できたら、体験はかなり変わります。

「うちの子」と「よその子」が、同じ場で自己紹介し、話題を渡し合い、ときどき天の声に回される。そういう複数名会話を成立させるには、どんなプロトコルが必要でしょうか。

調べると、近いものはたくさんあります。[Agent2Agent Protocol / A2A](https://a2a-protocol.org/latest/) はかなり近いです。[Model Context Protocol / MCP](https://modelcontextprotocol.io/) も周辺にあります。古典的には [FIPA ACL](https://www.fipa.org/repository/aclspecs.html) や KQML、Contract Net Protocol があります。通信路としては [MQTT](https://docs.oasis-open.org/mqtt/mqtt/v5.0/mqtt-v5.0.html)、[WebRTC](https://www.w3.org/TR/webrtc/)、[Matrix](https://spec.matrix.org/latest/) も候補になります。

それでも、ｽﾀｯｸﾁｬﾝ同士の会話にそのまま合うものは見つかりませんでした。だから私は、既存の標準から部品を借りつつ、ｽﾀｯｸﾁｬﾝ向けの軽い相互運用プロトコルを考えるのがよさそうだと思っています。

## 前提を置く

ここでは、各ｽﾀｯｸﾁｬﾝを `Agent` と呼びます。

```text
Agent
  = なかみ / Ghost
  + からだ / Shell
  + 任意のおしごと / JobProfile
```

ただし、この `Agent` は特定のクラウドサービスに閉じません。RaaS の管理画面で作られた Agent でもよいし、独自ファームウェア上の会話エンジンでもよい。スマホアプリやブラウザシミュレーターが代理してもかまいません。

今回の仮定は二つです。

- 公開プロフィールは見えてよい
- 各 Agent の応答生成はブラックボックスでよい

公開プロフィールには、表示名、顔やアイコン、話し方の短い説明、対応できる会話モード、簡単な capability が含まれます。逆に、内部プロンプト、記憶、APIキー、施設知識、秘密のルールは見せません。

応答生成もそろえる必要はありません。あるｽﾀｯｸﾁｬﾝはローカルLLMで話し、別のｽﾀｯｸﾁｬﾝはクラウドLLMを使い、さらに別のｽﾀｯｸﾁｬﾝはルールベースでもよい。相互運用では、内部の作りよりも、外へ出すプロフィール、能力、会話イベントをそろえます。

## 必要なレイヤー

ｽﾀｯｸﾁｬﾝ同士の会話は、ひとつの巨大なプロトコルにしない方が扱いやすいです。少なくとも、次のレイヤーに分けて考えたいです。

```text
トランスポート
  実際にメッセージや音声を運ぶ

ディスカバリー
  近くにいる子、招待された子、接続先を見つける

ハンドシェイク
  公開プロフィール、能力、権限、セッション条件を交換する

ターンテイキング / オーケストレーション
  誰が話すか、誰が聞くか、話題をどう渡すかを決める

発展的な協調
  途中参加、離脱、Job / capability に基づく担当分け
```

この分け方にすると、独自ファームウェアでも入りやすくなります。たとえば最初はローカル WebSocket だけでよい。あとから WebRTC や MQTT、クラウドリレーを足しても、上の会話イベントを大きく変えずに済みます。

<!-- Illustration slot 1: スマホ縦長で読めるレイヤー図。中央に2体の小さなStack-chan風ロボットが向かい合い、その下に5段の縦積みカードを配置する。上から「トランスポート」「ディスカバリー」「ハンドシェイク」「ターンテイキング」「Job / capability協調」。各カードは短い日本語ラベルと小さなアイコンだけにし、横長の表は使わない。背景は淡いクリーム色、線は細く、色数は青・緑・オレンジ中心。文字はスマホ幅でも読める大きさ。 -->

## トランスポート: 何で運ぶか

トランスポートは、会話の意味を決めません。メッセージを運ぶ道です。

候補はいくつかあります。

| 候補 | 向いている場面 | 注意点 |
| --- | --- | --- |
| ローカル WebSocket / HTTP | 同じLAN内、開発しやすいデモ | NAT越えや外出先接続は別途必要 |
| WebRTC | ブラウザ、スマホ、音声、P2P | シグナリングと実装が少し重い |
| MQTT | IoT、独自ファームウェア、broker経由 | 会話意味論は自分で載せる |
| BLE | 近接発見、初回ペアリング、招待の受け渡し | 長い会話や音声には向かない |
| Matrix | ルーム、招待、履歴、連合 | 軽量デバイスには重い |
| RaaS cloud relay | 認証、監査、永続化、管理UI | これだけを前提にすると独自ファームウェア勢が入りにくい |

最初の実装は、ローカル WebSocket かスマホ/ブラウザ経由の WebRTC がよさそうです。M5Stack のような小さなデバイスでは、MQTT も現実的です。

RaaS は、この中のひとつの transport profile として置くのがよいと思います。RaaS があると管理、監査、永続化はしやすい。けれど、RaaS がないとｽﾀｯｸﾁｬﾝ同士が話せない設計にはしたくありません。

## ディスカバリー: どう見つけるか

Agent 同士が話すには、まず相手を見つける必要があります。

ここでは [A2A](https://a2a-protocol.org/latest/) の Agent Card がとても参考になります。A2A の仕様では、Agent Card は Agent の identity、capabilities、skills、endpoint、authentication requirements を記述する JSON metadata として説明されています。

ｽﾀｯｸﾁｬﾝ向けには、軽い `StackChanAgentCard` を考えられます。

```ts
type StackChanAgentCard = {
  protocolVersion: string;
  agentId: string;
  displayName: string;
  avatar?: {
    kind: "image" | "face-summary";
    url?: string;
    summary?: string;
  };
  speechStyle?: string;
  endpointKind:
    | "moddable"
    | "customFirmware"
    | "phoneCompanion"
    | "browserSimulator"
    | "cloudProxy";
  capabilities: CapabilityManifest;
  supportedTransports: SupportedTransport[];
  authRequirements: AuthRequirement[];
};
```

配布方法はいくつかあります。

- `.well-known` のような HTTP endpoint
- QRコード
- BLE advertisement
- mDNS / local discovery
- RaaS やイベント用の一時 registry
- Matrix room や Discord channel への bridge

個人利用やイベントでは、QRコードが扱いやすそうです。スマホで読み取り、相手の Agent Card を受け取り、その場で招待する。クラウド directory へ登録しなくても、小さな相互運用が始められます。

## ハンドシェイク: 何を合意するか

見つけたあと、すぐに会話を始めるのは危険です。最初に合意する情報があります。

```text
AgentHello
  - publicProfile
  - capabilityManifest
  - sessionNonce

ConversationInvite
  - conversationId
  - hostHint
  - requestedRole
  - capabilityGrant
  - expiresAt
```

ここで決めるのは、相手が誰か、どんな会話に参加するか、何を許すかです。

たとえば、次のような権限を分けます。

```text
CapabilityGrant
  - canSpeak
  - canReceiveDirectedSpeech
  - canPerformOwnShellReactions
  - canUseOwnBusinessTools
  - canAccessHostTools
  - transcriptVisibility
```

初期値は狭くします。よそのｽﾀｯｸﾁｬﾝには、話すことと、自分の表情リアクションくらいを許す。相手の内部ツールや施設データには触らせない。自分の JobProfile や秘密の記憶も渡さない。

この境界を最初から置いておくと、趣味の楽しい会話から、店舗や宿泊施設の業務利用まで広げやすくなります。

## ターンテイキング: 誰が話すか

複数のｽﾀｯｸﾁｬﾝが同時に話すと、すぐに聞き取りづらくなります。ここで `ConversationHost` が必要になります。

Host は必ずしも Agent である必要はありません。

```text
ConversationHost
  - hostType: policy | systemVoice | agentParticipant | operator
  - hostRuntime: edge | companion | cloud | operatorConsole
  - topicPlan
  - decisionLog
```

Host は、誰が話すか、誰に話しかけるか、誰はうなずくだけにするかを決めます。イベントやデモなら、トーク番組の「天の声」のように話題を振ってもよいです。

```text
天の声:
  「では次は、みどりちゃんに聞いてみましょう」

Agent A:
  「ぼくは受付が得意です」

Agent B:
  （うなずく）
```

これを普通の chat message として流すと、あとから制御しづらくなります。Host の判断として残す方がよいです。

```ts
type HostDecision = {
  decisionId: string;
  conversationId: string;
  hostType: "policy" | "systemVoice" | "agentParticipant" | "operator";
  hostRuntime: "edge" | "companion" | "cloud" | "operatorConsole";
  selectedSpeaker?: ParticipantRef;
  targetParticipants: ParticipantRef[];
  reasonCode:
    | "explicitAddress"
    | "roleMatch"
    | "capabilityMatch"
    | "topicPlan"
    | "safetyFallback"
    | "manualOverride";
  visibleUtterance?: string;
  nonSpeakingReactions?: Array<{
    participant: ParticipantRef;
    reaction: string;
  }>;
};
```

これは、既存標準にあまり見当たらない領域です。A2A は Agent 間の task/message には近いですが、複数の embodied agents が同じ場で自然に話すための司会役までは厚くありません。ここはｽﾀｯｸﾁｬﾝ側で設計する価値があります。

<!-- Illustration slot 2: スマホ縦長の会話ホスト図。上部に「天の声 / ConversationHost」の小さな雲形ラベル。下に3体のStack-chan風ロボットを三角形に配置し、1体だけに「話す」、残り2体に「聞く」「うなずく」の短い札を付ける。矢印は天の声から選ばれた話者へ1本、話者から他の2体へ薄い線。説明文は最小限にし、コードや長文は入れない。やさしい技術ブログ向けのフラットイラスト。 -->

## ConversationEvent: 会話をただのテキストにしない

会話イベントには、FIPA ACL や KQML の考え方が使えます。

FIPA ACL には、`request`, `inform`, `propose`, `agree`, `refuse`, `failure`, `not-understood` のような communicative acts があります。この語彙は、LLM時代でもまだ便利です。

```ts
type ConversationEvent = {
  protocolVersion: string;
  conversationId: string;
  eventId: string;
  previousEventId?: string;
  sender: ParticipantRef;
  targets: ParticipantRef[];
  act:
    | "hello"
    | "invite"
    | "request"
    | "inform"
    | "propose"
    | "agree"
    | "refuse"
    | "failure"
    | "hostPrompt"
    | "handoff"
    | "reaction"
    | "leave";
  contentType: "text/plain" | "application/json" | "audio/ref";
  content: unknown;
  expiresAt?: string;
  confidence?: number;
  signature?: string;
};
```

`act` があると、会話の意味が読みやすくなります。

- `request`: 何かを頼む
- `propose`: 自分が担当できると申し出る
- `agree`: 引き受ける
- `refuse`: 断る
- `failure`: 失敗を返す
- `reaction`: うなずく、見る、表示する
- `handoff`: 話題や担当を渡す

音声会話でも、裏側のイベントは構造化できます。人間には自然な会話として見せ、機械には制御可能なイベントとして渡す。その分離があると、独自ファームウェアでも参加しやすくなります。

## 途中参加と離脱

複数名会話では、途中参加と離脱も普通に起きます。

```text
join
  - Agent が会話に入る

leave
  - 明示的に抜ける

timeout
  - 応答がないので一時離脱扱いにする

resume
  - 戻ってくる
```

Host は、参加状態を見ながら話者を選びます。

```text
available
speaking
listening
muted
offline
```

たとえば、あるｽﾀｯｸﾁｬﾝの Wi-Fi が落ちたら、Host はその子を `offline` として扱い、話題を別の子へ渡す。戻ってきたら、短い要約だけ受け取って再参加する。

ここで全 transcript を共有する必要はありません。プライバシーを考えるなら、共有するのは短い状態要約で十分です。

```text
ConversationStateSummary
  - currentTopic
  - lastSpeaker
  - unresolvedQuestion
  - activeParticipants
  - safetyNotes
```

## Job と capability に基づく協調

発展させると、Agent は自分の Job や capability を使って協調できます。

ここでは Contract Net Protocol が参考になります。Contract Net は、ある主体が task を提示し、他の主体が bid し、選ばれた主体が実行する分散協調の古典的なプロトコルです。

ｽﾀｯｸﾁｬﾝでは、Host がこう聞けます。

```text
Host:
  「この質問に答えられる子はいますか？」

Agent A:
  propose: 「宿泊ルールなら答えられます。confidence 0.85」

Agent B:
  propose: 「周辺施設なら少し答えられます。confidence 0.45」

Host:
  acceptProposal: 「では Agent A が答えてください」
```

この仕組みがあると、複数のｽﾀｯｸﾁｬﾝがそれぞれ得意分野を持てます。

- 受付が得意な子
- 周辺案内が得意な子
- 商品説明が得意な子
- 盛り上げ役の子
- 聞き役の子

Job は業務上の担当を表し、capability は実行できることを表します。どちらも会話上の `role` とは分けます。

```text
JobProfile
  何を任されているか

Capability
  何ができるか

ConversationRole
  この会話でどう振る舞うか
```

この三つを混ぜない方が、設計が長持ちします。

## 調査したプロトコルをレイヤー別に見る

今回見たものを、ｽﾀｯｸﾁｬﾝ向けのレイヤーに分けるとこうなります。

| レイヤー | 参考になるもの | 借りたい点 | 足りない点 |
| --- | --- | --- | --- |
| Agent 公開プロフィール / capability | [A2A](https://a2a-protocol.org/latest/), [AGNTCY](https://docs.agntcy.org/) | Agent Card、capability、auth、directory | 軽量edge profile、ｽﾀｯｸﾁｬﾝの顔・声・Shell表現 |
| Tool / resource | [MCP](https://modelcontextprotocol.io/) | tools、resources、prompts、stdio / HTTP | Agent同士の会話、招待、ターン制御 |
| 会話行為 | [FIPA ACL](https://www.fipa.org/repository/aclspecs.html), KQML | request、inform、propose、agree、refuse、failure | 現代Web/edge向けの軽量実装 |
| 担当選択 / 協調 | Contract Net Protocol, multi-robot task allocation | bid、award、failure、timeout | 雑談や音声会話へのなじませ方 |
| ルーム / federation | [Matrix](https://spec.matrix.org/latest/), [ActivityPub](https://www.w3.org/TR/activitypub/) | room、invite、actor、inbox/outbox、federation | Agent capability と物理 action の意味論 |
| transport | [MQTT](https://docs.oasis-open.org/mqtt/mqtt/v5.0/mqtt-v5.0.html), [WebRTC](https://www.w3.org/TR/webrtc/), DDS / ROS 2 | 軽量pub/sub、音声/data channel、robot data plane | 会話イベントの意味論 |
| orchestration framework | [AutoGen](https://microsoft.github.io/autogen/stable/), [LangGraph](https://langchain-ai.github.io/langgraph/), [CrewAI](https://docs.crewai.com/), [OpenAI Agents SDK](https://openai.github.io/openai-agents-python/) | group chat、handoff、graph、state、tracing | peer-to-peer identity、独自firmware相互運用 |

こうして見ると、足りない場所がはっきりします。

- Agent Card 的な公開情報は A2A に近い
- Tool 接続は MCP が近い
- 会話行為は FIPA/KQML が近い
- transport は MQTT / WebRTC / Matrix がある
- 司会や天の声、複数の embodied agents の自然なターン制御は薄い

だから、ｽﾀｯｸﾁｬﾝ向けには最後の部分を自分たちで設計する必要があります。

<!-- Illustration slot 3: スマホ縦長の「既存プロトコルから借りるもの」図。中央に「Stack-chan会話プロトコル」という丸いコア。周囲に6つの小カードを縦スクロールで見やすい2列または単列で配置: 「A2A: Agent Card」「MCP: Tool」「FIPA/KQML: 会話行為」「Contract Net: 担当選択」「MQTT/WebRTC: transport」「Matrix/ActivityPub: room / federation」。各カードはアイコン+短い日本語だけ。矢印はコアへ向ける。文字量を少なく、スマホで判読できる余白広めのレイアウト。 -->

## 最初の小さなプロトコル

最初から全部を作る必要はありません。私は、次の最小形から始めたいです。

```text
1. Agent Card を交換する
2. ConversationInvite を送る
3. CapabilityGrant を合意する
4. ConversationEvent を流す
5. HostDecision で話者とリアクションを決める
```

transport はひとつでよいです。たとえばローカル WebSocket。

```text
ｽﾀｯｸﾁｬﾝ A
  ws://stackchan-a.local/conversation

ｽﾀｯｸﾁｬﾝ B
  ws://stackchan-b.local/conversation

スマホ or ブラウザ companion
  Host として両方に接続する
```

この構成なら、独自ファームウェアでも実装しやすいです。まずは JSON を送受信できればよい。音声は後から WebRTC や既存の音声経路へ載せられます。

## まとめ

ｽﾀｯｸﾁｬﾝ同士の会話には、既存の標準や研究から借りられるものがたくさんあります。

- A2A から Agent Card と task/message の考え方を借りる
- MCP は local tool / Shell action の面に置く
- FIPA/KQML から会話行為の語彙を借りる
- Contract Net から担当選択の形を借りる
- MQTT / WebRTC / Matrix は transport や federation の選択肢にする
- ConversationHost / 天の声 / embodied turn-taking はｽﾀｯｸﾁｬﾝ向けに設計する

M5版ｽﾀｯｸﾁｬﾝが広がるほど、実装はばらばらになります。それは悪いことではありません。むしろ、それぞれの家や店やイベントに合わせて、いろいろな「うちの子」が生まれる方が自然です。

だから、プロトコルは中央集権的な管理基盤から始めるより、エッジ同士が小さく出会える形にしたい。公開プロフィールを交換し、できることを伝え、会話へ招待し、天の声やHostが場を回す。

そのくらいの薄い共通語彙があるだけで、よそのｽﾀｯｸﾁｬﾝと話す体験はかなり作りやすくなるはずです。
