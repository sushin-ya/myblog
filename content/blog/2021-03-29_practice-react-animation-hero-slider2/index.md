---
title: React/Swiperでヒーロースライダーした
date: "2021-03-29T17:20:37.121Z"
---

こんにちは。  
[前回](/2021-03-25_practice-react-animation-hero-slider)残念ながらヒーロースライダーを実装できなかったのですが、色々模索した結果、一部妥協して下記を完成としました。  
基本的に[【JavaScript＆CSS】ガチで学びたい人のための WEB 開発徹底実践（フロントエンド編）](https://www.udemy.com/course/front-dev-tutorial/)を React 向けに読み替えて実装していますので、ソースコードは割愛します。  
詳しくは知りたい方はぜひこの講座を受講してみてください。  
個人的にはかゆいところに手が届く内容で、とても勉強になります。

##### 完成品

![HeroSlider](./HeroSlider.gif)

#### Swiper

今回は代表的なライブラリである Swiper を利用しました。  
一応 React 向けにコンポーネントも整備されています。  
[公式](https://swiperjs.com/react)に従って、セットアップしていきます。

##### Installation

```shell:title=npm
  npm i swiper
```

##### Usage

`<Swiper>`コンポーネントの内部に`<SwiperSlide>`という子要素を設定します。  
主なプロパティは、`<Swiper>`コンポーネントにわたす感じですね。  
また、`Swiper styles`や`Swiper modules`の読み込みが必要です。  
ここらへんはおまじない的な要素と言えるでしょうか。

```js:title=example
// import Swiper core and required modules
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/swiper.scss';
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/pagination/pagination.scss';
import 'swiper/components/scrollbar/scrollbar.scss';

// install Swiper modules
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

export default () => {
  return (
    <Swiper
      spaceBetween={50}
      slidesPerView={3}
      navigation
      pagination={{ clickable: true }}
      scrollbar={{ draggable: true }}
      onSwiper={(swiper) => console.log(swiper)}
      onSlideChange={() => console.log('slide change')}
    >
      <SwiperSlide>Slide 1</SwiperSlide>
      <SwiperSlide>Slide 2</SwiperSlide>
      <SwiperSlide>Slide 3</SwiperSlide>
      <SwiperSlide>Slide 4</SwiperSlide>
      ...
    </Swiper>
  );
};
```

簡単に扱えそうですね。

#### EffectCoverflow

`EffectCoverflow`を利用したかったのですが、npm でインストールしたものの中身を見ると、  
css が空っぽでした。当然、アニメーションも動きません。  
これなんなんですかね？
ひとまず、派手なエフェクト使いたい場合は、普通に JS で書くしかなさそうでした。  
あるいは別のライブラリを利用するか。。。  
今回はひとまず妥協してデフォルトのものを利用します。

#### 最後に
さて、これで最初に予定していた下記の要素が利用可能になりました。  
今後は、これらを組み合わせて素敵なLPサイトっぽいのを作成していきたいと思います。  

- 文字のアニメーション
- 画像のカバースライド
- ヒーロースライダー
- 上記＋スクロールしたらふわっと出現

#### 参考

- [Swiper/react](https://swiperjs.com/react).
