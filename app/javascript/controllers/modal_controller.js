// Stimulusの仕組みをライブラリからダウンロード
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
    // HTML側のdata-modal-target="..."とJavaScriptを繋ぐための指定
    static targets = ["container", "backdrop", "content"]

    connect() {
        // 初期状態では非表示
        console.log("Modal controller connected!")  // ← 追加
        console.log("containerTarget:", this.containerTarget)  // ← 追加
        console.log("backdropTarget:", this.backdropTarget)    // ← 追加
        console.log("contentTarget:", this.contentTarget)      // ← 追加

        this.containerTarget.style.display = "none"
    }

    open() {
        // モーダルの外枠を表示、背景ページをスクロールさせない
        console.log("open() メソッドが呼ばれました!")  // ← 追加
        this.containerTarget.style.display = "block"
        document.body.style.overflow = "hidden"
    }

    close() {
        // モーダルの外枠を非表示、背景ページのスクロールを元通りに
        console.log("close() メソッドが呼ばれました!")  // ← 追加
        this.containerTarget.style.display = "none"
        document.body.style.overflow = "auto"
    }
}