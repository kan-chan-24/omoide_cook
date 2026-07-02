class SessionsController < ApplicationController
  def new
    # ログイン画面を表示
  end

  def create
    # フォームから送られてきた「お名前」でユーザーを検索
    user = User.find_by(name: params[:session][:name])

    # ユーザーが見つかり、かつパスワードが一致しているか（authenticateメソッド）をチェック
    if user && user.authenticate(params[:session][:password])
      # 認証成功時：ブラウザのセッションにユーザーIDを記憶させる（ログイン状態にする）
      session[:user_id] = user.id
      redirect_to root_path, notice: "ログインしました！"
    else
      # 認証失敗時：エラーメッセージを表示してログイン画面を再表示
      flash.now[:alert] = "お名前、またはパスワードが正しくありません。"
      render :new, status: :unprocessable_entity
    end
  end

  def destroy
    # ブラウザのセッションからユーザーIDを消去する（ログアウト状態にする）
    session[:user_id] = nil
    redirect_to root_path, notice: "ログアウトしました。"
  end
end
