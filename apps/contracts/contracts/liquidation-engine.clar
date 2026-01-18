(define-constant err-not-liquidatable (err 200))

(define-trait perp-engine-trait
  ((get-position (principal (string-ascii 12)) (response (tuple (collateral uint) (size int) (leverage uint) (entry-price uint) (unrealized-pnl int) (last-funding uint)) none))
   (calc-pnl-raw ((tuple (collateral uint) (size int) (leverage uint) (entry-price uint) (unrealized-pnl int) (last-funding uint)) uint) int)
   (close-position ((string-ascii 12)) (response (tuple (pnl int) (payout uint)) bool))))

(define-public (liquidate (owner principal) (symbol (string-ascii 12)))
  (let (
    (position (unwrap-panic (contract-call? perp-engine get-position owner symbol)))
    (current-price (contract-call? dia-oracle-wrapper get-latest-price symbol))
    (pnl (contract-call? perp-engine calc-pnl-raw position current-price))
    (health (/ (+ (get collateral position) pnl) 
               (* (abs (get size position)) current-price))))
    (asserts! (< health u110) err-not-liquidatable)
    ;; Transfer 95% collateral to owner, 5% keeper penalty
    (try! (contract-call? collateral-vault unlock-collateral owner 
                         (* (get collateral position) u95)))
    (contract-call? perp-engine close-position symbol)
    (print { type: "liquidation", owner: owner, penalty: "5%" })
    (ok true)))