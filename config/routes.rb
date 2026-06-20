Rails.application.routes.draw do
  root 'posts#index' # 投稿一覧をルートページに指定
  resources :posts # postsのCRUDルーティングを生成
end
