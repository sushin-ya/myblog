---
title: Redux Thunk入門
date: "2021-05-23T08:14:37.121Z"
---

こんにちは。  
今回は、WEB API への非同期処理をするために、Redux Thunk を導入します。  
非同期処理や Redux Thunk が何なのかもはや記憶にすらないため、基礎から復習していきます。

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

#### 参考

- [redux-thunk](https://github.com/reduxjs/redux-thunk).
- [Redux-Thunk で非同期処理ができる仕組みを理解しよう](https://qiita.com/jima-r20/items/7fee2f00dbd1f302e373).
