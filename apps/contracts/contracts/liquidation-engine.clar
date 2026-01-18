(define-constant err-not-liquidatable (err u200))

(define-constant dia-oracle-wrapper .dia-oracle-wrapper)

(define-trait perp-engine-trait
  ((get-position (principal (string-ascii 12)) (response (tuple (collateral uint) (size int) (leverage uint) (entry-price uint) (unrealized-pnl int) (last-funding uint)) uint))
   (calc-pnl-raw ((tuple (collateral uint) (size int) (leverage uint) (entry-price uint) (unrealized-pnl int) (last-funding uint)) uint) (response int uint))
   (close-position ((string-ascii 12)) (response (tuple (pnl int) (payout uint)) uint))))

(define-trait collateral-vault-trait
  ((unlock-collateral (principal uint) (response bool uint))))

(define-public (liquidate (perp-engine <perp-engine-trait>) (collateral-vault <collateral-vault-trait>) (owner principal) (symbol (string-ascii 12)))
  (let (
    (position (unwrap-panic (contract-call? perp-engine get-position owner symbol)))
    (current-price (contract-call? dia-oracle-wrapper get-latest-price symbol))
    (pnl (unwrap-panic (contract-call? perp-engine calc-pnl-raw position current-price)))
    (size (get size position))
    (abs-size (if (< size 0) (- 0 size) size))
    (health (/ (+ (to-int (get collateral position)) pnl) 
               (to-int (* (to-uint abs-size) current-price)))))
    (asserts! (< health 110) err-not-liquidatable)
    ;; Transfer 95% collateral to owner, 5% keeper penalty
    (try! (contract-call? collateral-vault unlock-collateral owner 
                         (/ (* (get collateral position) u95) u100)))
    (try! (contract-call? perp-engine close-position symbol))
    (print { type: "liquidation", owner: owner, penalty: "5%" })
    (ok true)))