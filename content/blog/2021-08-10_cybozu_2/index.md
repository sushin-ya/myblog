---
title: サイボウズの新人研修資料を読むその２
date: "2021-08-10T20:06:37.121Z"
---

こんにちは。転職に伴い、引っ越しをしようと家を探したりバタバタしていたら、勉強がおろそかになっていました。  
明日はワクチンうちに行くし、引っ越しの作業はまだいろいろあるので、なかなか進まない気がします。  
ぼちぼちやっていきましょうね。

#### テスト自動化

E2E テスト（end to end）は就活中に初めて聞いたとき「なんですかそれ？」と聞いてしまった。不勉強。

テスト自動化はアジャイルにおいて素早いフィードバックを得られるのでメリットがある  
CI（継続的インテグレーション）において、デグレ確認できる

例として Selenium IDE が挙げられている。ようはブラウザでの操作をエミュレートして実行できるというやつらしい。

##### 自動テストの罠

メンテナンスの稼働が発生することが多いため一筋縄では行かない。繰り返し長く使わないと、全体としてコストが下がらない。理由としては下記３点。

- 初期実装コストが高い
- 仕様変更が多い機能
- 外部仕様の変更（OS やブラウザなど）

Unit（単体）テスト、インテグレーション（結合）テスト、E2E（UI）テストのどこの段階でテストするのが適切かを検討することが重要。E2E は実装コストが高いので、何でもかんでもやればいいというわけでもない。

『テストピラミッド』というテスト実行コストが低い層のテストを厚く行う戦略などがいいかもしれない。

##### E2E テストのツール

- Selenium IDE
  - 初心者向けかも
- Autify
  - ノーコードとか AI とか、修正コストは多い
- WebDriver IO
  - プログラムベース
- Cucumber
  - 自然言語でテストシナリオを書ける

#### アクセシビリティ

アクセシビリティとは、「すべての人」が支障なく利用できること

リソースは、マシンリーダブル（HTML や CSS などの Web コンテンツなど）とヒューマンリーダブル（視覚、聴覚、触覚など）
の２つに分かれることを意識する。

アクセシビリティ確保の基本

- 見出し・ランドマークなどの文書構造をマークアップする
- リンクテキストはリンク先がわかるようにする
  など観点が整理されてるらしい

W3C が勧告している基準リストが[Web Content Accessibility Guidline 2.0](https://waic.jp/docs/WCAG20/Overview.html)に整理されている。

#### Docker

##### コンテナオーケストレーションツール

複数のコンテナを組み合わせたアプリケーションを実行したり管理したりする仕組み

docker-compose: シングルホスト上で複数のコンテナを組み合わせて実行するためのツール

kubernetes: 複数のホスト上にコンテナを適切にスケジューリングしたり、コンテナの自動復旧やアップグレードなどの管理をおこなってくれる

##### Dockerfile

RUN や COPY などを実行するたびに、read-only なレイヤーが積み重なっている。docker build の際はファイルのチェックサムで変更を検知して、キャッシュを利用している

multi-stage build といって、ビルド用と実行用のコンテナを分離する事ができる。ビルドに必要な中間ファイルが実行用コンテナに含まれないので軽量になる。

hadolint という Lint ツールもある

##### Docker でアプリケーション

コンテナアプリケーションのベストプラクティス

- コンテナはステートレス
  - 状態は Docker や Kubernetes の Volume 機能 という別の状態管理の方法で扱う
- ひとつのコンテナにはひとつの役割
- 正しくログを出す
  - 標準出力、標準エラー出力にログを出せば、Docker や Kubernetes がログを拾える（？）
- シグナルを処理する
  - SIGTERM（定義されたコード）を受け取ったら正しくアプリを終了させる
- ヘルスチェックの仕組みを用意する
  - ヘルスチェック用の Web API を用意するのが一般的
  - Docker には HEALTCHECK 機能もある
  - アプリケーションが解決できないエラーが起きたらプロセスを終了させる（理由はよくわからない）
- 柔軟なアプリケーション設定
  - 外部から変更可能にする（環境変数、コマンドラインオプション、設定ファイル）

#### Chrome Developer Tools の使い方

##### 新機能について

Chrome Bete, Chrome Dev, Chrome Canary などを使用すると新しい機能を確認できる

[What's New In DevTools](https://developer.chrome.com/docs/devtools/updates/)でアップデート情報を確認できる

##### Console Panel

- $0 で今フォーカスしている要素を取得できる
- copy()の引数に与えたものがクリップボードに反映される
- monitorEvents(window, "click")でクリックした箇所の情報を取得できる
  色々あるみたい

##### Source Panel

- Add logpoint を指定すると直接 console.log を仕込める
- Snippet を保存して任意のスクリプトを実行できる
- Overrides でローカルにあるソースコードを上書きできる

##### Network Panel

- サイトのリソースの転送状態が見れる
- リクエストやレスポンスの詳細が見れる
- ネットワークの状態を変更できる（？）
- Disable cache にチェックするとキャッシュがない状態を確認できる
  などなど

##### Performance Panel

パフォーマンスについて可視化できる

##### ドキュメント

暇なときに読むべし
[Chrome DevTools](https://www.google.com/search?q=chrome+devtools&rlz=1C5CHFA_enJP902JP902&oq=chrome+devtools&aqs=chrome..69i57j0i512l6j69i60.2339j0j1&sourceid=chrome&ie=UTF-8)

#### アジャイル

価値とかそういう話だった  
前職でもサイロってキーワードがよく出てきたけど、流行ってんの？

#### デザインとの関わり

##### デザインの語源

デザインの語源はデッサン（dessin）と同じく、「計画を記号に表す」意味のラテン語 designare であり、意図を実現することが良いか悪いかの基準になる

##### UX ∋ UI

UX は顧客の体験すべてを指し示すので、プロダクトに関わる全ての人が意識すべきこと

##### ダークパターン

意図的にユーザーを操ったり、騙したりする UI （ダークパターン）の規制が強化されてきている

#### MySQL

[USE THE INDEX, LUKE!](https://use-the-index-luke.com/ja)というチュートリアルがあるらしい

インデックスの話を詳しくしているが、DB はツリー構造だぞっということを言ってるっぽい？

#### CI/CD

##### CI(Continuous Integration)とは

- 開発プラクティス
- 一日に何回もバージョン管理システムに変更をマージ
- 毎回テストなどを含む自動ビルドが実行される

##### CI の利点

- 高速なフィードバック
- 頻繁にマージされれば差分が大きくならない、リスクが減る
- Success/Fail の可視化によるコミュニケーション促進
- 毎回自動テストで保証される安心感

###### CD(Continuous Delivery)とは

- CI の発展型
- コード変更からリリースまでに必要な検証を行う
- デプロイパイプラインという形で自動化する

##### CD の利点

- リリースのコストが低いので、いつでもリリースできる
- コード変更からリリースまでのフローが可視化される

##### CI/CD の中身

- 構文チェックやコードスタイルチェックなどの静的解析
- 単体、結合、E2E などの自動テスト
- 性能検証、脆弱性検証などの非機能要件のテスト
- アーカイブ作成（デプロイ、リリース時に使用するアーカイブ）
- デプロイ・リリース
  - メインラインにマージされたときのみの実行が多い
  - ステージング環境（本番によく似た環境にまずデプロイ）
  - 本番へのリリース戦略
    - 一部の環境から広げていく場合やロールバック、無停止など
    - カナリアリリース
      - 一部ユーザのみ
    - ブルーグリーンデプロイ
      - ブルー（旧環境）からグリーン（新環境）に徐々に転送する。両バージョンが稼働中の状態で実施
    - フィーチャーフラグなど
      - コードの変更は行わず、動的に（フラグなどで）システムの振る舞いを変更する手法

##### CI/CD ツール

- Jenkins
  - OSS、オンプレ構築できる
- CircleCI
  - クラウドサービス
  - GitHub と連携したりできる
- GitHub Actions
  - GitHub が提供
  - パブリックリポジトリでは完全無料
- AWS Code シリーズなど

##### CI/CD の導入

新規開発に導入するのがよい  
時間がないから自動化できないのではなく、自動化しないから時間がない

##### ベストプラクティス

- 頻繁に変更をコミットして、意味単位で分割する
- すべてのコミットで実行する
- ビルドが失敗したらチームは最優先で復旧
- CI/CD を高速に保つ
  - 可能な限り並列実行
  - 自動テストの役割を見直し、テストピラミッドを意識
- ビルドが不安定にならないように継続的に改善
  - Docker コンテナ内でビルドするのが最近は一般的

#### セキュリティ

##### 情報セキュリティの３要素 CIA

- Confidentiality: 機密性
  - 認可されていないひとには情報は使用させず、開示しない
- Integrity: 完全性
  - 正確さ及び完全さ
- Availability: 可用性
  - 認可されたエンティティが要求したときに使える

##### 共通脆弱性タイプ一覧 CWE

ソフトウェアにおける脆弱性の識別番号  
ex) CWE-89: SQL インジェクション

##### 共通脆弱性識別子 CVE

ここの脆弱性を識別する番号  
ex) CVE-2014-6271: ShellShock(bash)

##### 脆弱性の評価 CVSSv3

脆弱性の深刻度を数値化するために使われるシステム  
攻撃経路や複雑さ、影響範囲などの計８項目で評価

#### 最後に

サボり気味になってるので明日で一回資料を読む会は終わりたい。そしたらひさびさに Udemy でお勉強しましょうかね。最近全然コード書いてなくやばい