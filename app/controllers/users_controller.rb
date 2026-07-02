class UsersController < ApplicationController
  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)
    
    if @user.save
      # 登録が成功したら、そのまま自動でログイン状態にする
      # ブラウザの「秘密の鍵（セッション）」に、今作ったユーザーのIDを記憶させる
      session[:user_id] = @user.id
      
      # フラッシュメッセージ（通知）を添えて、トップページ（一覧）へ案内します
      redirect_to root_path, notice: "アカウントの登録が完了しました。"
    else
      # 入力エラー（名前が空欄、パスワードが短いなど）があれば、登録画面を再表示
      # status: :unprocessable_entity を付けることで、Turboがエラーを正しく認識して画面を戻せる
      render :new, status: :unprocessable_entity
    end
  end

  private

  def user_params
    # 通常通り許可を出す
    permitted = params.require(:user).permit(:name, :email, :password, :password_confirmation)
    
    # DBの null: false 制約でエラーになるのを防ぐため、
    # メールアドレスが空っぽで届いた場合は、空文字 "" をセットしてデータベースへ送る
    permitted[:email] ||= ""
    
    permitted
  end
end