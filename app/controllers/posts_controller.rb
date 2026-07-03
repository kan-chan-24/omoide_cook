class PostsController < ApplicationController
  # 特定のアクションが実行される前に、自作のガード用メソッドを自動で発火
  before_action :require_login, only: [:new, :create, :edit, :update, :destroy]
  before_action :correct_user, only: [:edit, :update, :destroy]

  def index
    # 投稿一覧用：全てのpostsを取得
    @posts = Post.includes(:user).order(created_at: :desc)
  end

  def new
    # ログインしていれば、そのユーザーに紐付いた空の投稿データを作成（アソシエーション活用）
    if logged_in?
      @post = current_user.posts.build
    else
      @post = Post.new
    end
  end

  def create
    # 現在ログインしているユーザー（current_user）に紐付いた投稿データを新しく作成
    @post = current_user.posts.build(post_params)

    # -- バリデーションOK --
    if @post.save
      # どういう形式でブラウザから通信が送られてきたかを確認
      respond_to do |format|
        # Turbo（非同期）の場合
        format.turbo_stream do
          # id="posts"（投稿の配列）の先頭に、今作った新しい投稿（@post）のカードを追加（prepend）する
          # モーダルのpost_formの中身を新しく作り直した空のフォーム（Post.new）で上書き（update）してリセットする
          new_empty_post = logged_in? ? current_user.posts.build : Post.new
          
          render turbo_stream: [
            turbo_stream.prepend("posts", partial: "posts/post", locals: { post: @post }),
            turbo_stream.update("post_form", partial: "posts/form", locals: { post: new_empty_post }),

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
          render turbo_stream: turbo_stream.update("post_form", template: "posts/new")
        end
        # 通常のページ遷移を伴う通信がきた場合は、render処理で画面を繰り返す）
        format.html { render :index }
      end
    end
  end

  def show
    @post = Post.find(params[:id])
  end

  def edit
    @post = Post.find(params[:id])
  end

  def update
    @post = Post.find(params[:id])

    # 通信の種類（TurboかHTMLか）をRailsに判断させる
    respond_to do |format|
      if @post.update(post_params)
        format.turbo_stream {
          render turbo_stream: [
            # 詳細モーダルの中身を、新しく更新された「show」のHTMLで丸ごと上書き（置換）する
            turbo_stream.replace("modal_content", template: "posts/show", locals: { post: @post }),
            # 一覧画面のカードも最新の内容にパッと置き換える（dom_idで正確に狙い撃ち）
            turbo_stream.replace(helpers.dom_id(@post), partial: "posts/post", locals: { post: @post })
          ]
        }
        # 本番環境のTurboのために、リダイレクトには status: :see_other を付ける
        format.html { redirect_to root_path, notice: "更新しました", status: :see_other }
      else
        # バリデーションエラーが起きた場合は、こちらで unprocessable_entity を返す
        format.html { render :edit, status: :unprocessable_entity }
      end
    end
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

  # 未ログインのユーザーをログイン画面（またはトップ）へ強制送還
  def require_login
    unless logged_in?
      # フラッシュメッセージで警告を添えて、ログイン画面へリダイレクトします
      redirect_to login_path, alert: "その操作を行うにはログインが必要です。"
    end
  end

  # 他人の投稿を勝手に編集・削除しようとする人をトップページへ強制送還
  def correct_user
    @post = Post.find(params[:id])
    # 投稿の作成者IDと、今ログインしている人のIDが一致しない場合
    if @post.user_id != current_user.id
      # 警告を添えて、トップページへ押し戻します
      redirect_to root_path, alert: "自分以外の投稿を編集・削除することはできません。"
    end
  end

  def post_params
    params.require(:post).permit(:title, :when, :episode, :image, ingredients: [], steps: [])
  end
end
