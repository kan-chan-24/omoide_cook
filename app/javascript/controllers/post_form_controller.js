import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
    // HTML側と紐付ける要素（ターゲット）の定義
    static targets = [
        "episodeTab", "recipeTab",
        "episodeContent", "recipeContent",
        "backBtn", "submitBtn",
        "ingredientsContainer", "stepsContainer"
    ]

    connect() {
        // ページを読み込んだ初期状態は「エピソード」を表示する
        this.showEpisode()
    }

    // ==========================================
    // 1.タブ切り替えの処理（指示ごとに関数化）
    // ==========================================
    // エピソードタブを表示する指示
    showEpisode() {
        // コンテンツの表示・非表示
        this.episodeContentTarget.classList.remove("hidden")
        this.recipeContentTarget.classList.add("hidden")
        this.backBtnTarget.classList.add("hidden")
        this.submitBtnTarget.textContent = "次へ →"

        // タブボタンの見た目（エピソードをアクティブ、レシピを非アクティブに）
        this._setTabActive(this.episodeTabTarget, true)
        this._setTabActive(this.recipeTabTarget, false)
    }

    // レシピタブを表示する指示
    showRecipe() {
        // コンテンツの表示・非表示
        this.episodeContentTarget.classList.add("hidden")
        this.recipeContentTarget.classList.remove("hidden")
        this.backBtnTarget.classList.remove("hidden")
        this.submitBtnTarget.textContent = "投稿する"

        // タブボタンの見た目（エピソードを非アクティブ、レシピをアクティブに）
        this._setTabActive(this.episodeTabTarget, false)
        this._setTabActive(this.recipeTabTarget, true)
    }

    // 下部のアクションボタン（次へ / 投稿する）が押された時の指示
    handleNext(event) {
        // エピソード画面にいる時は、サーバーに送信せずレシピ画面へ進む
        if (!this.episodeContentTarget.classList.contains("hidden")) {
            event.preventDefault() // 送信をキャンセル
            this.showRecipe()
        }
        // レシピ画面にいる時は通常通りsubmit（送信）される
    }

    // ==========================================
    // 3.内部パーツ（再利用する共通処理）
    // ==========================================
    // タブボタンの色や枠線を切り替える内部パーツ
    _setTabActive(tabElement, isActive) {
        const circle = tabElement.querySelector("span")
        if (isActive) {
            tabElement.className = "w-1/2 py-3 text-center bg-[#80351d] text-white font-medium text-sm flex items-center justify-center gap-1 rounded-t-sm border-none cursor-pointer"
            if (circle) circle.className = "inline-block w-5 h-5 rounded-full border border-white text-xs flex items-center justify-center"
        } else {
            tabElement.className = "w-1/2 py-3 text-center text-[#8e7e75] font-medium text-sm flex items-center justify-center gap-1 border-none cursor-pointer"
            if (circle) circle.className = "inline-block w-5 h-5 rounded-full border border-[#8e7e75] text-xs flex items-center justify-center"
        }
    }
}