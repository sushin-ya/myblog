---
title: gifアニメーションの作り方
date: "2021-04-07T16:35:37.121Z"
---

こんにちは。  
ブログに gif を貼ると見栄えもするしわかりやすいのですが、  
意外と gif をどうやって作ればいいのかまとまっていなかったので、メモしておきます。  
(以前は Chrome の胡散臭いアプリを使っていたのですが、自由度が低かったのでやめました)

##### mac でキャプチャする

`ctrl＋shift＋5`で録画。mov ファイルが作成される。

##### ffmpeg を使って、mov→gif に変換

```bash
ffmpeg -i <input movie file>.mov -r <frame rate> <output filename:>.gif
```

gif って意外とファイルサイズ大きくて、二桁 MB くらいになってしまいます。  
容量をどうにか抑えられないかな。gatsby の最適化ライブラリとか試してみますか。

#### 参考

[.mov を animated gif に変換する](https://qiita.com/janus_wel/items/5841502df901d8e51280).
