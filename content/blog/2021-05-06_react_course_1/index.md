---
title: React復習 - プロジェクトの準備
date: "2021-05-06T22:31:37.121Z"
---

こんにちは。  
今日から Udemy のとある React 講座を復習していこうと思います。  
次に作成する映画アプリのための準備作業ですね。  
React, Redux, Firebase について、理解したことを毎日メモっていきたいと思います。

#### プロジェクトを作成

Create React App で作成するので、該当ディレクトリに移動して、いつものコマンドです。  
今回は npm 指定しています。

```bash:title=create-react-app
npx create-react-app my-app --use-npm
cd my-app
npm start
```

#### 開発環境の準備

お好みでいいと思いますが、僕は VScode を使用しています。  
使用している拡張機能は下記くらいでしょうか。

- Auto Import
- Bracket Pair Colorizer 2
- Prettier - Code formatter

#### プロジェクト作成後の下ごしらえ

##### index.html の変更

最低限、title くらいは変更しましょうか。  
` <noscript>You need to enable JavaScript to run this app.</noscript>`は  
JavaScript が使えない場合に表示されるそうなので、残しておきます。

##### index.js

`<React.StrictMode>`はたくさんエラーで教えてくれるようですが、ひとまず削除。

##### Hot Module Replacement

ブラウザのリロードをすること無くアプリケーションの JS を更新する HMR（Hot Module Replacement）を導入するために、index.js を下記のように変更します。

```js:title=index.js
const rootEl = document.getElementById('root');

function render() {
  ReactDOM.render(<App />, rootEl);
}

if (module.hot) {
  module.hot.accept('./App', function () {
    setTimeout(render);
  });
}

render();
```

##### ディレクトリ構成

機能別に２つのディレクトリに大別して下記のようなイメージ  
index.js のパスを変更したら準備完了です。
（「けいせん」と打つと、記号が出てくる）

```bash
src
  ├ app       // 共通の処理やレイアウト
  │ └ layout
  │    ├ App.jsx
  │    └ style.css
  └ features  // 各ページの中身
```

#### 最後に

一旦区切りがいいのでここまで。  
新規プロジェクトを作る際に、ディレクトリ構成は悩むのですが、  
ひとまず真似しておけばいいですかね。

#### 参考

- [新しい React アプリを作る](https://ja.reactjs.org/docs/create-a-new-react-app.html).
