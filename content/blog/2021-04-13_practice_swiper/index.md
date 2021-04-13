---
title: ReactでSwiper/GSAPアニメーション
date: "2021-04-13T20:43:37.121Z"
---

こんにちは。  
今日は[前回](/2021-04-13_practice-react-parallax)の続きで[こちらの動画](https://www.youtube.com/watch?v=LMygHD-rnbA)を参考に Swiper/GSAP アニメーションを実装してきます。  
完成品はこちら

##### 完成品

![Planets](./planets.gif)

#### Swiper/GSAP

[以前](/2021-03-29_practice-react-animation-hero-slider2)Swiper を使用した際には、公式サイトにしたがって、コンポーネントを利用しましたが、Effect が使えなかったりの問題があったため、今回は JS で使用していきます。  
Swiper の部分は`swiperAnimation`として別ファイルに切り出しました。

import 以外は、ほぼ動画のままです。強いて言うなら、`gsap.to`の部分に警告が出るので、  
警告に従って修正を行っています。

```js:title=gsap.to(変更箇所)
//下記の警告が出る。durationをプロパティに設定しろとのことと思われる
//Deprecated method signature. Use the duration property instead.
gsap.to('.slide-text span', 0.2,{
  x: '-100px',
});

//解消
gsap.to('.slide-text span', {
  x: '-100px',
  duration: 0.2,
});
```

##### 実装

`swiperAnimation.js`は３つのパートに分かれています。  
詳しくは、[Swiper のドキュメント](https://swiperjs.com/swiper-api)を参照。

- `const slider = new Swiper()`  
  → インスタンス化
- `slider.on('slideChange', function () {})`  
  → アクティブなスライドが変わった際にコールバック関数を実行
- ` slider.on('slideChangeTransitionEnd', function () {})`  
  → prev や next のスライドへのアニメーションが終わった後に、更にアニメーションを実行

```js{16,30,58}:title=swiperAnimation.js
import { gsap, Power4 } from 'gsap';
import Swiper from 'swiper/bundle';
import 'swiper/swiper-bundle.css';

export default function swiperAnimation() {
  const keys = [
    'Mercury',
    'Venus',
    'Earth',
    'Mars',
    'Jupiter',
    'Saturn',
    'Uranus',
    'Neptune',
  ];
  const slider = new Swiper('.swiper-container', {
    slidesPerView: 'auto',
    spaceBetween: 150,
    centeredSlides: true,
    mousewheel: true,
    pagination: {
      el: '.planet-links',
      clickable: true,
      renderBullet: function (index, className) {
        return '<div class="' + className + '">' + keys[index] + '</div>';
      },
    },
  });

  slider.on('slideChange', function () {
    console.log('SLIDE CHANGED');
    gsap.to('.slide-text span', {
      x: '-100px',
      duration: 0.2,
    });
    gsap.to('.slide-number span', {
      x: '-100px',
      duration: 0.2,
    });
    gsap.to('.slide-detail span', {
      x: '-1000px',
      duration: 0.5,
    });
    gsap.to('.slide-detail-facts div', {
      x: '-1000px',
      duration: 0.5,
    });
    gsap.to('.swiper-slide-active', {
      scale: 0.85,
      duration: 0.5,
    });
    gsap.to('.swiper-slide .slide-img', {
      rotation: 20,
      duration: 1,
    });
  });

  slider.on('slideChangeTransitionEnd', function () {
    gsap.to('.swiper-slide .slide-img', {
      rotation: 10,
      duration: 1,
    });
    gsap.to('.slide-text span', {
      x: 0,
      delay: 0.1,
      duration: 0.2,
    });
    gsap.to('.slide-text span', {
      x: '100px',
      duration: 0,
    });

    gsap.to('.slide-number span', {
      x: 0,
      duration: 0.2,
    });
    gsap.to('.slide-number span', {
      x: '100px',
      duration: 0,
    });

    gsap.to('.slide-detail span', {
      x: 0,
      duration: 0.2,
    });

    gsap.to('.slide-detail-facts div', {
      x: 0,
      duration: 0.5,
    });

    gsap.to('.swiper-slide-active', {
      scale: 1,
      ease: Power4.easeOut,
      duration: 0.5,
    });

    gsap.to('.swiper-slide-active .slide-text', {
      autoAlpha: 1,
      duration: 0,
    });
    gsap.to('.swiper-slide-active .slide-number', {
      autoAlpha: 1,
      duration: 0,
    });

    gsap.to('.swiper-slide-next .slide-text', {
      autoAlpha: 0,
      duration: 0,
    });
    gsap.to('.swiper-slide-prev .slide-text', {
      autoAlpha: 0,
      duration: 0,
    });

    gsap.to('.swiper-slide-next .slide-number', {
      autoAlpha: 0,
      duration: 0,
    });
    gsap.to('.swiper-slide-prev .slide-number', {
      autoAlpha: 0,
      duration: 0,
    });
  });
}
```

##### swiper 以外のアニメーション

swiper 以外のアニメーションも別ファイルに切り出しています。  
こちらは`gsap`を使うだけでシンプルです。

```js:title=animationInit.js
import { gsap } from 'gsap';

export default function animationInit() {
  gsap.to('.rockbg1', {
    y: 12,
    repeat: -1,
    yoyo: true,
    delay: 0,
    duration: 2,
  });

  gsap.to('.swiper-slide-next .slide-text', {
    autoAlpha: 0,
    duration: 0,
  });
  gsap.to('.swiper-slide-prev .slide-text', {
    autoAlpha: 0,
    duration: 0,
  });

  gsap.to('.swiper-slide-next .slide-number', {
    autoAlpha: 0,
    duration: 0,
  });
  gsap.to('.swiper-slide-prev .slide-number', {
    autoAlpha: 0,
    duration: 0,
  });

  gsap.to('.swiper-slide', {
    scale: 0.85,
    duration: 0,
  });

  gsap.to('.swiper-slide-active', {
    scale: 1,
    duration: 0,
  });
}
```

#### SwiperContainer

今回はメインとなるコンポーネントを SwiperContainer というコンポーネント名で作成しました。  
要素の並びやクラス名は JS で書くときと同じですが、  
繰り返しの部分を map にしてみたりしてスッキリさせています。

ただし、`animationInit`の部分に関しては、  
`GSAP target .swiper-slide-next .slide-text not found.`  
というような警告が出てしまいます。おそらく、useEffect でレンダリングされる前に gsap が要素を探しにいくと、要素が見つからないと警告が出てしまっているものと思いますので、  
あまりよろしくない気もしますが、useEffect のクリーンアップの部分で`animationInit`を実行させています。どうするのが正解なんですかね？

```js:title=SwiperContainer.js
import React, { useEffect } from 'react';
import './SwiperContainer.css';
import animationInit from './animationInit';
import swiperAnimation from './swiperAnimation';

import { Data } from './data';
import rockbg1 from '../../images/rock.png';

export default function SwiperContainer() {
  const planets = Data;
  useEffect(() => {
    // animationInit();
    swiperAnimation();
    return animationInit();
  }, []);

  return (
    <section id='sectiontwo' className='screen'>
      <div className='swiper-container'>
        <div className='swiper-wrapper'>
          {planets.map((planet, index) => (
            <div className='swiper-slide' key={index}>
              <div className='slide-number'>
                <p>
                  <span>{planet.number}</span>
                </p>
              </div>
              <div className='slide-text'>
                <h4>
                  <span>{planet.text}</span>
                </h4>
              </div>
              <div className='slide-detail'>
                <p>
                  <span>{planet.detail}</span>
                </p>
              </div>
              <div className='slide-detail-facts'>
                <div>
                  <h5>
                    ORBIT PERIOD:
                    <span style={{ opacity: 0.8 }}>
                      {planet.detailFacts.orbitPeriod}
                    </span>
                  </h5>
                  <h5>
                    KNOWN MOONS:{' '}
                    <span style={{ opacity: 0.8 }}>
                      {planet.detailFacts.knownMoons}
                    </span>
                  </h5>
                </div>
              </div>
              <div className='slide-img'></div>
            </div>
          ))}
        </div>
      </div>

      {/* <!-- SLIDER LINKS --> */}
      <div>
        <div className='rockbg1'>
          <img src={rockbg1} alt='' />
        </div>
        <div className='planet-links'></div>
      </div>
    </section>
  );
}
```

planets のコンテンツの中身は、別ファイルに切り出し。

```js:title=data.js
export const Data = [
  {
    number: 'Mercury',
    text: '01',
    detail: `Mercury is the closest planet to the Sun but, perhaps
    surprisingly, it does not have the highest temperatures. It is
    the second densest planet of the Solar System, but also the
    smallest planet. The structure of Mercury makes it the most
    similar planet to Earth.`,
    detailFacts: {
      orbitPeriod: '87.97 Earth Days',
      knownMoons: 'None',
    },
  },
  //etc...
];
```

#### 最後に

以前うまくいかなかったかっこいい Swiper が実装できて満足です。  
React のライブラリで整備されていないものは、JS のライブラリを使っていきたいと思います。  
というか、GSAP 使えればだいたいやりたいことできそうですね。

GSAP も react-spring も結局は、要素のインラインスタイルの部分に値を設定し、制御するような仕組みのようですので、正直、サンプルの多い GSAP でいいかなと思いました。

#### その他

シンタックスハイライトの行指定のスタイルを追加しました。

```css:title=style.css
.gatsby-highlight-code-line {
  background-color: #545454;
  display: block;
  margin-right: -1em;
  margin-left: -1em;
  padding-right: 1em;
  padding-left: 0.75em;
  border-left: 0.25em solid var(--color-primary);
}
```

````js:title=js
//{}で行を指定
```js{16,30,58}:title=swiperAnimation.js
````

#### 参考

- [Swiper](https://swiperjs.com/get-started).
- [GSAP](https://greensock.com/docs/v3/GSAP/).
- [useEffect の副作用](https://ja.reactjs.org/docs/hooks-effect.html).
