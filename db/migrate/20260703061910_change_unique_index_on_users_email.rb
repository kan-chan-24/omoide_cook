class ChangeUniqueIndexOnUsersEmail < ActiveRecord::Migration[7.1]
  def change
    if index_exists?(:users, :email, unique: true)
      remove_index :users, :email, unique: true
    end

    add_index :users, :email, unique: true, where: "email IS NOT NULL AND email != ''"
  end
end
