---
title: Redux Thunk入門
date: "2021-05-23T08:14:37.121Z"
---

こんにちは。  
今回は、WEB API への非同期処理をするために、Redux Thunk を導入します。  
Redux Thunk が何なのかもはや記憶にすらないため、基礎から復習していきます。
[こちらの記事様](https://qiita.com/jima-r20/items/7fee2f00dbd1f302e373)がわかりやすかったです。

#### Redux Thunk とは

Redux-Thunk とは、Redux に非同期処理を実装するためのミドルウェアです。

##### thunk ?

thunk とは、式をラップして評価を遅延させる関数であり、  
通常はただのオブジェクトを返すだけの Action Creator が、関数を返せるようになります。  
つまり、アクションのディスパッチを遅らせるため、または特定の条件が満たされた場合にのみディスパッチするために使用できます。

##### なぜ thunk が必要か

thunk が必要な理由は、Action Creator をピュアな関数に保つためのようです。  
条件分岐などの部分はミドルウェアが引き受けるわけですね。

```js
function increment() {
  return {
    type: INCREMENT_COUNTER,
  }
}

function incrementIfOdd() {
  return (dispatch, getState) => {
    const { counter } = getState()

    if (counter % 2 === 0) {
      return
    }

    dispatch(increment())
  }
}
```

##### 内部処理は？

dispatch→Reducer の間に挟まり、action がオブジェクトか関数かを判別します。  
関数の場合、Redux-thunk 内で新たに action を作成し、それをまた dispatch します。  
action がオブジェクトになっている場合、Reducer に渡されます。

#### Redux Thunk を使ってみる

さて、それでは具体的な Redux Thunk の使い方を見ていきましょう。  
前回からの変更点に\*をつけています。

```bash:title=ディレクトリ構成
src
├ app
│ ├ layout
│ │ └ App.jsx
│ ├ store
│ │ ├ *configureStore.js // redux の createStore メソッドで store を作成
│ │ └ *rootReducer.js // redux の combineReducers メソッドで複数 Reducer をまとめるところ
│ └ *async
│    └ *asyncReducer.js
├ features
│ └ *sandbox
│ │ └ *testReducer.js // テスト用のReducer
└ index.js // index ファイル

```

##### configureStore の変更

createStore の際に、`thunk` を用意し、`applyMiddleware` で包みます。

```js:title=configureStore.js
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './rootReducer';
import thunk from 'redux-thunk';

export function configureStore() {
  return createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));
}
```

##### asyncReducer.js

非同期処理中のステータスを管理するための Reducer を新たに作成します。

```js:title=asyncReducer.js
const ASYNC_ACTION_START = 'ASYNC_ACTION_START';
const ASYNC_ACTION_FINISH = 'ASYNC_ACTION_FINISH';
const ASYNC_ACTION_ERROR = 'ASYNC_ACTION_ERROR';
export const APP_LOADED = 'APP_LOADED';

export function asyncActionStart() {
  return {
    type: ASYNC_ACTION_START,
  };
}

export function asyncActionFinish() {
  return {
    type: ASYNC_ACTION_FINISH,
  };
}

export function asyncActionError(error) {
  console.log(error);
  return {
    type: ASYNC_ACTION_ERROR,
    payload: error,
  };
}

const initialState = {
  loading: false,
  error: null,
  initialized: false,
};

export default function asyncReducer(state = initialState, { type, payload }) {
  switch (type) {
    case ASYNC_ACTION_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ASYNC_ACTION_FINISH:
      return {
        ...state,
        loading: false,
      };
    case ASYNC_ACTION_ERROR:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case APP_LOADED:
      return {
        ...state,
        initialized: true,
      };
    default:
      return state;
  }
}
```

##### rootReducer.js

rootReducer にあらたに async を追加します。

```js:title=rootReducer.js
import { combineReducers } from 'redux';
import shelfReducer from '../../feature/shelfs/shelfReducer';
import asyncReducer from '../async/asyncReducer';
import testReducer from "../../features/sandbox/testReducer";

const rootReducer = combineReducers({
  shelf: shelfReducer,
  async: asyncReducer,
  test: testReducer
});

export default rootReducer;
```

##### testReducer

今回のサンプル用の testReducer です。  
分割して詳しく見ていきましょう。

まずは、import/定数宣言です。前述の asyncAction をインポートし、action について定義しています。

```js:title=testReducer.js(import/定数宣言)
import {
  asyncActionError,
  asyncActionFinish,
  asyncActionStart,
} from "../../app/async/asyncReducer";

const INCREMENT_COUNTER = "INCREMENT_COUNTER";
const DECREMENT_COUNTER = "DECREMENT_COUNTER";

const initialState = {
  data: 42,
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
```

ActionCreator の定義です。  
本体は、` dispatch({ type: INCREMENT_COUNTER, payload: amount });`と` dispatch({ type: DECREMENT_COUNTER, payload: amount });`の部分ですが、Redux Thunk を利用することで、asyncAction や delay など、直接 action とは関係のない処理を関数内に含めることが出来ています。

```js:title=testReducer.js(ActionCreator)
export function increment(amount) {
  return async function (dispatch) {
    dispatch(asyncActionStart());
    try {
      await delay(1000);
      dispatch({ type: INCREMENT_COUNTER, payload: amount });
      dispatch(asyncActionFinish());
    } catch (error) {
      dispatch(asyncActionError(error));
    }
  };
}

export function decrement(amount) {
  return async function (dispatch) {
    dispatch(asyncActionStart());
    try {
      await delay(1000);
      dispatch({ type: DECREMENT_COUNTER, payload: amount });
      dispatch(asyncActionFinish());
    } catch (error) {
      dispatch(asyncActionError(error));
    }
  };
}
```

testReducer です。特に変わったことはありません。

```js:title=testReducer.js(Reducer)
export default function testReducer(state = initialState, action) {
  switch (action.type) {
    case INCREMENT_COUNTER:
      return {
        ...state,
        data: state.data + action.payload,
      };
    case DECREMENT_COUNTER:
      return {
        ...state,
        data: state.data - action.payload,
      };
    default:
      return state;
  }
}
```

下記が全体になります。

```js:title=testReducer.js(全体)
import {
  asyncActionError,
  asyncActionFinish,
  asyncActionStart,
} from "../../app/async/asyncReducer";

const INCREMENT_COUNTER = "INCREMENT_COUNTER";
const DECREMENT_COUNTER = "DECREMENT_COUNTER";

const initialState = {
  data: 42,
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function increment(amount) {
  return async function (dispatch) {
    dispatch(asyncActionStart());
    try {
      await delay(1000);
      dispatch({ type: INCREMENT_COUNTER, payload: amount });
      dispatch(asyncActionFinish());
    } catch (error) {
      dispatch(asyncActionError(error));
    }
  };
}

export function decrement(amount) {
  return async function (dispatch) {
    dispatch(asyncActionStart());
    try {
      await delay(1000);
      dispatch({ type: DECREMENT_COUNTER, payload: amount });
      dispatch(asyncActionFinish());
    } catch (error) {
      dispatch(asyncActionError(error));
    }
  };
}

export default function testReducer(state = initialState, action) {
  switch (action.type) {
    case INCREMENT_COUNTER:
      return {
        ...state,
        data: state.data + action.payload,
      };
    case DECREMENT_COUNTER:
      return {
        ...state,
        data: state.data - action.payload,
      };
    default:
      return state;
  }
}
```

##### async state の使いみち

asyncReducer を登録したことで、非同期処理中かどうかのステータスを得ることができるようになりました。  
コンポーネントのローディングインディケーターなどに使います。

```js
const { loading } = useSelector(state => state.async)
```

#### 最後に

長くなりましたが、以上で Redux Thunk 入門は終わりです。  
非同期処理 →Redux→Redux Thunk と積み上げで概念を理解しないといけないので、  
ここらへんは大変ですね。  
次回は TMDB API に触れてみたいと思います。

#### 参考

- [redux-thunk](https://github.com/reduxjs/redux-thunk).
- [Redux-Thunk で非同期処理ができる仕組みを理解しよう](https://qiita.com/jima-r20/items/7fee2f00dbd1f302e373).
