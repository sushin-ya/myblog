---
title: ReactでParallax.js
date: "2021-04-13T04:45:37.121Z"
---

こんにちは。  
今回は、Parallax.js を使った Parallax についてです。
[こちらの動画](https://www.youtube.com/watch?v=LMygHD-rnbA)を参考に実装してきます。  
ひとまず、完成品は下記です。

##### 完成品

![Planets](output.gif)

#### Parallax.js

Parallax.js はスマートデバイス向けのパララックスエンジンです。  
ただし、スマートデバイスでない場合は、カーソルのポインターに反応しています。  
かなり簡単にかっこいい Parallax を実装できました。

##### インストール

```bash:title=npm
npm i -s parallax-js
```

##### scene エレメントの用意

`data-depth`で動き具合を指定できます。

```js:title=App.js
<div id="scene">
  <div data-depth="0.2">My first Layer!</div>
  <div data-depth="0.6">My second Layer!</div>
</div>
```

##### import と実行

```js:title=App.js
import Parallax from 'parallax-js';

const scene = document.getElementById('scene');
const parallaxInstance = new Parallax(scene);
```

これだけです。とっても簡単！！

#### サンプル実装

もとの html&JS を React 向けに読み替えただけで動きました。CSS は割愛。  
SVG みたいに、下の要素が、描画時には上に重なる感じみたい

```js:title=Scene.js
import React, { useEffect } from 'react';
import Parallax from 'parallax-js';
import './Scene.css';

import background from '../../images/background.png';
import rock from '../../images/rock.png';
import earth from '../../images/earth.png';
import mid from '../../images/mid.png';
import foreground from '../../images/foreground.png';

export default function Scene() {
  useEffect(() => {
    const scene = document.getElementById('scene');
    const parallaxInstance = new Parallax(scene);
  }, []);

  return (
    <section id='sectionone' className='screen'>
      <div id='scene'>
        <div data-depth='0.1' className='bg'>
          <img src={background} alt='' />
        </div>
        <div data-depth='0.2' className='rock1'>
          <img src={rock} alt='' />
        </div>
        <div data-depth='1.2' className='earth'>
          <img src={earth} alt='' />
        </div>
        <div data-depth='0.1' className='text'>
          <h1>PLANETS</h1>
        </div>
        <div data-depth='0.4' className='mid'>
          <img src={mid} alt='' />
        </div>
        <div data-depth='0.1' className='fore'>
          <img src={foreground} alt='' />
        </div>
      </div>
    </section>
  );
}
```

#### 最後に

思ったより簡単に実装できてびっくりでした。というか、ほぼ何もしてない笑  
Swiper&Gsap の部分も読み解きたいですね。こちらは少し時間がかかりそう。

#### 参考

- [Animated Website using Parallax.js and GSAP (HTML & CSS)](https://www.youtube.com/watch?v=LMygHD-rnbA).
- [Parallax.js](https://github.com/wagerfield/parallax).
