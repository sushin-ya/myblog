---
title: TypeScript復習
date: "2021-10-31T19:06:37.121Z"
---

こんにちは。最近は Vue と Nuxt の基本的なところをカンゼンに理解した！と毎日業務をやっています。  
それっぽいアプリの機能とかって、どうやったら良いか悪いか判断がつくのでしょうか。経験...ですかね。一番こまる。  
さて、今回から TypeScript の復習です。今は適当に型を定義するくらいで、いまいち恩恵を受けれていないので、もう少し踏み込んで使いこなしていきたいところです。気になったところを覚え書きしていく感じです。

#### モダンな JavaScript

##### クロージャ内の let

「何をログに表示するか？」という質問です。答えはすべて３。  
var ではなく let を使うと、別のスコープで作成されるので、1,2,3 となる。

```js
var funcs = []
// たくさんの関数を作成する
for (var i = 0; i < 3; i++) {
  funcs.push(function () {
    console.log(i)
  })
}
// それらを呼び出す
for (var j = 0; j < 3; j++) {
  funcs[j]()
}
```

##### ジェネレータ関数

ジェネレータオブジェクトを返却する `function*`というやつ。next, return ,throw が使える。

#### プロジェクトの環境設定

##### コンパイルコンテキスト（tsconfig.json）

compilerOptions を使ってコンパイラオプションをカスタマイズできる。

##### 型定義ファイル

declare キーワードを使用して他の場所に存在するコードを記述しようとしていることを TypeScript に伝えることができます。
.ts や.d.ts などで定義する事ができる。

##### lib.d.ts

lib.d.ts は JavaScript ランタイムと DOM に存在するさまざまな一般的な JavaScript を構成する機能のアンビエント宣言が含まれている

#### 基本的な型

##### tupple

型推論を上手にやってくれないので、ちゃんと定義すること

```ts
const tupple: [string, number] = ["test", 123]
```

##### never

never は呼び元に戻っていかない。

```ts
function error(message: string): never {
  throw new Error(message)
}

try {
  let res = error("test")
  console.log(res) // 実行されない
} catch (error) {
  console.log({ error })
}
```

##### 型エイリアス

これだけイコールだからややこしくなるねん。

```ts
type Mojiretsu = string
```

##### interface

type と書き方を混同しないように

```ts
interface ObjectInterface {
  name: string
  age: number
}
```

##### Enums 型

JavaScript にはない型。

```ts
enum Tristate {
  False,
  True,
  Unknown,
}
```

`(Tristate["False"] = 0)`は 0 を代入しつつ、返り値で 0 が返ってきている。（自己説明的？らしい）

```js
var Tristate
;(function (Tristate) {
  Tristate[(Tristate["False"] = 0)] = "False"
  Tristate[(Tristate["True"] = 1)] = "True"
  Tristate[(Tristate["Unknown"] = 2)] = "Unknown"
})(Tristate || (Tristate = {}))
```

任意の番号からインクリメントもできる

```ts
enum Color {
  DarkRed = 3, // 3
  DarkGreen, // 4
  DarkBlue, // 5
}
```

フラグにもできる（`|=`や`&=`でビット演算子で論理回路を生成する）

```ts
enum AnimalFlags {
  None = 0,
  HasClaws = 1 << 0,
  CanFly = 1 << 1,
  EatsFish = 1 << 2,
  Endangered = 1 << 3,
}
```

文字列列挙型(String Enums)はデバッグしやすくしてくれる。

```ts
export enum EvidenceTypeEnum {
  UNKNOWN = "",
  PASSPORT_VISA = "passport_visa",
  PASSPORT = "passport",
  SIGHTED_STUDENT_CARD = "sighted_tertiary_edu_id",
  SIGHTED_KEYPASS_CARD = "sighted_keypass_card",
  SIGHTED_PROOF_OF_AGE_CARD = "sighted_proof_of_age_card",
}
```

enum は拡張可能

```ts
enum Color {
  Red, // 0
  Green, // 1
  Blue, // 2
}

enum Color {
  DarkRed = 3,
  DarkGreen,
  DarkBlue,
}
```

##### unknown 型

型安全な any 型。type of と組み合わせて使えば any に頼りすぎずにいられる。この type of は型ガードと呼ばれる。

#### 参考

・[TypeScript Deep Dive](https://typescript-jp.gitbook.io/deep-dive)
