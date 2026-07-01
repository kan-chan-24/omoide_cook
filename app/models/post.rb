class Post < ApplicationRecord
  belongs_to :user, optional: true  # ← optional: true を追加（ログイン実装時に外す）

  # Active StorageとPostモデルを紐付け
  has_one_attached :image

  # 配列を JSON 形式で保存
  serialize :ingredients, type: Array, coder: JSON
  serialize :steps, type: Array, coder: JSON

  # 料理名：空欄NG 外部キー（user）：空欄NG いつ頃：空欄NG エピソード：空欄NG：文字数制限
  MAX_EPISODE_LENGTH = 400
  validates :title, presence: true, length: { maximum: 20 }
  validates :user_id, presence: true
  validates :when, presence: true, length: { maximum: 20 }
  validates :episode, presence: true, length: { maximum: MAX_EPISODE_LENGTH }

  # 配列の要素ごとの文字数制限（カスタムバリデーション）
  validate :validate_ingredients_element_length
  validate :validate_steps_element_length

  private

  # ingredients の各要素の文字数が制限内かチェック
  def validate_ingredients_element_length
    return if ingredients.blank? # 仮に空でもエラーが出ないように対策

    ingredients.each do |ingredient|
      if ingredient.to_s.length > 30 # 配列に文字列以外があっても安全にカウントできるように変換
        errors.add(:ingredients, "各項目は30文字以内で入力してください")
        break # エラーは1つ出れば十分なのでループを抜ける
      end
    end
  end

  # steps の各要素の文字数が制限内かチェック
  def validate_steps_element_length
    return if steps.blank?

    steps.each do |step|
      if step.to_s.length > 100
        errors.add(:steps, "各項目は100文字以内で入力してください")
        break
      end
    end
  end
end
