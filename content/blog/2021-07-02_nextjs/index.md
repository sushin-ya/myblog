---
title: Next.js入門
date: "2021-07-02T22:46:37.121Z"
---

こんにちは。今回は Next.js です。

#### Next.js とは

Next.js とは、React の本番向けのフレームワークのこと。  
React であれば、ライブラリの導入（routing など）が必要な多くの機能を備えている。

#### Next.js の特徴

##### サーバサイドレンダリング(SSR)

Next.js ではなくクライアントサイドではなく、サーバサイドで完全なページを構成する。

React のようにクライアントサイドのレンダリングだと、空の HTML（root の div だけ）なので、コンテンツをフェッチする際に、読み込みが必要になる。また、クローラがコンテンツを取得できない。

Next.js であれば、サーバサイドでデータフェッチを行える。もちろん、クライアントサイドの React の機能も使える混ぜて使える。

##### ファイルベースのルーティング

react router のようにコードベースで routing を管理するのではなく、フォルダとファイルで管理する。  
余分なコードが減るという利点がある。

##### フルスタックアプリの構築

Next.js はフルスタックフレームワークです。  
バックエンドコードを追加したり、データの保存、取得、認証機能などを簡単に追加できるようになります。

#### Next.js プロジェクトの作成

[公式の通り](https://nextjs.org/docs/getting-started)に。

```bash
npx create-next-app
```

#### Next.js のプロジェクトの構成

プロジェクトの構成はこんな感じ。  
特徴として、`index.html` が public に存在しないこと。  
任意のタイミングでプリレンダリングするため。  
index.js にコンポーネントを作れば、`/` にアクセスすると表示される。  
news.js は、`/news`となる。

```bash
├── pages
│   ├── _app.js
│   ├── api
│   │   └── hello.js
│   ├── news.js
│   └── index.js
├── public
│   ├── favicon.ico
│   └── vercel.svg
├── styles
│  ├── Home.module.css
│  └── globals.css
├── README.md
├── next.config.js
├── package.json
└── package-lock.json
```

#### ファイルベースのルーティング

ファイルベースのルーティングは具体的にこんな感じ。  
フォルダに分けて、index.js とするのと、直下に news.js とするのは同じ意味らしい。

```js
pages
├── _app.js
├── index.js        // example.com/
└── news
    ├── index.js    // example.com/news
    └── something-important.js    // example.com/news/something-important
```

#### 動的なページ

詳細ページなど、雛形は同じだけどコンテンツが異なる動的なページは、`[]`を使って表現する。

```js
└── news
    ├── [newsId].js
    └── index.js
```

#### 動的ページの router

next.js が提供する`useRouter`を利用すると、リソース名が取得できる。  
それをもとに、フェッチしたり色々できる。

```js
import { useRouter } from "next/router"

function DetailPage() {
  const router = useRouter()
  console.log(router.query.newsId) // example.com/news/something-id -> something-idを取得

  return <h1>The Detail Page</h1>
}

export default DetailPage
```

#### リンク

`a`タグでリンクを作成できる。  
ただし、これは html ページを新たにリクエストしてるので、場合によっては使うやり方。

```js
<a href="/news/nextjs-is-a-great-framework">NextJS Is A Great Framework</a>
```

フェッチせずにリンクする場合は、nextJS の link 機能を使う。

```js
import Link from "next/link"
import { Fragment } from "react"

function NewsPage() {
  return (
    <Fragment>
      <h1>The News Page</h1>
      <ul>
        <li>
          <Link href="/news/nextjs-is-a-great-framework">
            NextJS Is A Great Framework
          </Link>
        </li>
        <li>Something else</li>
      </ul>
    </Fragment>
  )
}

export default NewsPage
```

基本的な機能は以上です。

#### 参考

- [Next.js Setup](https://nextjs.org/docs/getting-started)
