(define-map prices { symbol: (string-ascii 12) } uint)
(define-map timestamps { symbol: (string-ascii 12) } uint)

(define-public (set-price (symbol (string-ascii 12)) (price uint))
  (begin
    (map-set prices { symbol: symbol } price)
    (map-set timestamps { symbol: symbol } (block-height))
    (print { type: "oracle-update", symbol: symbol, price: price })
    (ok true)))

(define-read-only (get-latest-price (symbol (string-ascii 12)))
  (default-to u0 (map-get? prices { symbol: symbol })))

(define-read-only (is-stale (symbol (string-ascii 12)))
  (let ((timestamp (default-to u0 (map-get? timestamps { symbol: symbol }))))
   (< (- (block-height) timestamp) u3600)))

(define-read-only (calc-liquidation-price (entry-price uint) (leverage uint))
  (/ (* entry-price u110) leverage))