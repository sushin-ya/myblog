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
