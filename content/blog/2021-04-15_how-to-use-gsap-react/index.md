---
title: ReactでのGSAP ScrollTriggerの使い方
date: "2021-04-15T19:35:37.121Z"
---

こんにちは。  
今日は、React での GSAP ScrollTrigger の使い方についてです。  
GSAP の公式サイトを眺めていたら、[How to use the GSAP ScrollTrigger plugin in React](https://edidiongasikpo.com/using-gsap-scrolltrigger-plugin-in-react)というページがあり、これじゃんとなりました。

#### 要素をアニメーションのターゲットにする

アニメーションのターゲットにするためには、  
`useRef` と `useEffect` を組み合わせるのが正解でした。  
下記の例では、`.first-paragraph`というクラスをターゲットに設定しています。

```js:title=App.js（抜粋）
import { useRef, useEffect } from "react";
import "./App.css";
import { gsap } from "gsap";

function App() {
  const ref = useRef(null);
  useEffect(() => {
    const element = ref.current;
    gsap.fromTo(
      element.querySelector(".first-paragraph"),
      {
        opacity: 0,
        y: -20,
      },
      {
        opacity: 1,
        y: 0,
      }
    );
  }, []);


  return (
    <div className="App" ref={ref}>
      <div className="first">
        <h1>ScrollTrigger</h1>
        <p className="first-paragraph">
          is the coolest Greensock plugin.
          <span role="img" aria-label="celebrating">
            🥳
          </span>
        </p>
        <div className="logo-main">
          <img src={workout} id="workout-logo" alt="workout" />
        </div>
      </div>
    </div>
  );
}
export default App;
```

#### ScrollTrigger する

ここからもさっくりかけちゃいますね。GSAP すごい。

##### インポート

```js:title=import
import { ScrollTrigger } from "gsap/ScrollTrigger";
```

##### 登録

おまじない。

```js:title=登録
gsap.registerPlugin(ScrollTrigger);
```

##### ScrollTrigger の使用

```js:title=App.js
useEffect(() => {
  const element = ref.current;
  gsap.fromTo(
    element.querySelector(".first-paragraph"),
    {
      opacity: 0,
      y: -20,
    },
    {
      opacity: 1,
      y: 0,
      scrollTrigger: {
        trigger: element.querySelector(".first"),
        start: "top top",
        end: "bottom center",
        scrub: true,
      },
    }
  );
}, []);
```

##### ScrollTrigger の使い方

Youtube のチュートリアル動画がわかりやすいです。  
[Introducing ScrollTrigger for GSAP](https://www.youtube.com/watch?v=X7IBa7vZjmo)

##### 完成形

```js:title=App.js
import { useRef, useEffect } from "react";
import "./App.css";
import workout from "./workout.svg";
import greensocklogo from "./greensocklogo.svg";
import happy from "./happy.svg";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function App() {
  gsap.registerPlugin(ScrollTrigger);
  const ref = useRef(null);
  useEffect(() => {
    const element = ref.current;
    gsap.fromTo(
      element.querySelector(".first-paragraph"),
      {
        opacity: 0,
        y: -20,
      },
      {
        opacity: 1,
        y: 0,
        scrollTrigger: {
          trigger: element.querySelector(".first"),
          start: "top top",
          end: "bottom center",
          scrub: true,
        },
      }
    );
  }, []);
  return (
    <div className="App" ref={ref}>
      <div className="first">
        <h1>ScrollTrigger</h1>
        <p className="first-paragraph">
          is the coolest Greensock plugin.
          <span role="img" aria-label="celebrating">
            🥳
          </span>
        </p>
        <div className="logo-main">
          <img src={workout} id="workout-logo" alt="workout" />
        </div>
      </div>
    </div>
  );
}
export default App;
```

#### 最後に

[前回](/2021-04-13_practice_swiper/)、JS でなんとなく書いて、  
gsap がうまく動かなかった部分も、これでうまくいきそうですね。  
そろそろ仕組みわかってきたのでおしゃれポートフォリオ作りたいです。

#### 参考

- [How to use the GSAP ScrollTrigger plugin in React](https://edidiongasikpo.com/using-gsap-scrolltrigger-plugin-in-react).
- [Introducing ScrollTrigger for GSAP](https://www.youtube.com/watch?v=X7IBa7vZjmo).
