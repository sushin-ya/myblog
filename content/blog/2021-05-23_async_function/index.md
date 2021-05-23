---
title: 非同期処理入門
date: "2021-05-23T07:14:37.121Z"
---

こんにちは。  
非同期処理とは、なんぞやということをさらっとまとめてみたいと思います。  
もともと javascript を勉強した時も、ここらへんはよーわからんと飛ばしていた気がします。  
ここらで改めて復習する必要があります。  
参考文献は[JavaScript Primer](https://jsprimer.net/basic/async/)大先生です。

#### 非同期処理とは

多くのプログラミング言語にはコードの評価の仕方として、同期処理（sync）と非同期処理（async）という大きな分類があります。  
同期処理は、コーディングのイメージ通り、処理を順番に実行していきます。  
しかし、この同期処理ですが、外部の API などと通信する場合は、返答があるまで他の処理が止まってしまうという問題があります。

一方、非同期処理では、処理が終わるのをまたず、次の処理を評価していきます。

ここで少し混乱しがちなのが、非同期処理は次に実行される処理と「同時」に実行しているのか？ということです。  
結論からいうと、基本的には同時ではなく、処理を一定の単位ごとに分けて処理を切り替えながら実行する「並行処理（concurrent）」（同時に実行するのは並列処理（Parallel））であるため、同時ではありません。

あくまでも、非同期処理も基本的には 1 つのメインスレッドで処理されています。  
並行と並列、日本語だととってもわかりにくい！！！

#### Promise

##### Promise とは

Promise（プロミス）は非同期処理の結果を表現するビルトインオブジェクトです。  
複雑な非同期処理をうまくパターン化するために作られたインターフェースの役割があるようです。

##### Promise のインスタンス

Promise のインスタンスには、成功時と失敗時において実行されるコールバック関数をそれぞれ登録します。

```js
// `Promise`インスタンスを作成
const promise = new Promise((resolve, reject) => {
  // 非同期の処理が成功したときはresolve()を呼ぶ
  // 非同期の処理が失敗したときにはreject()を呼ぶ
})
const onFulfilled = () => {
  console.log("resolveされたときに呼ばれる")
}
const onRejected = () => {
  console.log("rejectされたときに呼ばれる")
}
// `then`メソッドで成功時と失敗時に呼ばれるコールバック関数を登録
promise.then(onFulfilled, onRejected)
```

##### Promise の状態

Promise インスタンスには、内部的に次の 3 つの状態が存在します。  
この値を取り出す方法はないようですが、次に紹介する Promise チェーンにおいては、  
この内部状態は受け渡しをされます。

- Fulfilled
  - resolve（成功）したときの状態。このとき onFulfilled が呼ばれる
- Rejected
  - reject（失敗）または例外が発生したときの状態。このとき onRejected が呼ばれる
- Pending
  - Fulfilled または Rejected ではない状態
  - new Promise でインスタンスを作成したときの初期状態

##### Promise チェーン

複数の非同期処理を順番に扱いたい場合に有効なのが、Promise チェーンです。  
then や catch メソッドは常に新しい Promise インスタンスを作成して返すという仕様を利用しています。  
また、then や catch のコールバック関数の返り値は、次の then のコールバック関数の引数となります。

```js
Promise.resolve(1)
  .then(value => {
    console.log(value) // => 1
    return value * 2
  })
  .then(value => {
    console.log(value) // => 2
    return value * 2
  })
  .then(value => {
    console.log(value) // => 4
    // 値を返さない場合は undefined を返すのと同じ
  })
  .then(value => {
    console.log(value) // => undefined
  })
```

概念として理解しないといけないことがかなり多いですね。

#### Async Function

##### Async Function とは

Async Function は通常の関数とは異なり、必ず Promise インスタンスを返す関数を定義する構文です。  
Promise をラップしているもの、という理解でよいでしょうか。  
なお、await 式を使うことで、同期処理のように記述ができるため、処理の流れを読みやすく書けるらしいです。

##### await 式

await 式は右辺の Promise インスタンスが Fulfilled または Rejected になるまでその場で非同期処理の完了を待ちます。 そして Promise インスタンスの状態が変わると、次の行の処理を再開します。  
await 式の導入により、Promise チェーンでネストされることを回避できるため、見た目がスッキリします。  
また、ループ処理などの記述も可能になります。

以上で、Promise と Async function については終わりです。

#### fetch API と axios

さて、非同期処理についてわかったところで、実際に API を叩くときに使う、fetch API と axios について確認していきます。[こちらの記事](https://shimablogs.com/fetch-api-axios-difference)がわかりやすかったです。

##### fetch API とは

fetch API とはモダンブラウザで標準実装されている機能で、HTTP 通信を行ってリソースを取得するための API です。

IE では使えないらしいですが、ついにサポート終了するので、もう関係ないですかね。  
余談ですが、前職の現場には、IE にしか対応していないアプリケーションがたくさんありました。  
外部と通信しない環境なので、使い続けられるのでしょうか。まあ、Execel 2003 が現役の場所でしたから笑

404 や 500 を reject しないという仕様も少し混乱を招くようです。

##### axios とは

axios とはブラウザや node.js 上で動く Promise ベースの ライブラリです。  
HTTP レスポンスを返す fetch とは違い、Promise オブジェクトを返してくれるようです。

ということで、とりあえず、axios を使えば問題なさそうです！

#### 最後に

以上で、非同期処理入門は終わりです。  
用語や概念は自分で整理してみないと、なんとなく腹落ちしませんね。  
次回は redux-thunk 入門です。

#### 参考

- [非同期処理:コールバック/Promise/Async Function](https://jsprimer.net/basic/async/).
- [【JavaScript】FetchAPI と axios の違いって？機能やメリットを比較](https://shimablogs.com/fetch-api-axios-difference).
