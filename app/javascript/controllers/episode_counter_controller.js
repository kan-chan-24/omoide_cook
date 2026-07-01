import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
    // _form.html.erbのエピソード入力欄で設定した「ターゲット」を登録
    static targets = ["input", "count", "progressBar"]

    connect() {
        // ページが開かれた瞬間（またはモーダルが開いた瞬間）に、初期状態の文字数を計算する
        this.update()
    }

    // 文字が入力されるたびに何度も実行される関数
    update() {
        const maxLength = 600 // 最大文字数
        const currentLength = this.inputTarget.value.length // 現在入力されている文字数

        // 右下の数字（「0 / 600」の「0」の部分）を現在の文字数に書き換える
        this.countTarget.textContent = currentLength

        // 進捗バーの伸び具合（パーセント）を計算して反映する
        // 例：400文字なら (300 / 600) * 100 = 50%
        const percentage = Math.min((currentLength / maxLength) * 100, 100)
        this.progressBarTarget.style.width = `${percentage}%`

        // 制限文字数を超えたら文字とバーを赤くしてユーザーに警告する
        if (currentLength > maxLength) {
            this.countTarget.classList.add("text-red-600", "font-bold")
            this.progressBarTarget.classList.remove("bg-[#80351d]")
            this.progressBarTarget.classList.add("bg-red-600")
        } else {
            // 制限以内のときは元の優しいカラーに戻す
            this.countTarget.classList.remove("text-red-600", "font-bold")
            this.progressBarTarget.classList.remove("bg-red-600")
            this.progressBarTarget.classList.add("bg-[#80351d]")
        }

    }
}