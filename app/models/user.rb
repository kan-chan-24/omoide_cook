class User < ApplicationRecord
  # パスワードのハッシュ化（bcryptを使用）
  has_secure_password
  has_secure_password :recovery_password, validations: false

  # 保存する前にメールアドレスをすべて自動で小文字に変換する
  before_save { email.downcase! if email.present? }

  # Postとの関連付け
  has_many :posts, dependent: :destroy

  # 名前：空欄NG メールアドレス：一意かつ空欄NG
  validates :name, presence: true

  # メールアドレス：一意かつ空欄NG ＋ 正しいメール形式のバリデーション
  # format を追加することで、不正なアドレスの登録を防ぐ
  validates :email, uniqueness: { case_sensitive: false }, 
                    format: { with: URI::MailTo::EMAIL_REGEXP },
                    allow_blank: true # 👈 空白（無し）を許容する魔法の一行
  
  # パスワードの文字数制限（新規登録時や変更時のみチェックする設定）
  # allow_nil: true をつけておくことで、プロフィールの名前だけを変更したい時などに
  # 「パスワードが空ですよ」と怒られるバグを防ぐ
  validates :password, presence: true, length: { minimum: 6 }, allow_nil: true
end
