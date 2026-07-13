module PostsHelper
  # 投稿画像を環境に応じて適切な方法で表示するヘルパー
  # transform: Cloudinary変換専用オプション（開発環境では無視される）
  # html_options: class などの通常のHTML属性（両環境で共通して使われる）
  def post_image_tag(image, transform: {}, **html_options)
    # 画像が添付されていなければ何も返さない（呼び出し側でプレースホルダーに分岐させる）
    return unless image.attached?

    # config.active_storage.service の値で「今どの保存先を使っているか」を判定
    if Rails.application.config.active_storage.service == :cloudinary
      # 本番: Cloudinary側で形式変換・画質最適化・リサイズをして配信
      #   fetch_format: :auto → HEICなどもブラウザが表示できる形式に自動変換
      #   quality: :auto      → 画質を自動最適化して転送量を削減
      cl_image_tag image.key, fetch_format: :auto, quality: :auto, **transform, **html_options
    else
      # 開発・テスト環境: ローカルディスク保存の画像をそのまま表示
      #   cl_image_tag はここでは使えない（Cloudinaryのcloud_name設定が存在しないため）
      image_tag image, **html_options
    end
  end
end
