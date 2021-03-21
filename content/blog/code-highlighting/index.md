---
title: コードのハイライト
date: "2021-03-21T01:12:03.284Z"
---

シンタックスハイライトは導入したけど、  
コードのハイライトのやり方がわからなかったので確認しました。

markdown の記法だと、`バッククオート`で挟めば良いとのこと。  
デザインが気に入らなかったので、style.css を少し修正しました。

```css:title=style.css（追記）
code[class="language-text"] {
  color: #232323 !important;
  background-color: var(--color-accent) !important;
}
```
