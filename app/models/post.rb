class Post < ApplicationRecord
  belongs_to :user

  # 料理名：空欄NG 外部キー（user）：空欄NG いつ頃：空欄NG エピソード：空欄NG
  validates :title, presence: true
  validates :user_id, presence: true
  validates :when, presence: true
  validates :episode, presence: true
end
