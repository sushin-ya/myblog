---
title: gitのコマンドメモ
date: "2021-04-09T04:00:37.121Z"
---

こんにちは。  
今回は git のコマンドのメモです。  
一人で開発しているとちゃんとブランチきったりするのがめんどくさくて全部 master にぶん投げがちです。のちのち後悔しそうなので、ルーチンワークを記載しておきます。

#### git ルーチンワーク

##### ブランチ作成

新しいブランチを作成し、移動します。

```bash
git checkout -b new-branch
```

##### ファイルの編集（例）

たとえば、npm で何かインストールしてみます。

```bash
npm info ts-node
npm install --save-dev ts-node
```

##### 差分確認

ファイルを追加して差分確認します。

```bash
git add .
git diff
```

##### ステータス確認

対象のファイルなどを確認します。

```bash
git status
```

##### コミット

コミットします。

```bash
git commit -m "install ts-node"
```

##### ブランチを github に push

master に merge してからでもいいですが、別ブランチで管理する場合はこちら。  
HEAD は最新コミットのことらしいです。

```bash
git push -u origin HEAD
```

##### master ブランチに移動

`-`で直前のブランチに移動できます。便利。

```bash
git checkout -
```

##### master ブランチにマージ

直前に編集していたブランチとマージ

```bash
git merge -
```

##### master を push

github に push して完了。

```bash
git push -u origin HEAD

#or
#git push
```

##### ちなみに

エイリアスを登録しています。

```bash
checkout -> co
status   -> st
```

#### 最後に

というわけで、ルーチンを記載しておきました。  
チームで開発をしたことがないので、現状 Issues と Pull Request を使ったりしていないのですが、ある程度の規模になったら個人でも使ったほうがいいですよね。  
というか練習のためにもやったほうがいいのはわかってるんですが、、、  
以前 Ruby on Rails でサイトを作ったときに、こなれていないので、途中でめんどくさくなってやめちゃって、それからはやってないですね。  
次にポートフォリオ作るときはちゃんとやろう。
