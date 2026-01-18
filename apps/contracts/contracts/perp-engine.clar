(define-constant MAX_LEVERAGE u20)
(define-constant MIN_COLLATERAL u1000000) ;; $1 min
(define-constant FEE_BPS u50) ;; 0.5%

(define-constant err-invalid-leverage (err 100))
(define-constant err-insufficient-collateral (err 101))
(define-constant err-invalid-price (err 102))

(define-map positions 
  { owner: principal, symbol: (string-ascii 12) }
  { 
    collateral: uint,
    size: int,
    leverage: uint,
    entry-price: uint,
    unrealized-pnl: int,
    last-funding: uint
  })

(define-read-only (calc-pnl-raw (position (tuple (collateral uint) (size int) (leverage uint) (entry-price uint) (unrealized-pnl int) (last-funding uint))) (current-price uint))
  (let (
    (price-change (- current-price (get entry-price position)))
    (position-value (* (get size position) price-change))
    (leveraged-pnl (/ (* position-value (get leverage position)) u10000)))
    leveraged-pnl))

(define-public (open-position (symbol (string-ascii 12)) (is-long bool) (leverage uint) (size uint))
  (let (
    (owner tx-sender)
    (required-collateral (* size leverage))
    (current-price (contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.dia-oracle-wrapper get-latest-price symbol))
    (position (or (map-get? positions { owner: owner, symbol: symbol }) {
      collateral: u0, size: 0, leverage: u1, entry-price: u0, unrealized-pnl: 0, last-funding: block-height
    }))
    (new-size (+ (get size position) (if is-long size (- 0 size))))
    (new-collateral (+ (get collateral position) required-collateral))
    (new-position {
      collateral: new-collateral,
      size: new-size,
      leverage: leverage,
      entry-price: current-price,
      unrealized-pnl: 0,
      last-funding: block-height
    }))
    (asserts! (<= leverage MAX_LEVERAGE) err-invalid-leverage)
    (asserts! (>= required-collateral MIN_COLLATERAL) err-insufficient-collateral)
    (asserts! (> current-price u0) err-invalid-price)
    (try! (contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.collateral-vault lock-collateral tx-sender required-collateral))
    (map-set positions { owner: owner, symbol: symbol } new-position)
    (print { type: "position-opened", owner: owner, symbol: symbol, size: new-size })
    (ok new-position)))

(define-public (close-position (symbol (string-ascii 12)))
  (let (
    (owner tx-sender)
    (position (unwrap-panic (map-get? positions { owner: owner, symbol: symbol })))
    (current-price (contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.dia-oracle-wrapper get-latest-price symbol))
    (pnl (calc-pnl-raw position current-price))
    (total-collateral (+ (get collateral position) pnl))
    (fee (/ (* (abs pnl) FEE_BPS) u10000))
    (payout (if (< total-collateral u0) u0 (- total-collateral fee))))
    (try! (contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.collateral-vault unlock-collateral owner payout))
    (map-delete positions { owner: owner, symbol: symbol })
    (print { type: "position-closed", owner: owner, pnl: pnl, payout: payout })
    (ok { pnl: pnl, payout: payout })))

(define-read-only (get-position (owner principal) (symbol (string-ascii 12)))
  (map-get? positions { owner: owner, symbol: symbol }))