import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
    // 親の modal コントローラーを outlet として登録する（これでmodal_controller.jsの関数も使える）
    static outlets = ["modal"]

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
        this.submitBtnTarget.value = "次へ →"

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
        this.submitBtnTarget.value = "投稿する"

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
        else {
            // modal の close メソッドを呼び出す
            if (this.hasModalOutlet) { // 念のため存在チェック
                this.modalOutlet.close()
            }
        }
    }

    // ==========================================
    // 2.材料と作り方の動的追加・削除の処理
    // ==========================================
    // 材料の入力欄を追加する指示
    addIngredient() {
        // 【ステップ1：作成】 枠（箱）を1つ新しく作る
        const div = document.createElement("div")
        // 【ステップ2：味付け】 その箱に見た目（クラス）と中身（入力欄とゴミ箱）を入れる
        div.className = "ingredient-field flex items-center gap-2"
        div.innerHTML = `
            <input type="text" name="post[ingredients][]" placeholder="新しい材料" class="w-full p-3 bg-[#f2eae1] border-none text-[#4a3b32] text-sm placeholder-[#b1a296] focus:ring-1 focus:ring-[#80351d] focus:outline-none rounded-sm">
            <button type="button" data-action="click->post-form#removeIngredient" class="p-2 text-[#8e7e75] hover:text-[#80351d] bg-transparent border-none cursor-pointer">🗑️</button>
        `
        // 【ステップ3：配置】 用意した箱を、画面上の「指定された場所」にガチャンと合体させる
        this.ingredientsContainerTarget.appendChild(div)
    }

    // 材料の入力欄を削除する指示
    removeIngredient(event) {
        // 「いま押されたゴミ箱ボタンと同じ箱に入っている入力欄」だけを確実に狙い撃ちして削除
        console.log("removeIngredientメソッドを実行")
        event.target.closest(".ingredient-field").remove()
    }

    // 作り方の工程を追加する指示
    addStep() {
        // 【ステップ1：作成】 枠（箱）を1つ新しく作る
        const div = document.createElement("div")
        // 【ステップ2：味付け】 その箱に見た目（クラス）と中身（入力欄とゴミ箱）を入れる
        div.className = "step-field flex items-start gap-2"
        div.innerHTML = `
            <span class="step-number min-w-[20px] pt-3 text-sm font-bold text-[#80351d]"></span>
            <textarea name="post[steps][]" rows="2" placeholder="次の工程" class="w-full p-3 bg-[#f2eae1] border-none text-[#4a3b32] text-sm placeholder-[#b1a296] focus:ring-1 focus:ring-[#80351d] focus:outline-none resize-none rounded-sm"></textarea>
            <button type="button" data-action="click->post-form#removeStep" class="p-2 pt-3 text-[#8e7e75] hover:text-[#80351d] bg-transparent border-none cursor-pointer">🗑️</button>
        `
        // 【ステップ3：配置】 用意した箱を、画面上の「指定された場所」にガチャンと合体させる
        this.stepsContainerTarget.appendChild(div)
        // 【ステップ4：装飾】工程の頭にくっつく手順の番号を整頓する
        this._updateStepNumbers() // 番号を数え直す指示
    }

    // 作り方の工程を削除する指示
    removeStep(event) {
        console.log("removeStepメソッドを実行")
        event.target.closest(".step-field").remove()
        this._updateStepNumbers() // 削除した後に番号を数え直す指示
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

    // 作り方の数字を上から順に数え直す内部パーツ
    _updateStepNumbers() {
        const fields = this.stepsContainerTarget.querySelectorAll(".step-field")
        fields.forEach((field, index) => {
            const numberSpan = field.querySelector(".step-number")
            if (numberSpan) numberSpan.textContent = index + 1
        });
    }
}