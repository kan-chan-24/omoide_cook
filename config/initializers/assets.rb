# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = "1.0"

# Add additional assets to the asset load path.
# Rails.application.config.assets.paths << Emoji.images_path

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in the app/assets
# folder are already added.
# Rails.application.config.assets.precompile += %w( admin.js admin.css )

# Railsがアセット（CSS/JS）を探す対象に、javascriptフォルダを追加します
Rails.application.config.assets.paths << Rails.root.join("app", "javascript")

# もし将来的に外部ライブラリを使う場合のために以下も追加しておくと安全です
Rails.application.config.assets.paths << Rails.root.join("node_modules")