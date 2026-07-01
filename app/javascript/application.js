// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"
import { application } from "./controllers/application" // コントローラーを取得するためにインポート

// Turboのオブジェクト（本体）を、すでに読み込まれている「Turbo」というグローバル変数から安全に取得
const Turbo = window.Turbo

if (Turbo) {
    // Turbo Stream に "close_modal" という独自の命令（アクション）を登録する
    Turbo.StreamActions.close_modal = function () {
        // posts_controllerのtarget: "[data-controller='post-form']" で指定した文字列を取得
        const targetSelector = this.getAttribute("target")
        // 画面内からそのHTML要素を探す
        const element = document.querySelector(targetSelector)
        if (element) {
            // そのHTML要素に紐づいている「post-form」というStimulusコントローラーを探し出す
            const controller = application.getControllerForElementAndIdentifier(element, "post-form")
            if (controller) {
                // Stimulus側で作った「closeModal()」関数をここで実行する
                controller.closeModal()
            }
        }
    }
}