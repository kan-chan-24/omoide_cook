class Post < ApplicationRecord
  belongs_to :user, optional: true  # ← optional: true を追加（ログイン実装時に外す）

  # Active StorageとPostモデルを紐付け
  has_one_attached :image

  # 配列を JSON 形式で保存
  serialize :ingredients, type: Array, coder: JSON
  serialize :steps, type: Array, coder: JSON

  # 料理名：空欄NG 外部キー（user）：空欄NG いつ頃：空欄NG エピソード：空欄NG
  validates :title, presence: true
  validates :user_id, presence: true
  validates :when, presence: true
  validates :episode, presence: true
end
