---
title: React Redux 入門
date: "2021-05-21T14:38:37.121Z"
---

こんにちは。  
今回は React Redux 入門です。  
Redux の概念についてはわかりやすい Qiita の記事様があるので、ざっくりメモ程度です。

#### Redux とは

Redux は state 管理のためのライブラリです。React 以外でも利用はできます。

##### Redux の要素

- Action : 「何をする」のオブジェクト
- ActionCreator : Action を作るメソッド
- Dispatch : Action を Store に送る
- Store : state を保持している場所
- State : アプリケーションでの状態
- Reducer : action と state から新しい state を作る

公式の説明図。
![redux](redux.gif)

##### Redux 三つの原則

- Single source of truth（store はひとつのみ）
- State in read-only（state は読み取り専用、dispatch でしか state は変更できない）
- Changes are made with pure functions（変更は pure な関数で）

#### React Redux

React で Redux を使う場合には、下記の要素が必要です。

- `<Provider>` : アプリケーションをラップするコンポーネント
- `useSelector()` : store から更新を受け取り、反映させます
- `useDispatch()` : store の dispatch メソッドを提供し、action をディスパッチできるようにします

Redux の用語と、React Redux の用語で区別が必要です。
Provider のお決まりの呪文などの使い方は割愛。

それにしても、最初クラスコンポーネントで Redux を使ったときは絶望しました。  
React も初めて触った上に、mapStateToProps とか mapDispatchToProps とか  
ごちゃごちゃしておえーって感じでした。  
いまは Hooks でサクッと実装できるので全くストレスがないです。

#### 実際に使ってみる

ちょっと長くなりそうですが、後々困った時のためにメモ書きしておきます。  
まず、今回のプロジェクトのディレクトリ構成と Redux に関わる主要なファイルを確認します。  
これは、今回見ていた Udemy の講座まんまなので、他の方法もあると思います。

```bash:title=ディレクトリ構成
src
  ├ app
  │ ├ layout
  │ │ └ App.jsx
  │ └ store
  │    ├ configureStore.js        // reduxのcreateStoreメソッドでstoreを作成
  │    └ rootReducer.js           // reduxのcombineReducersメソッドで複数Reducerをまとめるところ
  ├ features
  │ └ shelfs
  │    ├ shelfDashboard
  │    │  └ ShelfDashboard.jsx   // stateを実際に使うコンポーネント
  │    ├ shelfConstants.js       // ActionTypeを定数化しています。よくやる方法です
  │    ├ shelfActions.js         // ActionCreatorの定義ファイル
  │    └ shelfReducer.js         // Reducerの定義ファイル
  └ index.js                      // indexファイル

```

実際にファイルの中身を確認してみましょう。

##### configureStore.js

redux の createStore メソッドで store を作成するところです。  
rootReducer という値を受け取って、store を作成しています。

```js
import { createStore } from "redux"
import { devToolsEnhancer } from "redux-devtools-extension"
import rootReducer from "./rootReducer"

export function configureStore() {
  return createStore(rootReducer, devToolsEnhancer())
}
```

##### rootReducer.js

redux の `combineReducers` メソッドを使って、rootReducer というのを作っています。  
こうしてあげることで、単一の store の中に、いくつかの state の断面を作成できます。  
下記の例でいうなら、test という state と、shelf という state を別個に管理しているわけですね。  
`rootReducer` だけで扱おうとすると、煩雑になるのでかなり便利です。

```js
import { combineReducers } from "redux"
import shelfReducer from "../../feature/shelfs/shelfReducer"
import testReducer from "../../features/sandbox/testReducer"

const rootReducer = combineReducers({
  test: testReducer,
  shelf: shelfReducer,
})

export default rootReducer
```

##### index.js

index.js の中身です。かなり端折って、redux に関係するところだけにしています。  
`configureStore`を受け取って、Provider を介して store を設定していますね。  
これで、Redux が使えるようになります。

```js:title=抜粋版
import { configureStore } from './app/store/configureStore';

const store = configureStore();

const rootEl = document.getElementById('root');

function render() {
  ReactDOM.render(
    <Provider store={store}>
          <App />
    </Provider>,
    rootEl
  );
}

```

##### shelfConstants.js

action オブジェクトは、type という値を保持します。  
これは、「何をするか」を表すものです。  
下記の例の場合は「Shelf を作る」という type が必要になりますが、  
type には文字列をわたす必要があります。

```js
action Objectの例
{
    type: 'CREATE_SHELF',
    payload: shelf,
};
```

そのさい、何度も文字列を手打ちしているとミスが起きやすいため、  
定数化してそれを使い回すわけですね。ちょっとしたテクニックです。

```js
export const CREATE_SHELF = "CREATE_SHELF"
export const UPDATE_SHELF = "UPDATE_SHELF"
export const DELETE_SHELF = "DELETE_SHELF"
```

##### shelfActions.js

ActionCreator を定義するところです。  
単純に、type と payload を返しています。

```js
import { CREATE_SHELF, UPDATE_SHELF, DELETE_SHELF } from "./shelfConstants"

export function createShelf(shelf) {
  return {
    type: CREATE_SHELF,
    payload: shelf,
  }
}

export function updateShelf(shelf) {
  return {
    type: UPDATE_SHELF,
    payload: shelf,
  }
}
export function createShelf(shelfId) {
  return {
    type: DELETE_SHELF,
    payload: shelfId,
  }
}
```

##### shelfReducer.js

Reducer の定義ファイルです。  
こいつが処理の本体みたいなところありますね。  
switch で type ごとに分岐します。

あくまで副作用はおこさない純粋関数ですので、スプレッド構文や filter などを活用して、  
新たな state を作成しています。

```js
import { sampleData } from "../../app/api/sampleData"
import { CREATE_SHELF, UPDATE_SHELF, DELETE_SHELF } from "./shelfConstants"

const initialState = {
  shelfs: sampleData,
}

export default function shelfReducer(state = initialState, { type, payload }) {
  switch (type) {
    case CREATE_SHELF:
      return {
        ...state,
        shelfs: [...state.shelfs, payload],
      }
    case UPDATE_SHELF:
      return {
        ...state,
        shelfs: [
          ...state.shelfs.filter(shelf => shelf.id !== payload.id),
          payload,
        ],
      }
    case DELETE_SHELF:
      return {
        ...state,
        shelfs: [...state.shelfs.filter(shelf => shelf.id !== payload.id)],
      }
    default:
      return state
  }
}
```

##### ShelfDashboard.jsx

ここで、Hooks の出番です。  
たとえば、useSelector を使うことで、shelf の state を読み込む事ができます。  
あるいは、useDispatch によって、dispatch インスタンスを作成し、  
deleteShelf の action オブジェクト（= actionCreator で作成）をわたすことで、  
state の変更を行うことが出来ます。

```js
import { useSelector } from "react-redux"

const { shelfs } = useSelector(state => state.shelf)
const dispatch = useDispatch()

;<Button
  onClick={() => dispatch(deleteShelf(shelf.id))}
  color="red"
  floated="right"
  content="Delete"
/>
```

#### 最後に

かなり長くなりましたが、Redux の基礎から React Hooks を用いた実装まで、  
ざっくりとメモ書きしてみました。  
Udemy の動画を見ながら実装していたときは、言われるがまま書いていましたが、  
こうして改めて復習すると、意外とシンプルでわかりやすいですね。

このあと、firebase なんかも絡んでくると複雑になりますが、、、

というわけで、今回は以上となります。

#### 参考

- [Redux 公式](https://redux.js.org/).

- [Redux 入門【ダイジェスト版】10 分で理解する Redux の基礎](https://qiita.com/kitagawamac/items/49a1f03445b19cf407b7).

- [Redux 入門 〜Redux の基礎を理解する〜](https://qiita.com/soarflat/items/bd319695d156654bbe86).

- [Redux Examples](https://github.com/reduxjs/redux/blob/master/docs/introduction/Examples.md).
