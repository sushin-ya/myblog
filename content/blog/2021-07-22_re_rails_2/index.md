---
title: Ruby on Rails再入門その２
date: "2021-07-22T20:06:37.121Z"
---

こんにちは。ひさびさに現場 Rails を眺めていると何もわからんくてちょっと焦ってます笑

#### フォーマッタ

いろいろ方法があるみたいで迷ったけど、VSCode 使っているので[この記事](https://sunday-morning.app/posts/2021-05-05-vscode-prettier-ruby)で解決ということにしておきます。

erb も入れないとだめだった。[この記事](https://qiita.com/tomtang/items/624ad37219fe8c1df1bd)参照。

なんかうまく行かないので諦めた。

#### テスト

##### 導入

rspec と factoryBot をインストール

```txt:title=Gemfile
group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
  gem 'rspec-rails'
  gem 'factory_bot_rails'
```

```bash
$ rails g rspec:install
```

```bash
$ rm -r ./test
```

Capybara の導入

```rb:title=spec_helper.rb
  require 'capybara/rspec'

  config.before(:each, type: :system) { driven_by :selenium_chrome_headless }
```

model のバリデーションチェックだけなら capybara 入らないみたい。代わりに下記が必須。

```rb:title=Gemfile
  gem 'rexml', '~> 3.2', '>= 3.2.4'
```

#### RSpec 何もわからん

参考リストをなんとなく流し読みして書いてみる

- [RSpec document](https://relishapp.com/rspec/rspec-expectations/v/3-10/docs)
- [使える RSpec 入門](https://qiita.com/jnchito/items/2e79a1abe7cd8214caa5#%E3%81%82%E3%82%8F%E3%81%9B%E3%81%A6%E8%AA%AD%E3%81%BF%E3%81%9F%E3%81%84)
- [RSpec - 'users validation'のテストコードをレビューしてもらった結果](https://qiita.com/denjneb/items/6c010dec65a4c37da9bd#user%E3%83%A2%E3%83%87%E3%83%AB)

#### 最後に
フロントエンドで内定がでたので、railsはおさらば。  
もしかしたら触れる機会はあるかもしれないけども。

#### 参考

- [VSCode + Prettier で Ruby のコードを自動フォーマットする](https://sunday-morning.app/posts/2021-05-05-vscode-prettier-ruby)

-["Rails"でのフォーマット環境を整える（VScode）](https://qiita.com/tomtang/items/624ad37219fe8c1df1bd)
