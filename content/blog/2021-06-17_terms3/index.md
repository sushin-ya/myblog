---
title: WEB DEVELOPER Roadmapで知識の整理その３
date: "2021-06-17T19:31:37.121Z"
---

こんにちは。WEB DEVELOPER Roadmap で知識の整理その３です。  
意外と見たことない言葉が多いので、用語の確認です。

#### Web Security Knowledge

##### HTTPS

TLS/SSL という仕組みを使って、HTTP を暗号化したプロトコル。  
公開鍵暗号方式により共通鍵を送信し、共通鍵暗号方式により暗号化通信を可能にします。  
公開鍵は管理はしやすいが処理速度は遅く、共通鍵は処理速度は早いが鍵の管理が困難という点を補い合った形になっています。

##### Same origin policy

同一オリジンポリシー（Same origin policy）とは、あるオリジンから読み込まれた文書やスクリプトについて、そのリソースから他のオリジンのリソースにアクセスできないように制限するものです。  
二つのページのプロトコル、ポート番号 (もしあれば)、ホストが等しい場合、両者のページは同じオリジンです。

`http://store.company.com/dir/page.html`と同一オリジンな例です。

| URL                                        | 結果   | 理由               |
| ------------------------------------------ | ------ | ------------------ |
| `http://store.company.com/dir2/other.html` | 一致   | パスが異なる       |
| `https://store.company.com/page.html `     | 不一致 | プロトコルが異なる |
| `http://news.company.com/dir/page.html`    | 不一致 | ホストが異なる     |

##### CORS

オリジン間リソース共有 (CORS)は、追加の HTTP ヘッダーを使用して、あるオリジンで動作しているウェブアプリケーションに、異なるオリジンにある選択されたリソースへのアクセス権を与えるようブラウザーに指示するための仕組みです。

一番シンプルな例ですと、ブラウザとサーバ間でのリクエストとレスポンスで、下記のようなやり取りがあります。

```http{8}
GET /resources/public-data/ HTTP/1.1
Host: bar.other
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:71.0) Gecko/20100101 Firefox/71.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-us,en;q=0.5
Accept-Encoding: gzip,deflate
Connection: keep-alive
Origin: https://foo.example   // 呼び出しもとを指定
```

```http{4}
HTTP/1.1 200 OK
Date: Mon, 01 Dec 2008 00:23:53 GMT
Server: Apache/2
Access-Control-Allow-Origin: *    // リソースへの制限、この場合は*なのですべてのドメインからアクセス可能
Keep-Alive: timeout=2, max=100
Connection: Keep-Alive
Transfer-Encoding: chunked
Content-Type: application/xml

[…XML データ…]
```

#### Package Managers

npm と yarn がありますが、npm について見ていきます。

##### npm

npm とは、世界最大のソフトウェアレジストリ、パッケージ管理システムです。  
Web サイトおよび CLI、レジストリ（ライブラリ）の３つからなります。  
JS において問題となっていた依存関係の解決を自動的に行なってくれます。  
package.json の詳細なども解説してくれている[こちら](https://qiita.com/righteous/items/e5448cb2e7e11ab7d477)の記事がわかりやすくてよかったです。

#### CSS Architecture

##### BEM

BEM は、Block Element Modifier の略です。大規模で複雑なプロジェクトの際に、コードを整理するための方法論です。

- Blck：それ自体で意味のある要素
  - ex. `header`, `container`, `menu`
- Element：そのブロックに意味的に結び付けられるもの
  - ex. `menu item`, `list item`, `checkbox caption`
- Modifier：ブロックまたは要素のフラグ、外観や動作を変更する
  - ex. `disable`, `highlighted`, `fixed`

#### Build Tools(Task Runners)

##### npm scripts

npm scripts は、npm が提供するタスク処理の機能です。package.json ファイルにエイリアスを登録するイメージでしょうか。  
以前は Gulp や Grunt と呼ばれるものを使っていたみたいです。

#### Build Tools(Module Bundlers)

##### Webpack

webpack は JavaScript アプリケーション用の静的モジュールバンドラーです。  
バンドラーとは、ウェブコンテンツを構成するファイルをまとめてしまうツールです。一番多い使い方は、複数の JavaScript を 1 つにまとめることです。Webpack では JavaScript だけでなく、CSS や画像などのアセットもバンドルすることができます。

似たような仕組みには ライブラリの管理に向いている Rollup や 機能がよりシンプルな Parcel などがあります。

#### Modern CSS

##### Styled Components

styled-components は、React コンポーネントシステムのスタイリングのために CSS を拡張した結果です。  
タグ付きテンプレートリテラルを用いて記述します。  
そういえば書いたことないですね。コンポーネント数が増えるとパフォーマンスが下がったりすることがあるため、後続の Styled JSX や Emotion のほうが実用的みたいです。

```css
// Create a Title component that'll render an <h1> tag with some styles
const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`;

// Use Title and Wrapper like any other React component – except they're styled!
render(
  <Wrapper>
    <Title>
      Hello World!
    </Title>
  </Wrapper>
);
```

ちなみに、material ui のスタイリングは、styled-components と emotion にインスパイアされたみたいです。

##### CSS Modules

CSS モジュールは、すべてのクラス名とアニメーション名がデフォルトでローカルにスコープされている CSS ファイルです。  
要は、クラス名がグローバルで重複することがなくなったりするので、便利ってやつです。

create-react-app だと、ファイル名を[name].module.css とすれば、かんたんに利用できるので便利です。

```css:title=Button.module.css
.error {
  background-color: red;
}
```

```js:title=Button.js
import React, { Component } from 'react';
import styles from './Button.module.css'; // Import css modules stylesheet as styles
import './another-stylesheet.css'; // Import regular stylesheet

class Button extends Component {
  render() {
    // reference as a js object
    return <button className={styles.error}>Error Button</button>;
  }
}
```

```html:title=Result
<button class="Button_error_ax7yz">Error Button</button>
```

#### 最後に

以上で、ざっと用語について確認してきました。  
知らないといけない用語が多すぎて、新規参入には厳しいですが、やっとちょっとずつ役割がわかってきたような気がします。

Node の知識がなさすぎるので、Udemy の Node の最初の方だけでも流し見しようかな。  
今やってる用語の整理が終わったらさっくりやってみますか。

#### 参考

- [CORS](https://developer.mozilla.org/ja/docs/Web/HTTP/CORS)
- [npm](https://docs.npmjs.com/)
- [【モダン JavaScript #3】歴史から学ぶ JavaScript 後編 ① Node.js とパッケージ管理システム npm【フロントエンドエンジニア講座】](https://www.youtube.com/watch?v=RdFE03K9B08)
- [【初心者向け】NPM と package.json を概念的に理解する](https://qiita.com/righteous/items/e5448cb2e7e11ab7d477)
- [BEM](http://getbem.com/introduction/)
- [Node.js ユーザーなら押さえておきたい npm-scripts のタスク実行方法まとめ](https://ics.media/entry/12226/)
- [Webpack](https://webpack.js.org/concepts/)
- [最新版で学ぶ webpack 5 入門 JavaScript のモジュールバンドラ](https://ics.media/entry/12140/)
- [styled components](https://styled-components.com/docs/basics#motivation)
- [css modules](https://github.com/css-modules/css-modules)
- [Adding a CSS Modules Stylesheet](https://create-react-app.dev/docs/adding-a-css-modules-stylesheet/)
