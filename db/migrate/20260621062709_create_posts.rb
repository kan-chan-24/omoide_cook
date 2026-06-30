class CreatePosts < ActiveRecord::Migration[7.1]
  def change
    create_table :posts do |t|
      t.references :user, foreign_key: true # null: false を一時的に削除（ログイン処理実装時に復活）
      t.string :title, null: false # タイトル（料理名）
      t.string :image
      t.string :when, null: false # いつ頃の話か
      t.text :episode, null: false # エピソード
      t.text :ingredients # 食材
      t.text :steps # レシピの工程

      t.timestamps
    end
  end
end
