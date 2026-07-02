Rails.application.routes.draw do
  get 'sessions/new'
  get 'sessions/create'
  get 'sessions/destroy'
  root 'posts#index' # 投稿一覧をルートページに指定
  resources :posts # postsのCRUDルーティングを生成

  get  'signup', to: 'users#new'    # 登録画面を表示するURL
  post 'signup', to: 'users#create' # 登録データを送信するURL

  get    'login',  to: 'sessions#new'     # ログイン画面を表示（GET /login）
  post   'login',  to: 'sessions#create'  # ログイン処理を実行（POST /login）
  delete 'logout', to: 'sessions#destroy' # ログアウト処理を実行（DELETE /logout）
end
