class User < ApplicationRecord
  # パスワードのハッシュ化（bcryptを使用）
  has_secure_password
  has_secure_password :recovery_password, validations: false

  # Postとの関連付け
  has_many :posts, dependent: :destroy

  # 名前：空欄NG メールアドレス：一意かつ空欄NG
  validates :name, presence: true
  validates :email, presence: true, uniqueness: true
end
