import { Controller } from "@hotwired/stimulus"

// 画面上部に浮かぶフラッシュメッセージを、ふわっと表示してから自動で消す
export default class extends Controller {
    // 外部（HTMLのデータ属性）から表示時間をカスタマイズできるように設定
    // デフォルトは3000ミリ秒（3秒）
    static values = { duration: { type: Number, default: 3000 } }

    // 初期化処理
    connect() {
        // 描画直後は opacity-0 -translate-y-4（透明・少し上）の状態にしてあるので、
        // 画面への配置が完了した直後のフレームでクラスを操作
        requestAnimationFrame(() => {
            // 初期状態の透明化とズレのクラスを削除することで、
            // CSSの transition（スタイル変化の補間）が働き、なめらかに表示される
            this.element.classList.remove("opacity-0", "-translate-x-4")
        })

        // durationValue`（3秒）が経過したタイミングで、自動的に非表示にする関数 `dismiss()` を呼び出し
        // 画面遷移などで要素が消えた際にタイマーを解除できるよう、`this.timeout` にIDを保存
        this.timeout = setTimeout(() => this.dismiss(), this.durationValue)
    }

    // メッセージをフェードアウトさせ、最終的にDOM（HTML構造）から完全に削除
    dismiss() {
        // 表示時とは逆に、透明化と位置移動のクラスを再び付与
        // これにより、上に向かって消えていくアニメーションが始まる
        this.element.classList.add("opacity-0", "-translate-x-4")

        // クラス変化によるCSS transition（フェードアウト）が完全に終わるのを監視
        // アニメーションが終わったタイミングで、HTML要素そのものを画面から削除
        this.element.addEventListener("transitionend", () => this.element.remove(), { once: true })
    }

    // メッセージが自動消去される前に、ユーザーが手動で画面遷移した際などに実行
    disconnect() {
        // まだ実行されていない非表示タイマー（setTimeout）をクリア
        // これにより、要素が存在しないのに裏で関数が実行されてしまうエラーを防ぐ
        clearTimeout(this.timeout)
    }
}