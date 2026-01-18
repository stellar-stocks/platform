(define-constant MAX_LEVERAGE u20)
(define-constant MIN_COLLATERAL u1000000) ;; $1 min
(define-constant FEE_BPS u50) ;; 0.5%

(define-constant err-invalid-leverage (err u100))
(define-constant err-insufficient-collateral (err u101))
(define-constant err-invalid-price (err u102))
(define-constant err-unauthorized (err u401))
(define-constant err-healthy-position (err u402))

(define-data-var governance principal tx-sender)
(define-map whitelisted-liquidators principal bool)

(define-public (set-liquidator (liquidator principal) (status bool))
  (begin
    (asserts! (is-eq tx-sender (var-get governance)) err-unauthorized)
    (ok (map-set whitelisted-liquidators liquidator status))))

(impl-trait .traits.perp-engine-trait)
(use-trait vault-trait .traits.vault-trait)

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
    (price-change (- (to-int current-price) (to-int (get entry-price position))))
    (position-value (* (get size position) price-change))
    (leveraged-pnl (/ (* position-value (to-int (get leverage position))) 10000)))
    (ok leveraged-pnl)))

(define-public (open-position (symbol (string-ascii 12)) (is-long bool) (leverage uint) (size uint) (vault <vault-trait>))
  (let (
    (owner tx-sender)
    (required-collateral (* size leverage))
    (current-price (contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.dia-oracle-wrapper get-latest-price symbol))
    (position (default-to {
      collateral: u0, size: 0, leverage: u1, entry-price: u0, unrealized-pnl: 0, last-funding: burn-block-height
    } (map-get? positions { owner: owner, symbol: symbol })))
    (new-size (+ (get size position) (if is-long (to-int size) (- 0 (to-int size)))))
    (new-collateral (+ (get collateral position) required-collateral))
    (new-position {
      collateral: new-collateral,
      size: new-size,
      leverage: leverage,
      entry-price: current-price,
      unrealized-pnl: 0,
      last-funding: burn-block-height
    }))
    (asserts! (<= leverage MAX_LEVERAGE) err-invalid-leverage)
    (asserts! (>= required-collateral MIN_COLLATERAL) err-insufficient-collateral)
    (asserts! (> current-price u0) err-invalid-price)
    (try! (contract-call? vault lock-collateral tx-sender required-collateral))
    (map-set positions { owner: owner, symbol: symbol } new-position)
    (print { type: "position-opened", owner: owner, symbol: symbol, size: new-size })
    (ok new-position)))

(define-public (close-position (symbol (string-ascii 12)) (vault <vault-trait>))
  (let (
    (owner tx-sender)
    (position (unwrap-panic (map-get? positions { owner: owner, symbol: symbol })))
    (current-price (contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.dia-oracle-wrapper get-latest-price symbol))
    (pnl (unwrap-panic (calc-pnl-raw position current-price)))
    (total-collateral (+ (to-int (get collateral position)) pnl))
    (fee (/ (* (if (< pnl 0) (- 0 pnl) pnl) (to-int FEE_BPS)) 10000))
    (payout (if (< total-collateral 0) u0 (to-uint (- total-collateral fee)))))
    (try! (contract-call? vault unlock-collateral owner payout))
    (map-delete positions { owner: owner, symbol: symbol })
    (print { type: "position-closed", owner: owner, pnl: pnl, payout: payout })
    (ok { pnl: pnl, payout: payout })))

(define-public (liquidate-position (owner principal) (symbol (string-ascii 12)) (vault <vault-trait>))
  (let (
    (caller contract-caller)
    (is-authorized (or (is-eq caller (var-get governance)) 
                       (is-eq caller owner)
                       (default-to false (map-get? whitelisted-liquidators caller)))))
    (asserts! is-authorized err-unauthorized)
    (let (
      (position (unwrap-panic (map-get? positions { owner: owner, symbol: symbol })))
      (current-price (contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.dia-oracle-wrapper get-latest-price symbol))
      (pnl (unwrap-panic (calc-pnl-raw position current-price)))
      (collateral (get collateral position))
      (size (get size position))
      (abs-size (if (< size 0) (- 0 size) size))
      (health (/ (* (+ (to-int collateral) pnl) 10000) (to-int (* (to-uint abs-size) current-price))))
      (penalty (/ (* collateral u5) u100))
      (payout (- collateral penalty)))
      (asserts! (< health 1000) err-healthy-position)
      (try! (contract-call? vault unlock-collateral owner payout))
      (try! (contract-call? vault unlock-collateral caller penalty))
      (map-delete positions { owner: owner, symbol: symbol })
      (print { type: "liquidation", owner: owner, liquidator: caller, pnl: pnl, payout: payout, penalty: penalty })
      (ok { pnl: pnl, payout: payout }))))

(define-read-only (get-position (owner principal) (symbol (string-ascii 12)))
  (ok (map-get? positions { owner: owner, symbol: symbol })))