---
title: React/CSS/Material UIのメモ0520
date: "2021-05-20T02:34:37.121Z"
---

脈絡のない調べたことのメモ。

#### useRef

なんとなくで使っている useRef って結局何なの？ということで。  
[公式](https://ja.reactjs.org/docs/hooks-reference.html#useref)を読んで見る。

> 本質的に useRef とは、書き換え可能な値を .current プロパティ内に保持することができる「箱」のようなものです。

> まずは ref のことを DOM にアクセスする手段として理解しているかもしれません。`<div ref={myRef} />` のようにして React に ref オブジェクトを渡した場合、React は DOM ノードに変更があるたびに .current プロパティをその DOM ノードに設定します。

> しかしながら useRef() は ref 属性で使うだけではなく、より便利に使えます。これはクラスでインスタンス変数を使うのと同様にして、あらゆる書き換え可能な値を保持しておくのに便利です。

なるほど。必ずしも DOM にアクセスするための querySelector みたいなものではないのか。  
値が変わっても再レンダリングは発生しないとのことなので、本当に書き換え可能な値を保持するための「箱」という認識でよさそうですね。

[素晴らしい記事様](https://qiita.com/seya/items/6bbfa3f9d489809ccb2c)も合わせ読み。  
確かに、React の講座のなかで、以前の state を管理する方法って出てきたかもしれない。（かすかな記憶ですが、メモ化らへんの話で、state に変更が生じたかどうかをチェックする的な使い方？）

hooks の領域に値が保持されているから再計算されても値が失われないとのこと。  
なるほどなあ。

#### aria-controls / aria-haspopup

Material UI の[Menus](https://material-ui.com/components/menus/)を実装しているときに、これらが出てきてなにこれ？となった。  
[MDN](https://developer.mozilla.org/ja/docs/Web/Accessibility/ARIA)では、下記のように説明されていた。

> Accessible Rich Internet Applications (ARIA) は Web コンテンツや Web アプリケーション (特に Ajax や JavaScript や Bootstrap のようなより最新のウェブ技術を伴って開発するもの) を、ハンディキャップを持つ人々にとってよりアクセシブルにする方法を定義します。

なるほど。

#### box について

Material UI でマージンとかパディングを設定するときに使えるラップ用コンポーネント。  
[ここ](https://material-ui.com/system/basics/)にマージンとかの設定の仕方が載ってます。  
デフォルトテーマを使って設定できるところがスッキリしていていいですね。

#### formik material ui

[formik](https://stackworx.github.io/formik-material-ui/docs/guide/getting-started) は Material UI 用のものがあるらしい。  
便利！

#### 最後に

今日はフォーム部品をどうやって作ろうかなと調べていました。はかどらなかったのでまた明日。  
Formik はともかく、Drag＆Drop を駆使したいと思って調べていたら、react-beautiful-dnd というライブラリにたどり着きました。  
ライブラリを構築している[動画講座](https://egghead.io/courses/beautiful-and-accessible-drag-and-drop-with-react-beautiful-dnd)があるので、明日はそれを見ながら自分でも実装してみよう。

[React.js Examples](https://reactjsexample.com/)というサイトに、いろんな部品の作り方が載っていて、見ているだけで楽しいです。

#### 参考

- [useRef](https://ja.reactjs.org/docs/hooks-reference.html#useref).
- [useRef は何をやっているのか](https://qiita.com/seya/items/6bbfa3f9d489809ccb2c)
- [@material-ui/system](https://material-ui.com/system/basics/).
- [Menus](https://material-ui.com/components/menus/).
- [ARIA](https://developer.mozilla.org/ja/docs/Web/Accessibility/ARIA).
- [ドロップダウン](https://www.tohoho-web.com/bootstrap/dropdown.html).
- [react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd).
- [Beautiful and Accessible Drag and Drop with react-beautiful-dnd](https://egghead.io/courses/beautiful-and-accessible-drag-and-drop-with-react-beautiful-dnd).
- [Formik Material-UI](https://stackworx.github.io/formik-material-ui/docs/guide/getting-started)
- [React.js Examples](https://reactjsexample.com/)
