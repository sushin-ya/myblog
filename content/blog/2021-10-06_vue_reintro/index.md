---
title: Vue入門その１
date: "2021-10-06T19:06:37.121Z"
---

こんにちは。今回から Vue について Udemy の講座のメモをとっていきます。  
ガッツリ講座をやったら一つなにか作ろうかなとも思っています。業務が忙しくなる前に早く Vue に慣れ親しんでおきたいですね。

#### Core Concept

method の中の this ってよく考えるとおかしいけど、vue が Vue のインスタンス自体のプロパティと、data オブジェクトの中のプロパティをマージしているから使えるようになっているらしい。

v-on のわかりにくいところは、下記の記法がどちらも許可されているところと、暗黙の引数がある場合があること。

```html
<input type="text" v-on:click="add" />
<input type="text" v-on:click="add()" />
<input type="text" v-on:click="add(5)" /> // 5を引数で渡したいなら()を使う
```

```html
<input type="text" v-on:input="setName" />

<input type="text" v-on:input="setName($event)" /> //同じ意味
```

↓ 暗黙の引数

```js
method: {
  setName(event){
    this.name = event.target.value;
  }
}
```

v-model は下記のパターンを簡略化したと考えるとわかりやすい。

```html
<input type="text" v-bind:value="name" v-on:input="setName($event)" />
<input type="text" v-model:name />
```

##### 再実行の弊害

vue からは method が何を更新しているかわからないので、画面内のどこかの値が更新されると、すべての method が再実行される。それは効率が悪いので、算出プロパティを使うといい。  
依存関係のある値が更新されたときだけ実行される関数みたいなもの。

```html
<button v-on:click="add"></button>
/* 上のボタンがクリックされると再実行される */
<p>{{ someOtherMethod() }}</p>

/* 再実行されない。データのように扱うので、()はいらない */
<p>{{ someOtherComputedProperty }}</p>
```

watch は新旧どちらも引数に受けれる。  
 データの更新であれば算出プロパティのほうが簡潔に書けるが http リクエストやローカルストレージなど、データ更新にともなうロジックを追加する場合は、watch のほうがいい。とはいえそんなに使わんかもね。

```js
watch : {
  name(newValue, oldValue) {
    this.name = newValue + oldValue;
  }
}
```

##### スタイリング

スタイリング（クラス）の制御は下記のパターン  
class と:class はマージされる  
:class は`{}`の中に boolean をとる値を仕込んで、クラスを制御できる。  
下の例だと、isActive が true だと active クラスがふよされる

```html
<div class="someClass" :class="{active: isActive}">some text</div>
```

あるいは算出プロパティを使っても実装できる。かしこい？ややこしい？

```html
<div class="someClass" :class="backColor">some text</div>

computed: { backColor() { return {active: isActive} } }
```

こういう事もできる。これが一番よさげ。  
オプションの書き方多すぎると読みにくくない？

```html
<div :class="[someClass, {active: isActive}]"></div>
```

##### List&Key

Key は index じゃないほうがいい。vue はコンポーネントを再利用する際、index で考えるから。  
index 以外のユニークな key にすること。

##### Vue の舞台裏

js の proxy って機能でバインドしたデータを監視しているらしい。データに更新がかかると、それに関連するデータも再計算されるみたいな感じ？

##### ref

input などで ref という vue の属性が使える。this.$ref でアクセス出来る。

#### コンポーネント

コンポーネントの何が嬉しいか。  
例えば、トグルボタンをループで表示していて、ボタンの状態をハンドリングするとき、コンポーネントを使わないとボタンの数だけ data に定義をしないといけない。  
コンポーネントにカプセル化してあげれば、コンポーネントをループで呼び出せば勝手に状態を管理する data は複製される。

##### emits

vue3.x は props みたいに emits ってのをオプションにできるらしい。ひとまず使わんかな

##### provide & inject

これも vue3.x にしかないっぽい。いわば「長距離な props」とのこと。  
値を更新する関数を親コンポーネントで定義して、子に渡せば、react みたいなことが出来る。  
じゃあ react でよくない？

provide で配列を指定していると、配列をオーバーライドしても古い配列を参照したままになることがある。  
配列に対して破壊的な操作をしないと再レンダリングしないらしい。

要素を削除する場合は、filter じゃなくて splice せよということ。  
うんちじゃね。

##### scoped slot

slot で受け取ったデータを渡す方法。slotProps。子から親にデータを渡せちゃうように見える。ニッチな機能。

##### 動的コンポーネント

タブの出し分けとかで便利なやつ

```html
<component v-bind:is="currentTabComponent"></component>
```

タブコンポーネントのインスタンスをキャッシュするには keep-alive

```html
<keep-alive>
  <component v-bind:is="currentTabComponent"></component>
</keep-alive>
```

##### teleport

vue3 の機能（Composition api?）。コンポーネントを DOM の好きな位置に差し込めるっぽい。

#### form

form では click リスナーより v-model のほうが値の更新もできて便利。

##### input/textarea

普通に v-model するだけ。number、trim、lazy とか修飾子が使える

#### select

v-model するだけで value が取れる

#### checkbox / radiobutton （複数のやつ）

v-model は同じだけど、初期値を配列で渡してやる。あと、value を設定してユニークにしないと一つ押すと全部押下したことになっちゃう。単一のチェックボックスは true false

```html
<input type="checkbox" id="jack" value="Jack" v-model="checkedNames" />
<label for="jack">Jack</label>
<input type="checkbox" id="john" value="John" v-model="checkedNames" />
<label for="john">John</label>
<input type="checkbox" id="mike" value="Mike" v-model="checkedNames" />
<label for="mike">Mike</label>
<br />
<span>Checked names: {{ checkedNames }}</span>
```

```js
new Vue({
  el: "...",
  data: {
    checkedNames: [],
  },
})
```

カスタムコンポーネントも v-model でいい感じにかけるらしい。  
でも子の側から$emit するからちょっとめんどい

#### http リクエスト

axios か fetch。

下記の形は this を参照できなくなるので使えない。アロー関数にすること。  
コンテキスト...

```js
// NG
fetch(url).then(function (response) {
  this.result = response.json()
})

// OK
fetch(url).then(response => {
  this.result = response.json()
})
```

##### mounted()

http リクエストを事前に行う場合は、ライフサイクルの mounted を使う。
そもそも URL が間違っている場合は、catch 出来るが、ちゃんとレスポンスが返ってきて、そのステータスコードが 400 や 500 の場合（つまり送ってるデータがおかしい場合）は、ハンドリングして上げる必要がある。

```js
fetch(firebaseUrl, {
  method: POST,
  headers: {
    "Content-Type": "application/json",
  },
  body: {
    name: this.name,
    age: this.age,
  },
  // 本来はJSON形式にしないとだめ
  // body: JSON.stringfy({
  //   name: this.name,
  //   age: this.age,
  // }),
})
  .then(response => {
    if (response.ok) {
      //...処理
    } else {
      throw new Error("Could not save data!") // fetchはこれがないとcatchされない axiosはされる？
    }
  })
  .catch(error => {
    console.log(error)
  })
```

#### routing

Nuxt でカバーされる範囲だけど一応やっとく。vue-router というやつ。  
登録して、`to`キーワードで遷移先を指定すればいいらしい。  
active なんとかってクラスが付与されるからオーバーライドすれば、スタイルもつけられる。

method の中で扱うには、`this.$router.push()`みたいにする。

##### 動的ルーティング

created はコンポーネントが生成されたときに実行される。  
つまり、動的ページが生成されたときに使える。

`this.$route.path`っていう引数で、情報を引っ張れる。  
あるいは、`this.$route.params.id`

動的ページを created で情報を作成するとキャッシュされて、ルーティングが変わっても変更されないことがある。
そういうときは watch で変更をキャッチすること。

```js
watch:{
  $route(newRoute){
    /* 処理 */
  }
}
```

$route を使いたくない場合は props を使う。その場合は router 設定時に props:true とすること。

beforeEach とか afterEach というナビゲーションガード機能がある。なんかよくわからんけどめんどくさそう。
beforeRouteEnter ってやつは、ページ遷移する直前に「情報をクリアするけどいい？」みたいに聞くタイミングで使えるみたい。unmounted()だと、すでに情報がクリアされたあとなので、処理的に無理なことが出来る。

#### Transition と Animation

要素が消えるときってアニメーションが適応できない。そういうときは Vue の transition 機能を使う。

v-enter とかその他の特殊なクラスが組み込んであって、そいつらを使えばかんたんに実装できる。
transition の name プロパティを設定すれば接頭が`v-`ではなく`hoge-`に出来る。
さらに`enter-to-class`などでそもそものクラス名も指定できる。

transition はコンポーネントをひとつしか引き受けできないが、v-if と v-else の組み合わせの場合は、複数でも大丈夫。

イベントの`before-enter`とかそういうのを使うと、関数の引数に element が取れるので、直接スタイルできたりもする。

```js
// vanilla
beforeEnter(el,done){
  el.style.opacity(0)

  done() // vueにアニメーションの設定画完了したことを通知。
}
```

#### vuex

- state: ステート
- mutation: 値の更新
- getters: 値の呼び出し（getter から getter を呼び出すこともある）
- action: mutaition のラッパーで非同期処理が書ける

##### mapGetters / mapActions

呼び出しのラッパー。methods にマージできる

```js
methods: {
  ...mapGetters(['foo'])
  ...mapActions(['bar'])
}
```

##### rootState / rootGetter

ストアを分割すると、分割した内部の state にしかアクセスできないので、rootState とかを使う必要がある
namespace を使う場合は、`this.$store.getters['namespace/method']`ってスラッシュを使ったかなりキモい書き方をする。

#### 最後に

基本はここまでで終わり。コースのメインプロジェクトをやって、もう少しで終わりだ。
