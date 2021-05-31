---
title: Cloud Functions for Firebase
date: "2021-05-31T17:48:37.121Z"
---

こんにちは。今回は Cloud Functions for Firebaseについてです。  

#### Cloud Functions for Firebaseとは
Firebase内の機能、たとえばDBへの更新を行った場合や、HTTPリクエストをトリガーに、  
サーバサイドで処理を行う場合に使える機能です。  
可能な処理としては下記の４つが挙げられています。 

- 関心事が発生したときにユーザーに通知します。
- データベースのサニタイズとメンテナンスを実行します。
- アプリではなくクラウドで集中的なタスクを実行します。
- サードパーティのサービスおよび API と統合します。

#### Cloud Functions for Firebaseの例
下記の例では、firestoreに更新があった場合、他のDBに更新をするような処理です。  
Firebase内のサービスであれば、adminにもfirestoreにもかんたんにアクセスできます。  

また、`context`という引数を使うことで、リクエストのパラメタを使ったりできます。  

```js
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {
  snapshotConstructor,
} = require("firebase-functions/lib/providers/firestore");
admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

exports.addFollowing = functions.firestore
  .document("following/{userUid}/userFollowing/{profileId}")
  .onCreate(async (snapshot, context) => {
    const following = snapshot.data();
    console.log({ following });
    try {
      const userDoc = await db
        .collection("users")
        .doc(context.params.userUid)
        .get();
      const batch = db.batch();
      batch.set(
        db
          .collection("following")
          .doc(context.params.profileId)
          .collection("userFollowers")
          .doc(context.params.userUid),
        {
          displayName: userDoc.data().displayName,
          photoURL: userDoc.data().photoURL,
          udi: userDoc.id,
        }
      );
      batch.update(db.collection("users").doc(context.params.profileId), {
        followerCount: admin.firestore.FieldValue.increment(1),
      });
      return await batch.commit();
    } catch (error) {
      return console.log(error);
    }
  });
```

#### 最後に
Nodeの記法？なので、馴染みがないexportsなどがあります。  
早くサーバサイドの勉強もしたいですね。  
ESLinst google設定周りがめんどくさい気がする。。。

#### 参考
[Cloud Functions for Firebase](https://firebase.google.com/docs/functions?hl=ja).