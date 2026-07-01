// Stimulusの仕組みをライブラリからダウンロード
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
    static targets = ["container", "backdrop", "content"]

    connect() {
        // 初期状態では非表示
        console.log("=== Modal Controller Connect ===")
        console.log("Controller:", this)
        console.log("================================")
        this.containerTarget.style.display = "none"
    }

    open() {
        // モーダルの外枠を表示、背景ページをスクロールさせない
        console.log("=== open() メソッド呼び出し ===")
        console.log("containerTarget:", this.containerTarget)
        console.log("================================")
        this.containerTarget.style.display = "block"
        document.body.style.overflow = "hidden"
    }

    close() {
        // モーダルの外枠を非表示、背景ページのスクロールを元通りに
        console.log("=== close() メソッド呼び出し ===")
        this.containerTarget.style.display = "none"
        document.body.style.overflow = "auto"
    }
}