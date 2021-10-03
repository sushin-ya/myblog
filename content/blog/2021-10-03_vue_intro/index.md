---
title: Vue入門
date: "2021-10-03T20:06:37.121Z"
---

こんにちは。  
Next の勉強がままならないうちに、React 案件から Vue 案件に移ったので、Vue 入門したいと思います。  
何もわからないけど大丈夫だろうかと不安ですが、しこしこ勉強していくほかないですね。  
ひとまず 10 分でわかる Vue 入門みたいなのには目を通したので、公式のガイドを読んでいきたいと思います。

#### 宣言的レンダリング

ようは、Vue のインスタンス内のデータを更新したりすれば、Vue がいい感じにレンダリングしてくれるから DOM 操作はあまり意識しなくていいよということっぽい。

#### v-xxx

v-xxx がいろいろあるらしい。

- v-bind(値の定義)
- v-if
- v-for
- v-on(ユーザイベント)
- v-model(双方向バインディング)

#### コンポーネント

React と同じようにコンポーネントで作るらしい。インスタンスらしい。

> Vue においては、「コンポーネント」は本質的にはあらかじめ定義されたオプションを持つ Vue インスタンスです。

ここまでがはじめにの内容

#### Vue インスタンス

Vue の本質は Root Instance を起点にツリー構造のインスタンスのつながりらしい

##### $

Vue インスタンスは、いくつかの便利なプロパティとメソッドは`$`を使う

##### アロー関数は禁止

インスタンスプロパティまたはコールバックでアロー関数 を使用してはだめ。
this が存在しないかららしい。

```js
// $watch はインスタンスメソッドです
vm.$watch("a", function (newValue, oldValue) {
  // このコールバックは `vm.a` の値が変わる時に呼ばれます
})
```

#### テンプレート構文

`{{}}`これは Mustache（口ひげ）というらしい。  
id やクラスなんかは v-bind を使って定義するみたい。

```js
<span>Message: {{ msg }}</span>

<button v-bind:disabled="isButtonDisabled">Button</button>
```

#### ディレクティブ

v- から始まる特別な属性をディレクティブというらしい。  
ディレクティブの引数は`:`で受け取る。  
動的な引数も可能

```html
<a v-bind:[attributeName]="url"> ... </a>
```

v-bind と v-on は省略の記法があるらしい。ややこしくないか？

```html
<!-- v-bind 省略記法 -->
<a :href="url"> ... </a>

<!-- v-on 省略記法 -->
<a @click="doSomething"> ... </a>
```

#### 算出プロパティ

computed に書くメソッドを更に便利にしたやつ、get、set みたいのを定義するっぽい。メソッドとは違いキャッシュしてくれる。
算出プロパティはデフォルトでは getter 関数のみですが、必要があれば setter 関数も使えるらしい。

```js
var vm = new Vue({
  el: "#example",
  data: {
    message: "Hello",
  },
  computed: {
    // 算出 getter 関数
    reversedMessage: function () {
      // `this` は vm インスタンスを指します
      return this.message.split("").reverse().join("")
    },
  },
})

// vm.fullName = 'Jahn Doe'とするとsetter関数が呼ばれる
computed: {
  fullName: {
    // getter 関数
    get: function () {
      return this.firstName + ' ' + this.lastName
    },
    // setter 関数
    set: function (newValue) {
      var names = newValue.split(' ')
      this.firstName = names[0]
      this.lastName = names[names.length - 1]
    }
  }
}
// ...
```

#### ウォッチャ

算出プロパティより汎用的。データが変わるのに応じて非同期やコストの高い処理を実行したいときに最も便利らしい。  
ウォッチャオプションだけじゃなく命令的な vm.$watch API ってのもある。

#### クラスとスタイルのバインディング

vue では v-bind がクラスやスタイルと一緒に使われるとき特別な拡張機能がある。いろいろな書き方ができてわかりにくいけど、`v-bind:class=hoge`の hoge 部分は、データプロパティでもオブジェクトでも算出プロパティでも配列でもいいらしい。

```html
/*算出プロパティを渡す例*/
<div v-bind:class="classObject"></div>
```

```js
data: {
  isActive: true,
  error: null
},
computed: {
  classObject: function () {
    return {
      active: this.isActive && !this.error,
      'text-danger': this.error && this.error.type === 'fatal'
    }
  }
}
```

スタイルもほぼ CSS のみたいな見た目で書けるけど、オブジェクトにするのがいいかもね。

#### 条件付きレンダリング

v-if の話。`template`はレンダリングされない要素なので v-if と組み合わせてラッパーとして使える。  
v-if と v-else の組み合わせだと、同じ要素として認識されるから`key`を設定すると別の要素とできる。  
v-show ってのもあるらしい。v-if と v-for と組み合わせて使うのはよくないらしい。

```html
// keyを指定しないとinput内の値は共有される
<template v-if="loginType === 'username'">
  <label>Username</label>
  <input placeholder="Enter your username" key="username-input" />
</template>
<template v-else>
  <label>Email</label>
  <input placeholder="Enter your email address" key="email-input" />
</template>
```

#### リストレンダリング

v-for は配列もオブジェクトも同じ記法でかける。  
ラップされた変更メソッドもたくさんある。push とか splice とか。  
変更メソッドとは別に、新しく配列を返す filter や concat などもある。  
算出プロパティやメソッドで加工してから v-for に入れることもあるらしい。  
v-for が入れ子になってると算出プロパティは使えない（なんで？）のでメソッドを使う。

v-for と v-if だと、v-for が優先順位が高いので、template を使ったり使いかたに注意。

##### is

ul の配下には li しか置けないが、li の代わりに template を置きたいときに使う。

```html
// NG
<table>
  <blog-post-row></blog-post-row>
</table>

// OK
<table>
  <tr is="blog-post-row"></tr>
</table>
```

#### イベントハンドリング
