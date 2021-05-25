---
title: Firebase 入門 その２
date: "2021-05-25T16:18:37.121Z"
---

こんにちは。今回は 具体的に firestore を使った実装をしていきたいと思います。  
現在のディレクトリ構成から確認します。

##### ディレクトリ構成

```bash
./src
├── app
│   ├── config
│   │   └── firebase.js   // firebaseインスタンスを設定
│   └── firestore
│        └── firestoreService.js   // const db = firebase.firestoreやgetShelfsFromFirestoreを定義
└── feature
       └── shelfs
         ├── shelfDashboard   // getShelfsFromFirestoreを呼び出している
         └── shelfReducer.js
```

##### firestoreService.js

肝になっているのは、`getShelfsFromFirestore`です。  
この関数は、実行されると firestore にリッスンしにいき、かつ observer 内部に snapshot をわたします。  
observer 内には、メソッドが定義されているので、snapshot を引数として、処理を実行します。

```js:title=firestoreService.js
import firebase from '../config/firebase';

const db = firebase.firestore();

export function getShelfsFromFirestore(observer) {
  return db.collection('shelfs').onSnapshot(observer);
}
```

##### shelfDashboard

observer の処理の内容は、next で記載されています。  
ここで、dispatch(listenToShelfs())という React Redux の Hook を呼び出しています。  
listenToShelfs は受け取った値を state に格納するだけの Action Creator なので、  
snapshot の値を加工してそのまま渡せば、state が更新されます。

あとは、useSelector で state を呼び出せば、UI に firestore のデータが描画されることになります。

```js:title=shelfDashboard
  const dispatch = useDispatch();
  const { shelfs } = useSelector((state) => state.shelf);

useEffect(() => {
    const unsubscribe = getShelfsFromFirestore({
      next: (snapshot) =>
        dispatch(
          listenToShelfs(
            snapshot.docs.map((docSnapshot) => dataFromSnapshot(docSnapshot))
          )
        ),
      error: (error) => console.log(error),
    });

    return unsubscribe;  //ここで実行
  }, [dispatch]);
```

混乱しがちなのが、`getShelfsFromFirestore`って結局なに？というポイントです。

端的に言うと、`getShelfsFromFirestore`はクリックイベントみたいなもんで、  
画面がレンダリングされた最後に実行してやると、firebase を呼び出しに行く関数です。  
ここが理解できていなかったので、他の非同期処理とごちゃごちゃになってよくわからなくなりました。

#### useFirestoreCollection カスタムフック

さて、ここから少し応用編です。  
firebase のやり取りは非同期処理ですので、以前作成した async というステータスで監視したくなります([popularFilmReducer](/2021-05-23_tmdb)の中身と同じことをします)。

ただし、今回は Redux Thunk の出番がないため、外部への副作用を dispatch に含められません。  
そのため、カスタムフックを作成し、使いまわしていけばスッキリします。

```js:title=useFirestoreCollection.js
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import {
  asyncActionError,
  asyncActionFinish,
  asyncActionStart,
} from "../async/asyncReducer"
import { dataFromSnapshot } from "../firestore/firestoreService"

export default function useFirestoreCollection({ query, data, deps }) {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(asyncActionStart())
    const unsubscribe = query().onSnapshot(
      snapshot => {
        const docs = snapshot.docs.map(doc => dataFromSnapshot(doc))
        data(docs)
        dispatch(asyncActionFinish())
      },
      error => dispatch(asyncActionError(error))
    )
    return () => {
      unsubscribe()
    }
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps
}
```

カスタムフックの呼び出し側はこんな感じです。  
それぞれわたしている値は下記のとおりです。

- query : コレクショにリッスンしているインスタンス
- data : 実行される関数 = Action Creator
- deps : useEffect 用の値

```js
useFirestoreCollection({
  query: () => listenToShelfsFromFirestore(),
  data: shelfs => dispatch(listenToShelfs(shelfs)),
  deps: [dispatch],
})

// 別ファイルの定義
export function listenToShelfsFromFirestore() {
  return db.collection("shelfs")
}
```

#### 最後に

以上で firestore 入門その２はおわりです。  
基本的な firestore からのリッスンができようになりました。
