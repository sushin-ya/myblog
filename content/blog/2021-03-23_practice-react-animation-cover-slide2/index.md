---
title: Reactでアニメーションがしたいよ２【カバースライド編】
date: "2021-03-23T02:14:37.121Z"
---

昨日うまく行かなかったホバーアクションの部分を見直したらうまくいきました！

![CoverSlide2](./CoverSlide2.gif)

`hoverDarken`というクラスを付与して、そこに before 擬似要素を追加していたのですが、  
`CoverSlides`ではなく`imgZoom`と同じ要素にクラスを付与していたための間違いでした。  
普通に凡ミスでしたね。  
これでひとまずやりたかったことはできました！  
ちなみに、useSpring の`reset`という設定値を`true`にすると、  
適用後のスタイルをリセットできるので便利です。  
react-spring のサンプルを眺めていたら見つけました。Common api ちゃんと読むべし。  
次回はヒーロースライダー的なものを実装していきます。

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
    reset: true,
  });
  const { left, right } = useSpring({
    from: { left: 0, right: 0 },
    to: { left: toggle ? 1 : 0, right: toggle ? 1 : 0 },
    config: { duration: 1600, easing: (t) => -(Math.cos(Math.PI * t) - 1) / 2 },
    reset: true,
  });

  return (
    <>
      <Button
        className='Button'
        content='push!'
        onClick={() => setToggle(!toggle)}
      />
      <div id='container'>
        <div className={toggle ? "coverSlides hoverDarken" : "coverSlides"}>
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

.hoverDarken::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  transition: background-color 0.3s ease;
  pointer-events: none;   //img要素のhoverにも反応させるため
}
.hoverDarken:hover::before {
  background-color: rgba(0, 0, 0, 0.4);
}
```
