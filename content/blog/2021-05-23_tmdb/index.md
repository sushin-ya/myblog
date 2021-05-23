---
title: TMDB API 入門
date: "2021-05-23T12:18:37.121Z"
---

こんにちは。  
今回は TMDB API 入門ということで、いよいよ映画サイトらしくなってきました。  
とはいえ、API で使うのは機能のほんの一部分の予定です。  
youtube や技術記事などたくさん情報がありそうなので、困ることはないかと思います。

#### TMDB

TMDB とは、The Movie Database という無料の WEB API です。  
映画やテレビの情報をかなり詳細に提供してくれているみたいです。

##### 導入

導入に関しては、[こちら](https://weblion303.net/1262)の素晴らしい記事さま。
無事導入できました。

##### お試し fetch

お試しで fetch してみます。  
apikey は dotenv を使って`REACT_APP_TMDB_API_KEY`としています。

```js
import React, { useEffect, useState } from "react"

export default function Films() {
  const [fetchData, setFetchData] = useState()

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/550?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=ja-JP`
    )
      .then(response => response.json())
      .then(json => setFetchData(json))
  }, [])

  console.log(fetchData)

  return (
    <>
      <div>test</div>
      {fetchData && (
        <>
          <div>{fetchData.id}</div>
          <div>{fetchData.original_title}</div>
          <div>{fetchData.release_date}</div>
        </>
      )}
    </>
  )
}
```

![test](test.png)

ファイトクラブ！！！
リクエストの URL の末尾に`&language=ja-JP`をつけているので、ちゃんと日本語の情報も取れています。

#### TMDB/axios/Redux Thunk で人気映画の一覧を作る

それでは、実際に実装していきたいと思います。  
GET TOP RATED でレートの高い映画を取得します。
まずはディレクトリ構成から。

```bash:title=ディレクトリ構成
src
├ app
│ ├ layout
│ │ └ App.jsx
│ ├ store
│ │ ├ configureStore.js // redux の createStore メソッドで store を作成
│ │ └ rootReducer.js // redux の combineReducers メソッドで複数 Reducer をまとめるところ
│ └ async
│    └ asyncReducer.js
├ features
│ └ popular
│    ├ popularFilmReducer.js  // popularFilmのReducer
│    └ PopularPage.jsx // メインのコンポーネント
└ index.js // index ファイル

```

今回は、設定ファイルなどなどは割愛し、popularFilmReducer を見ていきます。

##### popularFilmReducer（import/宣言）

まずは、import と宣言部です。  
asyncAction を利用するので、インポートしています。  
また、api との通信のために axios を導入しています。

```js:title=popularFilmReducer（import/宣言）
import {
  asyncActionError,
  asyncActionFinish,
  asyncActionStart,
} from '../../app/async/asyncReducer';
import axios from 'axios';
import getYear from '../../app/common/utility';

const FETCH_POPULAR_FILM = 'FETCH_POPULAR_FILM';

const initialState = {
  popularFilms: [],
};

```

##### popularFilmReducer（ActionCreator 全体）

fetchPopularFilm という名前で Action Creator を作成しています。  
少し長くて分かりづらいので、先に構造を見ます。  
コメントアウト部分以外は、ほぼ定型文と考えて差し支えないでしょう。

```js:title=popularFilmReducer（ActionCreator）

export function fetchPopularFilm() {
  return async function (dispatch) {
    dispatch(asyncActionStart());
    try {
      // actionへわたすための、newFilmsという値をここで作り込む
      dispatch({ type: FETCH_POPULAR_FILM, payload: newFilms }); // 実体のaction creator
      dispatch(asyncActionFinish());
    } catch (error) {
      dispatch(asyncActionError(error));
    }
  };
}

```

##### popularFilmReducer（ActionCreator 詳細）

コメントアウトの部分は下記のとおりになっています。

```js{28,29}:title=popularFilmReducer(ActionCreator)
export function fetchPopularFilm() {
  return async function (dispatch) {
    dispatch(asyncActionStart());
    try {
      const films = await axios   // top_ratedの映画情報をGET
        .get(
          `https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=ja-JP&page=1`
        )
        .then((res) => {
          return res.data.results.slice(0, 5);  // 20個の情報のうち、５個に絞る
        });

      const directorPromises = films.map(async (film) => {  // 監督の情報は上記のGETでは取得できないため、別途取得する
        const dirct = await axios
          .get(
            `https://api.themoviedb.org/3/movie/${film.id}/credits?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=ja-JP&page=1`
          )
          .then((res) => {
            return res.data.crew;
          })
          .then((crew) => {
            const dir = crew.filter((person) => person.job === 'Director');   // crewの中で、jobが'Director'と一致した人が監督
            return dir[0];
          });
        return dirct;
      });

      const directors = await Promise.all(directorPromises).then((res) => res);   // async functionの返り値は、Promiseオブジェクトなので、そこから値を取り出してあげている。
      const directorName = directors.map((d) => d.name);    // オブジェクトの中のnameだけを配列に格納

      const newFilms = films.map((film, index) => {   // こちらのDB構造に合わせた形式に変換
        return {
          id: film.id,
          photoURL: `https://image.tmdb.org/t/p/w500${film.poster_path}`,
          title: film.title,
          release: getYear(film.release_date),
          director: directorName[index],
          description: film.overview,
        };
      });

      dispatch({ type: FETCH_POPULAR_FILM, payload: newFilms });
      dispatch(asyncActionFinish());
    } catch (error) {
      dispatch(asyncActionError(error));
    }
  };
}

```

今回は、ひとつの情報を取り出すために以下の過程を踏んでいます。

- top_rated な映画情報を取得して `films` に格納
- `films`の中にある映画の ID を用いて、映画の crew 情報を取得
- crew から job が'Director'の人だけを抽出 →directorName
- films と directorName を使ってオブジェクトを作成

２、３番で少しハマりました。  
最初は、films を作る then の中ですべての処理を済ませようとしていたのですが、  
async/await がネストになり、わけわからなくなってやめました。  
なので、処理を切り分けてきさいしました。  
この書き方でよいのかイマイチわかりませんが、ひとまずわかりやすく書けました。

あと、async function の返り値が Promise オブジェクトである、っていうのがいまいちしっくり来なくて、`await Promise.all()`にたどり着くまで時間がかかりました。  
JavaScript Primer のサンプルを眺めていてやっと理解できました。

##### popularFilmReducer（Reducer）

```js:title=popularFilmReducer

export default function popularFilmReducer(
  state = initialState,
  { type, payload }
) {
  switch (type) {
    case FETCH_POPULAR_FILM:
      return {
        ...state,
        popularFilms: payload,
      };
    default:
      return state;
  }
}

```

##### popularFilmReducer（全体）

```js:title=popularFilmReducer（全体）
import {
  asyncActionError,
  asyncActionFinish,
  asyncActionStart,
} from '../../app/async/asyncReducer';
import axios from 'axios';
import getYear from '../../app/common/utility';

const FETCH_POPULAR_FILM = 'FETCH_POPULAR_FILM';

const initialState = {
  popularFilms: [],
};

export function fetchPopularFilm() {
  return async function (dispatch) {
    dispatch(asyncActionStart());
    try {
      const films = await axios
        .get(
          `https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=ja-JP&page=1`
        )
        .then((res) => {
          return res.data.results.slice(0, 5);
        });

      const directorPromises = films.map(async (film) => {
        const dirct = await axios
          .get(
            `https://api.themoviedb.org/3/movie/${film.id}/credits?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=ja-JP&page=1`
          )
          .then((res) => {
            return res.data.crew;
          })
          .then((crew) => {
            const dir = crew.filter((person) => person.job === 'Director');
            return dir[0];
          });
        return dirct;
      });

      const directors = await Promise.all(directorPromises).then((res) => res);
      const directorName = directors.map((d) => d.name);

      const newFilms = films.map((film, index) => {
        return {
          id: film.id,
          photoURL: `https://image.tmdb.org/t/p/w500${film.poster_path}`,
          title: film.title,
          release: getYear(film.release_date),
          director: directorName[index],
          description: film.overview,
        };
      });

      dispatch({ type: FETCH_POPULAR_FILM, payload: newFilms });
      dispatch(asyncActionFinish());
    } catch (error) {
      dispatch(asyncActionError(error));
    }
  };
}

export default function popularFilmReducer(
  state = initialState,
  { type, payload }
) {
  switch (type) {
    case FETCH_POPULAR_FILM:
      return {
        ...state,
        popularFilms: payload,
      };
    default:
      return state;
  }
}

```

#### 参考

- [無料で映画情報を取得する API「TMDb」の使い方](https://weblion303.net/1262).
- [1.TMDB api を使ったアプリケーション紹介](https://qiita.com/nomu-008/items/ed0eaf1c75e6d84400a7).
- [TMDB](https://www.themoviedb.org/).
