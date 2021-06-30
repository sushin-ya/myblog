---
title: VScodeでC++フォーマッタ
date: "2021-07-01T01:44:37.121Z"
---

こんにちは。今回は小さい備忘録です。  
なぜか VScode のフォーマットの設定がぶっ飛んで、C++がうまくフォーマットできなくなりました。
具体的には、カッコが改行されるようになった。個人的にかなり気持ち悪い。

```c
int main(void)
{
  int N;
  cin >> N;
  vector<vector<int>> h(N + 2, vector<int>(N + 2));
  vector<int> ans;
```

prettier はなぜかエラーを吐いて整形してくれないので、
VScode であれば、Clang-Format をインストールして、cpp だけ個別に設定すればうまくいくようになりました。

```json:title=setting.json
"editor.defaultFormatter": "esbenp.prettier-vscode",
"[cpp]": {
    "editor.defaultFormatter": "xaver.clang-format",
    "editor.wordBasedSuggestions": false,
    "editor.suggest.insertMode": "replace",
    "editor.semanticHighlighting.enabled": true
  }
```

```c
int main(void) {
  int N;
  cin >> N;
  vector<vector<int>> h(N + 2, vector<int>(N + 2));
  vector<int> ans;
```

clang-format を brew で入れろとか`"C_Cpp.clang_format_style": "{BasedOnStyle: Google, IndentWidth: 4}"`を書けばいいとかはうまくいかなかったけど、上記の方法で普通に出来た。
