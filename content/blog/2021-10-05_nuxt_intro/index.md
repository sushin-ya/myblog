---
title: Nuxt.js入門
date: "2021-10-05T10:06:37.121Z"
---

こんにちは。Udemy の講座がちょうどセールだったのでこれ幸いと Vue と Nuxt を買いました。やはり自分は動画のほうが頭に入ってくるので。。。  
ひとまずソース読めるようにするために、時間が短めの Nuxt をやろうかなと思っています。

#### レイアウトとか

Next.js とほぼ同じで、ファイルやフォルダでルーティング、動的なものも出来る。
`$route.params.[ファイル名]`で params も取れる。

method 内から`$router.push()`出来る

data や methods のように vue が提供するプロパティの他に、Nuxt 独自の物があり例えば validate などある。

[レイアウト](https://nuxtjs.org/ja/docs/concepts/views)という概念があって、layouts フォルダ配下にファイルを作ることで、ページごとにレイアウトを設定したり、エラーページを作ったり出来るらしい。

#### SSR まわり

SSR するときは asyncData 内で定義する。asyncData の実行時はインスタンスが生成されてないから this キーワードは使えない。asyncData は初回だけ実行されて、以降は SPA のアプリになる。

asyncData は[いろんな書き方](https://webxreal.com/js_nuxt-axios-asyncdata/)が出来るみたいよ。

fetch っていうのもあって、asyncData はページでしか使えないのに対して、これはどのコンポでも使えるらしい。  
（fetch(contex)は古い書き方で、今は非推奨）

ストアに nuxtServerInit アクションが定義されていて、かつ universal モードの場合、Nuxt はコンテキストを渡してこれを呼び出します（サーバサイドのみ）。  
ようは、asyncData みたいなことをストアでも出来る？っぽい

ストアで fetch するかページで fetch するか使い分けが必要ってこと。

#### データのあつかい

ストア周りは vuex で勉強すること。  
mutation と action がややこしいけど、mutation は同期的出ないとだめだけど、action は非同期処理がかけるらしい。redux-tunk みたいなものかしら？条件分岐や非同期処理を action 内で書いてくっぽいな。

nuxtServerInit で読み込まれたデータは更新されても、再読み込みされない。ストア側にも更新を掛ける必要がある。
mutation と action に add や edit などを作成してストア内で処理を完結させればよい。

#### nuxt.config.js

SPA と SSR の切り替えとか、全ページ共通の head 情報とかはここ。
loading ってのを設定すると画面上部にプログレスバーとか出るらしい。

plugins はインスタンス化される前に特定のコードを実行する。  
共通コンポーネントの読み込みなど。

modules はコアライブラリには入っていない便利ライブラリの読み込みらしい。axios とか。
クライアントサイドからの呼び出しは`this.$axios.$get`みたいになる。

```js
// pluginsの例
export default (context, inject) => {
  inject("hello", msg => console.log(msg))
}

access hello on:
client-side: this.$hello('mounted')
server-side: $hello('asyncData')

// modulesの例
client-side: this.$axios.$get
server-side:
asyncData(context){
  context.app.$axios...
}
```

動画の中で PWA がどうのって言ってるけど、関係性はよくわからない。
PWA ってのはウェブの技術を使い、ウェブサイトとしてホスティングしながらも、モバイルやデスクトップのアプリとして振る舞うことができる技術のことらしい。すごい。

#### ミドルウェア

[ライフサイクル](https://nuxtjs.org/ja/docs/concepts/nuxt-lifecycle)にあるように、nuxtServerInit のあとに実行されるので context にアクセスできる。クライアントサイドでもサーバサイドでも実行される。

auth の制御は、store で token とか持っておいて、middleware で token があるかないか判定して redirect する、みたいな感じになるっぽい。

普通 SPA は token をローカルストレージに保存する。（更新するたびに消えると困るからそらそうだよね）。

ただし、ローカルストレージはサーバサイドに存在しないので、process.client or process.server などで分岐して、処理する必要がある。
cookie でもあつかえるといいね。

Next もそうだけどクライアントサイドかサーバサイドかを意識するのが地味にめんどいかも

#### デプロイ

universal か spa か static か  
サーバがあるなしで処理を変更したり generate ってのを使ったりするらしい。

#### 最後に

ひとまずここまで。プロジェクトのファイルは読めるようになりそうなので、基本的な vue の勉強に戻りましょうかね。
