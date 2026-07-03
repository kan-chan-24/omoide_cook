# エラーが起きたらスクリプトを中止する
set -o errexit

bundle install

bin/rails assets:clobber

bin/rails tailwindcss:build
bin/rails assets:precompile
bin/rails assets:clean

# ビルド時にデータベースのマイグレーションを実行します
bin/rails db:migrate