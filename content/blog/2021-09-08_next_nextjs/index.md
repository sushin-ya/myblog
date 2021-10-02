---
title: 続・Next.js入門
date: "2021-09-08T20:06:37.121Z"
---

こんにちは。ひさびさに更新します。
入社後、幸運なことにフロントエンドチームで Next.js✕TS という今風の環境にいます。
ちょっと忙しそうなプロジェクトではありますが、勉強しないとな、ということで続・Next.js 入門です。
細かいところまで勉強していきましょう。
とはいえ、気になったところの備忘録でしかありませんが。。。

#### useRouter

ルーティングの中で出てくるやつ
useRouter の query が動的なパスの値を取るときに便利。
/hogehoge/[hoge_id]/[honya_id]のとき、[honya_id]の index.js の中で useRouter を使うと下記のようになる。
賢い！

```js
// /hogehoge/hoge_1/honya_2
const router = useRouter()

console.log(router.query)
// {
//   hoge_id: hoge_1,
//   honya_id: honya_2
// }
```

#### Catch all routes

動的ルーティングのときに`2021/09/08`みたいなものだと困る。
そのときは`[...slug]`とすると、`{ "slug": ["2021", "09","08"] }`みたいにとってくれる。
すごい。

#### Link コンポーネント

HTTP リクエストをしないで、SPA 的にページ遷移する。
href の渡し方はパスを書くだけでなく、オブジェクトのやつもある。

With URL Object

```js
<Link
  href={{
    pathname: '/about',
    query: { name: 'test' },
  }}
  >
```

あと replace って設定値があるけど、URL だけ変わって遷移しないってことかな？
history に stack されないと言われてもピンとこない。
ページ遷移については、`useRouter` の `push` とか `replace` もあるので、使い所によるっぽい。

#### API Route

/page/api 配下に作られたファイルは、外部に公開されず、サーバ側で動作する特別なファイルになる。

#### ISR（インクリメンタル静的再生成）

すぐ忘れるのでメモ。static なページを生成するけど、一定時間ごとにページを最新化して、もし更新があれば配信する仕組み。一定時間は getStaticProps で設定できる。

#### getStaticProps の return

- props: コンポーネント にわたす値
- notFound: true にすると 404 に遷移
- revalidate: ISR の設定値
- redirect: データがないときにトップにリダイレクトしたりする

#### getStaticPaths

静的ページの pre-rendering でも、動的なパス（[id]みたいなの）では、事前にどのページを生成するかを指定する必要がある。  
fallback を true にすると、指定していないページにアクセスが有った場合、生成してくれる。使用頻度の低いページなどはそれでいい。ただし、ページが生成される前にアクセスするとエラーになるため、loading page を条件分岐で作らないといけない  
fallback を true にして、そもそもデータが存在しないページにアクセスしようとするとエラーになる。この場合は、notfound を使うとよい。

#### getServerSideProps

そもそも getStaticProps ＋ useEffect のクライアントサイドのレンダリングでも問題ないけど、リクエストのクエリに対してページレンダリングしたり、データが常に変化するようなものは ServerSide でいいよね。

#### Link

next が提供する Link タグは、`<a>`タグをラップする事もできるよ。  
クラスを付与したりカスタマイズしたいときはラップするといいかもね。

#### getStaticPaths の fallback

fallback の false, true 以外に blocking がある。  
これは、レンダリング時にページが存在しない場合 Loading と表示していたとすると、そのページがレンダリングされるまで、表示しないという制御をするパラメータだ。Loading 画面がいらなくなる。

#### 使い分けの整理

完全に静的なページ →getStaticProps
param が動的で複数ある静的なページをすべて事前にレンダリング →getStaticProps ＋ getStaticPaths(fallback:false)
param が動的で複数ある静的なページを一部を事前にレンダリング →getStaticProps ＋ getStaticPaths(fallback:true)
それ以外の動的なページ →getServerSideProps
それ以外の動的なページ → クライアントサイドでフェッチしてもいいよね別に
