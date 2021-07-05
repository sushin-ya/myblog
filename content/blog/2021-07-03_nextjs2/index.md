---
title: Next.js入門その２
date: "2021-07-03T02:02:37.121Z"
---

こんにちは。今回は Next.js 入門その２ です。  
もう少し応用的な内容に踏み込んでいきたいと思います。

#### \_app.js

メニューバーなどの共通レイアウトは\_app.js を使うとよい。  
rails にも似たようなファイルあったな。

```js:title=_app.js
import Layout from '../components/layout/Layout';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
```

```js:title=Layout.js
import MainNavigation from './MainNavigation';
import classes from './Layout.module.css';

function Layout(props) {
  return (
    <div>
      <MainNavigation />
      <main className={classes.main}>{props.children}</main>
    </div>
  );
}

export default Layout;
```

#### useRouter

Next.js の機能で、ルーティングをしてくれる。  
例えば、ボタンを押下したときにあるリンクへ飛ぶのは下記のように記述できる。  
React Router でいうところの useHistory 的なやつかな。

```js
const router = useRouter()

function showDetailsHandler() {
  router.push("/" + props.id)
}
```

#### SSG と SSR

useEffect などを使用してページをレンダリングすると、コンテンツが空の状態の HTML が生成される。  
SEO 対策などのために、それを回避するには、SSG(Static Site Generator) か SSR(Server side rendering) のどちらかを採用する必要がある。

##### SSG

デプロイする前にビルドして静的なサイトを作っておくこと。  
変更がある場合は、再度ビルドしてデプロイする必要がある。

さらに、page フォルダ内部でのみ使用可能な関数が Next.js では用意されていて、事前レンダリングプロセスを指定できる。

##### getStaticProps()

NextJS で予約された getStaticProps を使うと、サーバやクライアントサイドではなく、ビルド時に関数を実行する。  
そのため、useEffect などで fetch する必要はなく、この内部でデータの取得をすればいい。  
return する値はオブジェクトであり、この大本のコンポーネントの props になる。  
また、revalidate という値を設定すると、ある秒数ごとに再生成が行われるので、最新化できる。  
キャッシュできるので速度が優秀。

```js
function HomePage(props) {
  return <MeetupList meetups={props.meetups} />
}

export async function getStaticProps() {
  // fetch data from an API
  return {
    props: {
      meetups: DUMMY_MEETUPS,
    },
    revalidate: 10,
  }
}
```

##### getServerSideProps()

サーバサイドでレンダリングする場合は `getServerSideProps` を使う。  
SSG と違って、サーバでレンダリングする時間を待機しないといけないかもしれない。  
context を利用することで、認証したり色々できる？

```js
export async function getServerSideProps(context) {
  const req = context.req
  const res = context.res

  // fetch data from an API
  return {
    props: {
      meetups: DUMMY_MEETUPS,
    },
  }
}
```

##### getStaticPaths()

SSG の動的なルーティングの場合に使用する関数。[こちらの記事](https://qiita.com/matamatanot/items/1735984f40540b8bdf91#getstaticpaths)がわかりやすそうでした。  
path と fallback が必須パラメタです。  
動的なものでも、静的なファイルを生成してくれますが、さらに fallback を設定することで、事前に生成していないファイルを生成し、差分を反映できるようです。  
false, true のほかに blocking という値があり、これは true が空のページを返すのに対し、事前生成を行うだけで、殻のページは返さないというものらしいです。

```js
export async function getStaticPaths() {
  return {
    fallback: false,
    paths: [
      {
        params: {
          meetupId: "m1",
        },
      },
      {
        params: {
          meetupId: "m2",
        },
      },
    ],
  }
}
```

以上の関数は、すべてサーバサイドで実行され、かつクライアントにコードは含まれない。  
バンドルされるライブラリも、Next.js がクライアントサイドとサーバサイドを識別するっぽい。

#### API Routes

Next.js 固有の機能で、独自のエンドポイントを作れる的なやつっぽい  
サーバサイドで実行される。メソッドによって、処理を振り分けられる。

```js
export default function handler(req, res) {
  if (req.method === "POST") {
    // Process a POST request
  } else {
    // Handle any other HTTP method
  }
}
```

#### メタデータ

Head というコンポーネントを読み込めば、簡単にメタデータを付与できるらしい。  
SEO 対策には大事ですね。

```js
import Head from "next/head"

function HomePage(props) {
  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  )
}
```

#### 最後に

今回は認証とかそういう機能はなかったけど、コア機能は網羅できてよかったです。  
またひとつ、Udemy の講座とりたくなりましたね。

React 単体では面倒だったルーティングや API 周りの処理が Next.js では規定されていて、かなりスッキリした印象でした。特に、ページとコンポーネントを分けることでコードの見通しも良くなるしいいこと尽くめでしたね。

今後は React ＋ TypeScript ＋ Next.js でアプリ作っていけたらいいかな。  
なお、いくつか面接させていただきましたが、技術レベル的に未経験だと厳しいですかね。。。  
どこかでガリガリスキルアップしたいなあ。

#### 参考

- [Next.js 9.3 新 API getStaticProps と getStaticPaths と getServerSideProps の概要解説](https://qiita.com/matamatanot/items/1735984f40540b8bdf91#getstaticpaths)
