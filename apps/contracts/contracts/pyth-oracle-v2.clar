;; Pyth Oracle Adapter v2
;; Stores prices pushed by an off-chain keeper fetching from Hermes API.
(impl-trait .traits.oracle-trait)

(define-constant ERR_UNAUTHORIZED (err u100))
(define-constant ERR_STALE_PRICE (err u101))

(define-data-var oracle-owner principal tx-sender)

;; Map: Symbol/FeedID -> { Price, Confidence, Timestamp }
(define-map prices 
  (string-ascii 32) 
  { price: uint, conf: uint, timestamp: uint }
)

(define-read-only (get-price (symbol (string-ascii 32)))
  (let (
    (price-data (unwrap! (map-get? prices symbol) (err u404)))
  )
    ;; In production, check timestamp vs block-time for staleness
    (ok (get price price-data))
  )
)

;; Called by off-chain keeper/relayer
(define-public (update-price (symbol (string-ascii 32)) (price uint))
  (begin
    (asserts! (is-eq tx-sender (var-get oracle-owner)) ERR_UNAUTHORIZED)
    (map-set prices symbol { 
      price: price, 
      conf: u0, 
      timestamp: burn-block-height 
    })
    (print { event: "price-update", symbol: symbol, price: price })
    (ok true)
  )
)