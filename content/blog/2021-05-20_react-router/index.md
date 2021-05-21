---
title: React Router入門
date: "2021-05-20T23:38:37.121Z"
---

こんにちは。  
Formik と CRUD 処理を復習する予定でしたが、作成しているアプリの都合上、  
先に React Router を扱うことにします。

#### React Router

複雑な spa を作成する上でルーティングは必須ですが、React Router はその代表的なものです。  
主要なコンポーネントは下記の３種類です。

- `<BrowserRouter>` or `<HashRouter>`: 全体をラップする中核のコンポーネント。動的か静的かで使い分けます
- `<Route>` and `<Switch>`: ルーティング設定をするコンポーネント
- `<Link>`, `<NavLink>`, and `<Redirect>` : ナビゲーションのコンポーネント

##### history objects

history という言葉は、いくつかの用語を指し示しますが、  
とりわけ history objects は現在の位置や履歴を追跡するために利用できます。  
push メソッドや replace メソッドなどで、進んだり戻ったりする操作が可能です。  
詳しくは、[公式](https://reactrouter.com/web/api/history)で。

#### Material UI との組み合わせ

Material UI に組み合わせる場合は、`component`としてわたせばうまくいきます。

```js{8}:title=example
import React from 'react';
import { MemoryRouter as Router } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import Button from '@material-ui/core/Button';

<Router>
  <div>
    <Button color="primary" component={RouterLink} to="/">
      With prop forwarding
    </Button>
  </div>
</Router>
```

あるいは、history を使って処理を書くことも出来ます。

```js
<Button color="primary" onClick={() => history.push("/")}>
  With prop forwarding
</Button>
```

#### トップ画面だけナビゲーションを出したくない場合

トップ画面だけナビゲーションを出したくない場合は、ちょっとテクニックが必要です。
3 行目で、正規表現によって、ルート以外すべてを指定し、`render`メソッドで設定します。

```js{3}:title=example
<Route exact path='/' component={HomePage} />
      <Route
        path={'/(.+)'}
        render={() => (
          <>
            <NavBar />
            <Container maxWidth='lg' className={classes.container}>
              <Route exact path='/films' component={FilmsDashboard} />
            </Container>
          </>
        )}
```

#### useHistory

React Router が提供する Hooks で、history インスタンスを取得できます。  
クリックされた際の処理の部分は自分で実装する必要があります。

```js:title=useHistory
import { useHistory } from "react-router-dom";

function HomeButton() {
  let history = useHistory();

  function handleClick() {
    history.push("/home");
  }

  return (
    <button type="button" onClick={handleClick}>
      Go home
    </button>
  );
}
```

#### 動的なルーティング

ユーザ ID ごとにページを振り分ける場合についてです。

```js
<Route path="/:id" children={<Child />} />
```

```js
<Link to={`/:${id}`} />
```

#### 最後に

React Router はよく使うのですが、毎回なんだっけ？となりがちなので、  
今回よく使うものをまとめておきました。徐々に形になってきましたね。  
次回は Redux です。

![output](./output.gif)

#### 参考

- [REACT ROUTER](https://reactrouter.com/web/guides/quick-start)
- [REACT ROUTER - history](https://reactrouter.com/web/api/history)
- [Routing libraries](https://material-ui.com/guides/composition/#link)
