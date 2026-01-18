(define-constant err-not-liquidatable (err u200))

;; (define-constant dia-oracle-wrapper .dia-oracle-wrapper)

(use-trait vault-trait .traits.vault-trait)
(use-trait perp-engine-trait .traits.perp-engine-trait)

(define-public (liquidate (perp-engine <perp-engine-trait>) (collateral-vault <vault-trait>) (owner principal) (symbol (string-ascii 12)))
  (let (
    (position (unwrap-panic (unwrap-panic (contract-call? perp-engine get-position owner symbol))))
    (current-price (contract-call? .dia-oracle-wrapper get-latest-price symbol))
    (pnl (unwrap-panic (contract-call? perp-engine calc-pnl-raw position current-price)))
    (size (get size position))
    (abs-size (if (< size 0) (- 0 size) size))
    (health (/ (* (+ (to-int (get collateral position)) pnl) 10000)
               (to-int (* (to-uint abs-size) current-price)))))
    (asserts! (< health 1000) err-not-liquidatable)
    ;; Transfer 95% collateral to owner, 5% keeper penalty
    ;; (try! (contract-call? collateral-vault unlock-collateral owner 
    ;;                      (/ (* (get collateral position) u95) u100)))
    (try! (contract-call? perp-engine liquidate-position owner symbol collateral-vault))
    (print { type: "liquidation", owner: owner, penalty: "5%" })
    (ok true)))