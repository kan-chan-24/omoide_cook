// Stimulusの仕組みをライブラリからダウンロード
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
    static targets = ["container", "backdrop", "content"]

    connect() {
        // 初期状態では非表示
        console.log("=== Modal Controller Connect ===")
        this.containerTarget.style.display = "none"
    }

    // ヘッダーの「＋ 書く」ボタンから呼ばれるメソッド
    openNew() {
        console.log("=== 新規投稿フォームを開きます ===")
        // 新規の部屋を見せて、詳細の部屋を隠す
        document.getElementById("new-post-room").classList.remove("hidden")
        document.getElementById("show-post-room").classList.add("hidden")

        this.open()
    }

    // 投稿一覧のカード（または詳細のロード完了）から呼ばれるメソッド
    openShow() {
        console.log("=== 投稿詳細画面を開きます ===")
        // 新規の部屋を隠して、詳細の部屋を見せる
        document.getElementById("new-post-room").classList.add("hidden")
        document.getElementById("show-post-room").classList.remove("hidden")

        this.open()
    }

    // 共通の開く処理
    open() {
        // モーダルの外枠を表示、背景ページをスクロールさせない
        console.log("=== open() メソッド呼び出し ===")
        this.containerTarget.style.display = "block"
        document.body.style.overflow = "hidden"
    }

    close() {
        // モーダルの外枠を非表示、背景ページのスクロールを元通りに
        console.log("=== close() メソッド呼び出し ===")
        this.containerTarget.style.display = "none"
        document.body.style.overflow = "auto"

        // 詳細画面用の部屋だけを、次のチラつき防止のために綺麗にクリアします
        // 新規投稿の部屋（#post_form）は、文字が消えないように一切触らず放置
        const showFrame = document.querySelector("#show-post-room turbo-frame")
        if (showFrame) {
            showFrame.src = null
            showFrame.innerHTML = ""
        }
    }
}