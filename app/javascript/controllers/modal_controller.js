// Stimulusの仕組みをライブラリからダウンロード
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
    // HTML側のdata-modal-target="..."とJavaScriptを繋ぐための指定
    static targets = ["container", "backdrop", "content"]

    connect() {
        // 初期状態では非表示
        this.containerTarget.style.display = "none"
    }

    open() {
        // モーダルの外枠を表示、背景ページをスクロールさせない
        this.containerTarget.style.display = "block"
        document.body.style.overflow = "hidden"
    }

    close() {
        // モーダルの外枠を非表示、背景ページのスクロールを元通りに
        this.containerTarget.style.display = "none"
        document.body.style.overflow = "auto"
    }
}