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
never 型は never 型しか代入できない

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

##### intersection 型

`&`で型を合体する

```ts
type Name = {
  name: string
}

type Age = {
  age: number
}

type Human = Name & Age
```

##### union 型

`|`で複数の型を指定する。

```ts
let foo: number | string = 1
foo = "test"
```

##### Literal 型

文字列や数値を明示的に定義する。（union と似ててややこし）

```ts
const day: "月" | "火" | "水" = "月"
```

string として型推論されてしまうことがある場合、型アサーションで定義してあげると、`Type string is not assignable to type "foo"`を回避出来る。

enum は数値ベースなので、文字列ベースの列挙はリテラルで行うとよい

```ts
function iTakeFoo(foo: "foo") {}
const test = {
  someProp: "foo" as "foo",
}
iTakeFoo(test.someProp) // Okay!
```

#### 型アサーション

`as`ってやつ。（`<foo>`でも出来るけど JSX とややこしくなるから非推奨）。ちょっと型安全ではない。  
ダブルアサーションという技もある。

```ts
function handler(event: Event) {
  let element = event as HTMLElement // Error: Neither 'Event' nor type 'HTMLElement' is assignable to the other
  // let element = (event as any) as HTMLElement // Okay!
}
```

const アサーション（再代入は行わない）というものもある。
下記の例は"Hamu"型なので、"Ham"しか再代入はできない。オブジェクトでも同じことが出来る。readonly な型になる。

```ts
let nickname = "Ham" as const
nickname = "Hamutaro"
```

#### Freshness(厳密なオブジェクトリテラルチェック)

オブジェクトの中身は`foo?`のように、使うかわからないものも含めてすべて定義しておくのがいい

```ts
// Assuming
interface State {
    foo?: string;
    bar?: string;
}

// You want to do:
this.setState({foo: "Hello"}); // Yay works fine!

// Because of freshness it's protected against typos as well!
this.setState({foos: "Hello"}}; // Error: Objects may only specify known properties

// And still type checked
this.setState({foo: 123}}; // Error: Cannot assign number to a string
```

#### 型ガード

interfaceof や typeof を使って、if 文と組み合わせることで、型によって処理を分岐できる。  
コールバックの内部だとローカルにしたりちょっと癖がある？

#### 関数のオーバーロードとシグネチャ

引数と戻り値のみを定義（シグネチャ）して、関数の実体のほうでは型制約を行わない。  
実体の関数内部では、typeof で分岐を行う。

```ts
// Overloads
function padding(all: number)
function padding(topAndBottom: number, leftAndRight: number)
function padding(top: number, right: number, bottom: number, left: number)
// Actual implementation that is a true representation of all the cases the function body needs to handle
function padding(a: number, b?: number, c?: number, d?: number) {
  if (b === undefined && c === undefined && d === undefined) {
    b = c = d = a
  } else if (c === undefined && d === undefined) {
    c = a
    d = b
  }
  return {
    top: a,
    right: b,
    bottom: c,
    left: d,
  }
}
```

```ts
padding(1) // Okay: all
padding(1, 1) // Okay: topAndBottom, leftAndRight
padding(1, 1, 1, 1) // Okay: top, right, bottom, left

padding(1, 1, 1) // Error: Not a part of the available overloads
```

#### 高度な型など

##### ジェネリクス型

抽象的な型を定義できる。
慣習的に単純な型には T、U、V を使おう。

##### Nullable Types

tsconfig 内で strict null check が入っているかどうかで扱いが変わる。
一般的にはよくない。普通は Union 型で null を許容する

```ts
age: number | null
```

##### インデックスシグネチャ

> JavaScript(TypeScript)の Object は、他の JavaScript オブジェクトへの参照を保持し、文字列でアクセスできます。

つまり、暗示的に toString()的なことを内部でやっている。明示的に宣言を行うことで、エラーを回避することが出来る。
なお、index は任意の文字列であり、かつ number 型も指定できるらしい。
オブジェクト内の型を制約できる？みたいだけど、あまり使い所がわからん。

```ts
let foo: { [index: string]: { message: string } } = {}

/**
 * Must store stuff that conforms to the structure
 */
/** Ok */
foo["a"] = { message: "some message" }
/** Error: must contain a `message` or type string. You have a typo in `message` */
foo["a"] = { messages: "some message" }

/**
 * Stuff that is read is also type checked
 */
/** Ok */
foo["a"].message
/** Error: messages does not exist. You have a typo in `message` */
foo["a"].messages
```

#### UtilityType と ConditionalType

[公式](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)を見ればすべてが分かる

##### Partioal

すべてがオプションになるように型を引き継ぐ  
内部的な実装はインデックスシグネチャと keyof を使って行われている  
[`keyof`](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html)はオブジェクトを文字列か数値のリテラル型の union type を生成する  
`T[P]`は P をキーにして型にアクセスしている

```ts
type Partial<T> = {
  [P in keyof T]?: T[P]
}
```

##### Required

すべてが必須になるように型を引き継ぐ

##### Mapped

別の型を元に型を作る  
`[P in keyof T]?: T[P]`みたいに in keyof で定義する  
他の UtilityType と組み合わせて使うっぽい

##### Readonly

readonly にする

##### Record<Keys, Type>

Keys（文字列リテラル型） と Type（オブジェクト） を引数に取る

```ts
interface CatInfo {
  age: number
  breed: string
}

type CatName = "miffy" | "boris" | "mordred"

const cats: Record<CatName, CatInfo> = {
  miffy: { age: 10, breed: "Persian" },
  boris: { age: 5, breed: "Maine Coon" },
  mordred: { age: 16, breed: "British Shorthair" },
}
```

##### Exclude

指定した型を除外する

```ts
type Exclude<T, U> = T extends U ? never : T
```

ConditionalType で定義されている  
` SomeType extends OtherType ? TrueType : FalseType;`

Distributive ConditionalType の説明。  
`For example, an instantiation of T extends U ? X : Y with the type argument A | B | C for T is resolved as (A extends U ? X : Y) | (B extends U ? X : Y) | (C extends U ? X : Y).`

##### Extract

アサイン可能な型を抽出する

```ts
type T0 = Extract<"a" | "b" | "c", "a" | "f">
// type T0 = "a"
```

##### NonNullable

null と undefined を除外する

##### Pick

欲しい物を選択して型を構築する

##### Omit

いらないものを除外して型を構築する

##### ReturnType

戻り値の型を取得する

```ts
type ReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : any
```

ReturnType は関数じゃないと引数にできない

```ts
<T extends (...args: any) => any>
```

infer 句は、generics の`T`みたいに、後続で同じ型`R`を再利用するために型を拾い上げている

##### Parameter

関数型 Type のパラメーターで使用される型からタプル型を構築する  
ライブラリなどの関数の引数の型を定義するときに使える

##### ConstructorParameters

インスタンスの引数の型を作る

#### React と TypeScript

そのうち読もう  
[cheatsheets](https://github.com/typescript-cheatsheets/react#reacttypescript-cheatsheets)

#### 参考

- [TypeScript Deep Dive](https://typescript-jp.gitbook.io/deep-dive)
- [UtilityType](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)
- [ConditionalType](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
- [MappedType](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)
- [サバイバル TypeScript](https://book.yyts.org/overview/range-of-typescript)
- [TypeScript/指定した型のプロパティ名を取得する](https://zenn.dev/shztmk/articles/02_typescript-key-matching)
- [Mapped Types の基本形](https://zenn.dev/qnighy/articles/dde3d980b5e386)
- [cheatsheets](https://github.com/typescript-cheatsheets/react#reacttypescript-cheatsheets)
