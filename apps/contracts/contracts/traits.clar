(define-trait sip-010-trait
  (
    (transfer (uint principal principal (optional (buff 34))) (response bool uint))
    (get-name () (response (string-ascii 32) uint))
    (get-symbol () (response (string-ascii 32) uint))
    (get-decimals () (response uint uint))
    (get-balance (principal) (response uint uint))
    (get-total-supply () (response uint uint))
    (get-token-uri () (response (optional (string-utf8 256)) uint))
  )
)

(define-trait vault-trait
  (
    (lock-collateral (principal uint) (response bool uint))
    (unlock-collateral (principal uint) (response bool uint))
  )
)

(define-trait perp-engine-trait
  ((get-position (principal (string-ascii 12)) (response (optional (tuple (collateral uint) (size int) (leverage uint) (entry-price uint) (unrealized-pnl int) (last-funding uint))) uint))
   (calc-pnl-raw ((tuple (collateral uint) (size int) (leverage uint) (entry-price uint) (unrealized-pnl int) (last-funding uint)) uint) (response int uint))
   (close-position ((string-ascii 12) <vault-trait>) (response (tuple (pnl int) (payout uint)) uint))
   (liquidate-position (principal (string-ascii 12) <vault-trait>) (response (tuple (pnl int) (payout uint)) uint))))
