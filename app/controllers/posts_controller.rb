class PostsController < ApplicationController
  def index
    # 投稿一覧用：全てのpostsを取得
    @posts = Post.includes(:user).order(created_at: :desc)
  end

  def new
    @post = Post.new
  end

  def create
    # フォームから送られてきたデータを取得
    @post = Post.new(post_params)
    @post.user_id = User.first.id  # 仮のユーザーID（ログイン処理実装時にcurrent_userに変更）

    # -- バリデーションOK --
    if @post.save
      # どういう形式でブラウザから通信が送られてきたかを確認
      respond_to do |format|
        # Turbo（非同期）の場合
        format.turbo_stream do
          # id="posts"（投稿の配列）の先頭に、今作った新しい投稿（@post）のカードを追加（prepend）する
          # モーダルのpost_formの中身を新しく作り直した空のフォーム（Post.new）で上書き（update）してリセットする
          render turbo_stream: [
            turbo_stream.prepend("posts", partial: "posts/post", locals: { post: @post }),
            turbo_stream.update("post_form", partial: "posts/form", locals: { post: Post.new }),

            # 保存成功時のみ、post_form_controller.jsの closeModal を実行してモーダルを閉じる
            turbo_stream.action(:close_modal, "[data-controller='post-form']")
          ]
        end
        # 通常のページ遷移を伴う通信がきた場合、ページ全体をリダイレクトする（保険的な措置）
        format.html { redirect_to posts_path }
      end
    # -- バリデーションNG --  
    else
      respond_to do |format|
        # Turbo（非同期）の場合
        format.turbo_stream do
          render turbo_stream: turbo_stream.update("post_form", partial: "posts/form", locals: { post: @post })
        end
        # 通常のページ遷移を伴う通信がきた場合は、render処理で画面を繰り返す）
        format.html { render :index }
      end
    end
  end

  def show
    @post = Post.find(params[:id])
  end

  def destroy
    @post = Post.find(params[:id])
    @post.destroy

    # Turboのリクエストに対して、命令を返す
    respond_to do |format|
      format.turbo_stream {
        render turbo_stream: [
          # ① 一覧画面（DOM）から、削除された投稿のカードを消し去る
          turbo_stream.remove(@post),
          # ② JavaScript側へ「モーダルを閉じてね」というカスタムイベントを通知
          turbo_stream.action(:close_modal_for_destroy, "")
        ]
      }
      # 万が一Turboが動かなかったときのフォールバック（保険）
      format.html { redirect_to root_path, notice: "削除しました" }
    end
  end

  private

  def post_params
    params.require(:post).permit(:title, :when, :episode, :image, ingredients: [], steps: [])
  end
end
