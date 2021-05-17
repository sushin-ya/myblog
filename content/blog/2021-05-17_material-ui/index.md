---
title: Material UI入門 - themeの変更
date: "2021-05-17T17:55:37.121Z"
---

こんにちは。  
[今回作るサイト](/2021-05-16_squeezefilm_mock/)は Material UI を採用しようとしているので、そのメモを書いていこうと思います。  
いまま使ったことがあるのは、Bootstrap と Semantic UI です。  
Material UI はちょっと癖があるとのことなので、頑張りましょう。

#### 導入

[公式](https://material-ui.com/ja/getting-started/installation/)まんまなので割愛。  
日本語版ちょっとバグってる。。。

#### 学び

学びのとこで紹介されていた[この講座](https://www.youtube.com/watch?v=pHclLuRolzE&list=PLQg6GaokU5CwiVmsZ0d_9Zsg_DnIP_xwr)を中心に見ていこうと思います。

#### theme の変更

[デフォルトテーマ](https://material-ui.com/customization/default-theme/#default-theme)はリンク先のような値が設定されています。Material UI はテーマカラーで Primary と Secondary を決めて、それを全体で使うような感じなので、カラーの設定は必須かと思われます。

##### createMuiTheme

`createMuiTheme`という関数を利用することで、デフォルトテーマを設定できます。  
下記では、カラーパレットとフォントを設定しています。

```js:title=theme.js
import { createMuiTheme } from '@material-ui/core/styles';
import orange from '@material-ui/core/colors/orange';
import cyan from '@material-ui/core/colors/cyan';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: orange[500],
    },
    secondary: {
      main: cyan[500],
    },
  },
  typography: {
    fontFamily: "'Roboto','Noto Sans JP','Helvetica', 'Arial', sans-serif",
  },
});

export default theme;

```

##### ThemeProvider

ThemeProvider コンポーネントで index.js の App をラップしてあげることで、theme を適用できます。

```js:title=index.js
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './app/config/theme';

function render() {
  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>,
    rootEl
  );
}
```

#### スタイルの上書き

スタイルの上書きもかんたん。  
makeStyles という Hooks を使います。

```js:title=App.js
import './style.css';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    backgroundColor: 'red',
    color: (props) => props.color,
  },
});

function App() {
  const classes = useStyles();
  return (
    <div className='App'>
      <Typography color='primary' className={classes.root}>
        test
      </Typography>
      <Typography color='primary'>テストざむらい</Typography>
    </div>
  );
}

export default App;
```

#### 最後に

Material UI だと、css ファイルいらないのかな。  
動画の続きを見つつ、コンポーネントの実装してきたいです。

#### 参考

- [React + Material UI #1: Introduction - 2020 Edition](https://www.youtube.com/watch?v=pHclLuRolzE&list=PLQg6GaokU5CwiVmsZ0d_9Zsg_DnIP_xwr).
