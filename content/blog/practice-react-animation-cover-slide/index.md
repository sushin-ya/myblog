---
title: Reactでアニメーションがしたいよ　【カバースライド編】
date: "2021-03-21T20:14:37.121Z"
---

[React でアニメーションがしたいよ](/practice-react-animation)の続きです。  
今回は、画像のカバースライドアニメーションを作成していきたいと思います。  
基本的には CSS のアニメーションの代わりに `react-spring` で実装しているイメージです。

完成イメージです。（本当は完成ではないのですが。。。→[完成版](/practice-react-animation-cover-slide2)）
![CoverSlide](./CoverSlide.gif)

#### CSS keyframes をエミュレートする

`interpolate`という値を使って、CSS keyframes みたいなことができます。  
`range`が keyframes の any%、`output`が値です。  
下記の例では、`x`を使って、`scale`の値を変化させています。

```js:title=Example
/*
0 % { transform: scale(1); }
25 % { transform: scale(.97); }
35 % { transform: scale(.9); }
45 % { transform: scale(1.1); }
55 % { transform: scale(.9); }
65 % { transform: scale(1.1); }
75 % { transform: scale(1.03); }
100 % { transform: scale(1); }
`*/

const props = useSpring({x: state ? 1 : 0})
return (
  <animated.div
    style={{
      transform: props.x
        .interpolate({
          range: [0, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 1],
          output: [1, 0.97, 0.9, 1.1, 0.9, 1.1, 1.03, 1]
        })
        .interpolate(x => `scale(${x})`)
    }}
  />
)
```

#### 画像のカバースライド

画像のカバースライドは、下記のような構造です。  
本来は、`coverSlides`の after 擬似要素にスライドする部分を担当させたいのですが、  
どうやって扱えばいいのか見当たらなかったので、`coverSlide`クラスの div を用意しました。

```js:title=CoverSlide.js(抜粋)
<div id="container">
  <div class="coverSlides">
    <img class="imgZoom" >
    <div class="coverSlide" ></div>
  </div>
</div>
```

方針としては、`coverSlide`が通り過ぎる → 画像が表示されるというものです。  
通り過ぎる部分は、それぞれ`left`、`right`のスタイルについて、値を変化させています。  
画像についても、`opacity`と`scale`を制御することで、ふわっと現れる感じになっています。

##### カバースライド

カバースライドの useSpring は下記です。  
基本的には[前回](/practice-react-animation)と変わりませんが、  
`config`の`easing`という値を設定しています。  
CSS でいうところの animation-timing-function に対応するものですね。  
ただし、ここでは ease-in-out などではなく、関数を渡す必要があります。  
[ここ](https://easings.net/ja#easeInOutSine)で数式を見つけたので、貼り付けときました。

```js:title=CoverSlide.js（抜粋）
  const { left, right } = useSpring({
    from: { left: 0, right: 0 },
    to: { left: toggle ? 1 : 0, right: toggle ? 1 : 0 },
    config: { duration: 1600, easing: (t) => -(Math.cos(Math.PI * t) - 1) / 2 },
  });
```

`coverSlide`の本体では、`interpolate`に`range`と`output`を設定しています。

```js:title=CoverSlide.js（抜粋）
<animated.div
  className='coverSlide'
  style={{
    left: left.interpolate({
      range: [0, 0.5, 1],
      output: ["0%", "0%", "100%"],
    }),
    right: right.interpolate({
      range: [0, 0.5, 1],
      output: ["100%", "0%", "0%"],
    }),
  }}
/>
```

##### 画像の表示

画像の useSpring は下記になります。  
ここで`x`という数値を定義しています。

```js:title=CoverSlide.js（抜粋）
  const { x } = useSpring({
    from: { x: 0 },
    to: { x: toggle ? 1 : 0 },
    config: { duration: 1600, easing: (t) => -(Math.cos(Math.PI * t) - 1) / 2 },
  });
```

実際のスタイリングは、下記の`imgZoom`内で行います。  
`x`の値を使って、`opacity`と`scale`の値をアニメーションしています。

```js:title=CoverSlide.js（抜粋）
<animated.img
  className='imgZoom'
  style={{
    opacity: x.interpolate({
      range: [0, 0.5, 0.51, 1],
      output: [0, 0, 1, 1],
    }),
    transform: x
      .interpolate({
        range: [0, 0.5, 0.51, 1],
        output: [1.5, 1.5, 1.5, 1],
      })
      .interpolate((x) => `scale(${x})`),
  }}
  src={image}
  alt=''
/>
```

##### その他 CSS について

`vertical-aling`を設定しないと、画像とカバースライドが微妙にずれます。

```css:title=CoverSlideImage.css
img {
  max-width: 100%;
  vertical-align: bottom;
}
```

`oveflow`を設定しないと、画像の scale が 1 以上の際、親要素からはみ出てしまいます。

```css:title=CoverSlideImage.css
.coverSlides {
  position: relative;
  overflow: hidden;
}
```

要素いっぱいに表示するための書き方です。  
四隅を 0 にする方法ですね。`width`と`heigth`を 100%にする方法もありますが、  
今回のアニメーションのためにはこちらのほうが都合がよいということです。

```css:title=CoverSlideImage.css
.coverSlide {
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: tomato;
}
```

#### 完成

完成したコードは下記のとおりです。  
細かく指定をしようとすると、コードがごちゃつきますね。  
コンポーネントを細分化したりすればよいのでしょうか。

```js:title=CoverSlideImage.js
import React, { useState } from "react";
import { useSpring, animated } from "react-spring";
import { Button } from "semantic-ui-react";

import image from "./image1.jpg";
import "./CoverSlideImage.css";

export default function CoverSlideImage() {
  const [toggle, setToggle] = useState(false);
  const { x } = useSpring({
    from: { x: 0 },
    to: { x: toggle ? 1 : 0 },
    config: { duration: 1600, easing: (t) => -(Math.cos(Math.PI * t) - 1) / 2 },
  });
  const { left, right } = useSpring({
    from: { left: 0, right: 0 },
    to: { left: toggle ? 1 : 0, right: toggle ? 1 : 0 },
    config: { duration: 1600, easing: (t) => -(Math.cos(Math.PI * t) - 1) / 2 },
  });

  return (
    <>
      <Button
        className='Button'
        content='push!'
        onClick={() => setToggle(!toggle)}
      />
      <div id='container'>
        <div className='coverSlides'>
          <animated.img
            className='imgZoom'
            style={{
              opacity: x.interpolate({
                range: [0, 0.5, 0.51, 1],
                output: [0, 0, 1, 1],
              }),
              transform: x
                .interpolate({
                  range: [0, 0.5, 0.51, 1],
                  output: [1.5, 1.5, 1.5, 1],
                })
                .interpolate((x) => `scale(${x})`),
            }}
            src={image}
            alt=''
          />
          <animated.div
            className='coverSlide'
            style={{
              left: left.interpolate({
                range: [0, 0.5, 1],
                output: ["0%", "0%", "100%"],
              }),
              right: right.interpolate({
                range: [0, 0.5, 1],
                output: ["100%", "0%", "0%"],
              }),
            }}
          />
        </div>
      </div>
    </>
  );
}

```

```css:title=CoverSlideImage.css
.Button {
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 5;
}

img {
  max-width: 100%;
  vertical-align: bottom;
}

.coverSlides {
  position: relative;
  overflow: hidden;
}

.coverSlide {
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: tomato;
}

.imgZoom {
  transition: transform 0.3s ease;
}

.imgZoom:hover {
  transform: scale(1.3) !important;
}
```

#### 最後に

手探りな感じでしたが、一応目指していたものは完成しました。  
ただ、アニメーション後に画像に hover すると、  
画像が暗くなるようなスタイルをつけたかったのですが、  
ひとつのタグに対して、２種類の uesSpring を適用するのがうまくいかず、  
hover されると暗くなる要素を別の div として定義すると、  
`pointer-events`がどちらか一方の要素しか認識できないので、  
hover がうまく適用できませんでした。

擬似要素が使えれば楽なんで、そっちを探したほうがいいかな。  
ひとまず、今回はこんな感じで終わりです。  
次回は、上の問題を解決するか、ヒーロースライダーを実装したいです。

というか見返していて思ったのですが、`x`だけ useSpring を用意すれば事足りましたね。  
`left`と`right`意味ない（笑）。  
途中まではそこの値をいじったりしていたので残ってしまいました。  
まあいいか。。。

![hoverDarken](./hoverDarken.gif)

#### 参考

- [react-spring](https://www.react-spring.io/).
- [イージング関数チートシート：easeInOutSine](https://easings.net/ja#easeInOutSine).
