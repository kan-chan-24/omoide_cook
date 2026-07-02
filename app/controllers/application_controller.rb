class ApplicationController < ActionController::Base
  # ビュー（html.erb）側でも current_user と logged_in? メソッドを使えるようにする設定
  helper_method :current_user, :logged_in?

  private

  # 現在ログインしているユーザーを返す（いなければnilを返す）
  def current_user
    # ||= は「まだデータがなければ、右側の処理（DB検索）を実行して代入する」という高速化の定番技
    @current_user ||= User.find_by(id: session[:user_id]) if session[:user_id]
  end

  # ログインしているかどうかを true / false で返す
  def logged_in?
    current_user.present?
  end
end
