---
title: React + TypeScript入門
date: "2021-06-30T22:44:37.121Z"
---

こんにちは。今回は、React + TypeScript についてです。

#### TypeScript とは

JavaScript のスーパーセットで、JavaScript を拡張するもの。  
JavaScript に静的型付けを導入することができる。

#### TypeScript のメリットは？

いくつかあるみたいですが、下記のようなものが挙げられます。

- 型チェックが強力
- 入力補完が可能
- JavaScript のスーパーセットなので古いバージョンへのトランスパイルできる

#### 導入

ひとまず、この二行

```bash
npm install typescript --save-dev
```

```bash
npx tsc ファイル名
```

#### 型定義

typescript では、`: 型`という形で、いろいろ定義できる。  
プリミティブ型、配列、オブジェクトだと下記の様な感じ。

```js
let age: number
age = 12

let hobbies: string[]
hobbies = ["Sports", "Coocking"]

let person: {
  name: string,
  age: number,
}

person = {
  name: "Max",
  age: 32,
}

let anything: any // 基本的に使わないほうがいい
```

なお、ts では型定義を行っていないと、型推論をしてチェックしてくれる。便利なやつ。

#### Union Types

型を組み合わせて定義することができる

```js
let sentence: string | number
sentence = "Max"
sentence = 12
```

#### Type Aliases

型を使い回すために alias を定義できる。  
コードが節約できるので大事。

```js
type Person = {
  name: string,
  age: number,
}

let person: Person
```

#### 関数と型

パラメタにも引数にも型を定義できる

```js
function add(a: number, b: number): number {
  return a + b
}

// 何も返さないときのみ、voidを定義する
function print(value: any): void {
  console.log(value)
}
```

#### ジェネリクス型

Generics とは、実際に利用されるまで型がわからないものに対して、抽象的な型引数を定義するものです。  
柔軟でありながら型安全な表現が可能になります。

```js
function insertAtBegginning<T>(array: T[], value: T) {
  const newArray = [value, ...array]
  return newArray
}

const numberArray = insertAtBegginning([1, 2, 3], -1)
const stringArray = insertAtBegginning(["a", "b", "c"], "d")
```

#### create-react-app with TypeScript

[公式](https://create-react-app.dev/docs/adding-typescript/)を見ればよし。

```bash
npx create-react-app my-app --template typescript
```

#### コンポーネントの基本

コンポーネントを作る際には、react に定義されている`React.FC`（functional component）を利用する。  
`<>`の中には、詳細な props の型を定義することができる。

```js
import React from "react"

const Todos: React.FC<{ items: string[] }> = props => {
  return (
    <ul>
      {props.items.map(item => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

export default Todos
```

この時、呼び出し元のコンポーネントで、props が渡されてないと、型チェックが走ってエラーになる。

```js
import Todos from "./components/Todos"
import "./App.css"

function App() {
  return (
    <div>
      // <Todos /> ← error!
      <Todos items={["Learn React", "Learn TypeScript"]} />
    </div>
  )
}

export default App
```

#### type を class で定義する

type は`type`や`interface`や`class`で定義できる。  
下記の場合は、class で定義している。これの優れている点は、インスタンス化して使ってもいいし、type として使ってもいいという点。

```js
class Todo {
  id: string
  text: string

  constructor(todoText: string) {
    this.text = todoText
    this.id = new Date().toISOString()
  }
}

export default Todo
```

#### 参考

- [TypeScript](https://www.typescriptlang.org/download).
- [create-react-app typescript](https://create-react-app.dev/docs/adding-typescript/)
