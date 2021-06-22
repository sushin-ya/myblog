---
title: WEB DEVELOPER Roadmap / JavaScript
date: "2021-06-17T23:31:37.121Z"
---

こんにちは。今回は、JavaScript の復習です。  
とはいえ、どちらかというとこれとこれは何が違うの？っていうことについてメモしていきます。  
細かい文法だけではなく、DEVELOPER Roadmap で言及されているコンセプトなどにもリーチしていきたいです。  
内容は[jsprimer](https://jsprimer.net/intro/)から抜粋です。

#### 変数と宣言

##### const

再代入できない変数の宣言  
定数ではなく、オブジェクトなど値を変更する事ができる。

##### let

再代入が可能な変数を宣言

##### var

古くからある変数宣言のキーワードですが、意図しない動作を作りやすい。  
同じ名前の変数を再定義出来てしまう。

あるいは、宣言する前にその変数を参照できてしまう（undefined となる）。
これは巻き上げ（ホイスティング）と呼ばれ、あらゆるスコープが無視され、関数直下に宣言部分が移動しているように見える挙動をする。

```js
function fn() {
  // 内側のスコープにあるはずの変数`x`が参照できる
  console.log(x) // => undefined
  {
    var x = "varのx"
  }
  console.log(x) // => "varのx"
}
fn()
```

↓ のように解釈される

```js
// 解釈されたコード
function fn() {
  // もっとも近い関数スコープの先頭に宣言部分が巻き上げられる
  var x
  console.log(x) // => undefined
  {
    // 変数への代入はそのままの位置に残る
    x = "varのx"
  }
  console.log(x) // => "varのx"
}
fn()
```

function キーワードで関数宣言した場合も、同様に巻き上げを行うしようになっているため、関数呼び出しは関数定義の前に書くことが可能となる。

ただし、var function とすると、var の宣言の挙動になるため、関数定義前に呼び出すと undefined となる。（ややこしい）

#### 値の評価と表示

式を評価した場合は、結果が返値になるが、変数宣言の場合は、何も返さない（undefined）

#### データ型とリテラル

データ型はプリミティブ型とオブジェクト型に大別される。  
プリミティブ型は一度作成したら変更できないイミュータブルの特性を持つ。  
オブジェクト型（複合型）は値を変更できるミュータブルな特性を持つ。

##### プリミティブ型

プリミティブ型の種類

- 真偽値
- 数値
- 巨大な整数
- 文字列
- undefined
- null
- シンボル

##### リテラル

リテラルとは、プログラム上であるデータ型を表現するための文法のようなもの。例えば文字列型は`"`と`"`で囲う、など。

##### null

null はリテラルであるので、変数名として定義できない

```js
var null // => SyntaxError
```

##### undefined

undefined はリテラルではないので、変数名として定義できる

```js
function fn() {
  var undefined = "独自の未定義値" // undefinedという名前の変数をエラーなく定義できる
  console.log(undefined) // => "独自の未定義値"
}
fn()
```

#### 演算子

##### 二項演算子

項が左と右の 2 つ必要な演算子

```js
console.log(1 + 1) // => 2
```

##### 単項演算子

項が 1 つの演算子

```js
// 文字列→数値のキャストだけど意図しない動作になる場合があるので、あんまりよくない
console.log(+"1") // => 1
```

##### NaN

数値に変換できない文字列をキャストするとなる。  
Not-a-Number だが、自分自身とも一致しないという特性がある。  
バグの原因となりがちなので、明確に型変換するか、NaN の場合分けすることが必要になる。

```js
// 自分自身とも一致しない
console.log(NaN === NaN) // => false
// Number型である
console.log(typeof NaN) // => "number"
// Number.isNaNでNaNかどうかを判定
console.log(Number.isNaN(NaN)) // => true
```

##### 厳密等価演算子

同じ型の同じ値であるか判定する。  
オブジェクトの場合は、同じオブジェクトを参照しているか確認する。

```js
console.log(1 === 1) // => true
console.log(1 === "1") // => false
```

##### 等価演算子

等価演算子（==）は、暗黙の型変換を行ってから値を比較するため、基本的には使わない。  
ただし、null と undefined を同一視する場合は、使い勝手がいい。

```js
const value = undefined /* または null */
// === では2つの値と比較しないといけない
if (value === null || value === undefined) {
  console.log("valueがnullまたはundefinedである場合の処理")
}
// == では null と比較するだけでよい
if (value == null) {
  console.log("valueがnullまたはundefinedである場合の処理")
}
```

##### falsy な値 7 種類

論理演算子において、false と判定されるもの。

- false
- undefined
- null
- 0
- 0n
- NaN
- ""（空文字列）

##### Nullish coalescing 演算子(??)

左辺の値が nullish（null か undefined） であるなら右辺の評価結果を返す。

```js
// 左辺がnullishであるため、右辺の値の評価結果を返す
console.log(null ?? "右辺の値") // => "右辺の値"
console.log(undefined ?? "右辺の値") // => "右辺の値"
// 左辺がnullishではないため、左辺の値の評価結果を返す
console.log(true ?? "右辺の値") // => true
console.log(false ?? "右辺の値") // => false
console.log(0 ?? "右辺の値") // => 0
console.log("文字列" ?? "右辺の値") // => "文字列"
```

OR 演算子（||）は左辺が falsy だと、右辺を評価してしまうため、いい感じに扱えない。Nullish coalescing だと`0`とかの値でも、nullish でなければ値として扱ってくれるので、便利。

#### 関数と宣言

##### Rest parameters

可変長引数/Rest parameters。引数に渡された値を配列として受け取る便利なやつ。

```js
function f(...args)){}
```

#### 文と式

JavaScript は、文（Statement）と式（Expression）から構成されています。if などの、文は式になれません。

##### 式

値を生成し、変数に代入できるもの

##### 文

処理する 1 ステップ、`;`が文末につくもの。

#### ループと反復処理

for 文では continue や break などが使えるが、配列のメソッドでは使えない。配列のメソッドでは一時的な変数の定義が不要であったり、コールバック関数として書く。

##### for と forEach

for は条件式をかける通常のループ。
forEach は配列用。

##### 配列の some

some は一度でも true を返した時点で反復処理を終了する

##### 配列の filter

filter は配列の各要素をテストして true を返した要素のみを集めた配列を返す

##### オブジェクトのループ、for...in

for...in は obj の key を引数として反復処理する。
ただし、オブジェクト継承元のプロパティも列挙するなど、多く問題があるから使わなくていい。
※2020 からはどのブラウザでも大丈夫らしい

##### iterable オブジェクトのループ、 for...of

iterable は配列から値を取り出す順番が定義されたオブジェクトのことらしい。Array や String は iterable オブジェクト。
for...of は配列に対して使えばいい。

#### オブジェクト

##### Optional chaining 演算子（?.）

オブジェクトのプロパティを取り出すときに例外を発生させない技

```js
const obj = {
  a: {
    b: "objのaプロパティのbプロパティ",
  },
}
// obj.a.b は存在するので、その評価結果を返す
console.log(obj?.a?.b) // => "objのaプロパティのbプロパティ"
// 存在しないプロパティのネストも`undefined`を返す
// ドット記法の場合は例外が発生してしまう
```

##### オブジェクトのプロパティ名は文字列化される

オブジェクトのプロパティ名は文字列化される
ただし、シンボルは文字列化されない

##### オブジェクトの列挙

- Object.keys メソッド: オブジェクトのプロパティ名の配列にして返す
- Object.values メソッド[ES2017]: オブジェクトの値の配列にして返す
- Object.entries メソッド[ES2017]: オブジェクトのプロパティ名と値の配列の配列を返す

```js
// `Object.keys`はキーの列挙した配列を返す
console.log(Object.keys(obj)) // => ["one", "two", "three"]
// `Object.values`は値を列挙した配列を返す
console.log(Object.values(obj)) // => [1, 2, 3]
// `Object.entries`は[キー, 値]の配列を返す
console.log(Object.entries(obj)) // => [["one", 1], ["two", 2], ["three", 3]]
```

##### オブジェクトのマージ

`Object.assign()`[ES2015]ってのもあるけど、spread 構文[ES2018]でよいのではないか。

spread 構文では、キーが重複すると後ろにあるオブジェクトによって上書きされる。

```js
// `version`のプロパティ名が被っている
const objectA = { version: "a" }
const objectB = { version: "b" }
const merged = {
  ...objectA,
  ...objectB,
  other: "other",
}
// 後ろにある`objectB`のプロパティで上書きされる
console.log(merged) // => { version: "b", other: "other" }
```

##### オブジェクトの複製

JavaScript には関数がないが、`Object.assign`メソッドを使うことで複製ができる。`Object.assign`は新たなオブジェクトとして作成される。  
ただし、浅いコピーしかしてくれないから、ネストされたオブジェクトの場合はめんどくさい。

```js
// 引数の`obj`を浅く複製したオブジェクトを返す
// nestはコピーできない
const shallowClone = obj => {
  return Object.assign({}, obj)
}
// 引数の`obj`を深く複製したオブジェクトを返す
function deepClone(obj) {
  const newObj = shallowClone(obj)
  // プロパティがオブジェクト型であるなら、再帰的に複製する
  Object.keys(newObj)
    .filter(k => typeof newObj[k] === "object")
    .forEach(k => (newObj[k] = deepClone(newObj[k])))
  return newObj
}
const obj = {
  level: 1,
  nest: {
    level: 2,
  },
}
```

```js
const shallowClone = obj => {
  return Object.assign({}, obj)
}
```

#### プロトタイプオブジェクト

##### Object はすべての元

Array、String、Function などはすべて prototype オブジェクトを継承している。`toString()`などのビルドインオブジェクトはすべて Object の prototype オブジェクトに実装されている。

##### hasOwnProperty と in 演算子の違い

マニアックになってきた。

```js
const obj = {}
// `obj`というオブジェクト自体に`toString`メソッドが定義されているわけではない
console.log(obj.hasOwnProperty("toString")) // => false
// `in`演算子は指定されたプロパティ名が見つかるまで親をたどるため、`Object.prototype`まで見にいく
console.log("toString" in obj) // => true
```

##### Object.prototype を継承しないオブジェクト

今はもう使い方ないらしい

```js
// 親がnull、つまり親がいないオブジェクトを作る
const obj = Object.create(null)
// Object.prototypeを継承しないため、hasOwnPropertyが存在しない
console.log(obj.hasOwnProperty) // => undefined
```

#### 配列

##### 条件に一致する要素を取得

`find`メソッドを使えばコールバック関数の引数にできるよ。

##### 指定範囲の要素を取得

`slice`メソッドを使う。第一引数は開始位置、第二引数は終了位置。

##### 真偽値を取得

`includes`メソッドを利用すれば、指定の要素が含まれているか判定できる。  
異なるオブジェクトだが、同じ値のプロパティを探す場合は`some`メソッドをつかうこと。

##### 配列から要素を削除

`splice`メソッドを使う。

##### 配列の反復処理メソッド

- forEach
- map
- filter
- reduce

#### 文字列、Unicode、ラッパーオブジェクト

細かすぎるので省略。

#### 関数とスコープ

##### クロージャ

「外側のスコープにある変数への参照を保持できる」という性質のこと。関数が状態を持っているように振る舞える仕組み。  
下記の２つの性質により動く。

- 静的スコープ：静的スコープ: ある変数がどの値を参照するかは静的に決まる
- メモリ管理の仕組み：参照されなくなったデータはガベージコレクションにより解放される

#### 関数と this、クラス

this は条件によって参照先が異なる。React でクラスコンポーネント使わないので、省略。

#### 非同期処理

[ここ](/2021-05-23_async_function/)に前まとめた。

#### shadow DOM

見たことなかった単語なので、ぐぐってみました。  
まああまり意識しなくていいみたいなので定義だけで。

> Web コンポーネントにおいてカプセル化 (構造やスタイル、挙動を隠し、同じページの他のコードと分離すること) は重要です。これにより他の場所でのクラッシュを防ぎ、またコードが綺麗になります。Shadow DOM API はこの隠され分離された DOM を付加するための方法を提供しています。

#### 最後に

ざっとではありますが、細かい気になるポイントを書き抜きしてみました。改めて見直すと、やっぱりかなり詳しく書かれていて勉強になりますね。配列やオブジェクトの操作なんかも、どうやるんだったっけ？となったときに参照しに来れば良いと思いました。

#### 参考

- [jsprimer](https://jsprimer.net/intro/)
- [shadow DOM](https://developer.mozilla.org/ja/docs/Web/Web_Components/Using_shadow_DOM)
- [Shadow DOM の特性を知って、使いこなすコツ](https://qiita.com/alangdm/items/cec32f21151a9da3c3f2)
