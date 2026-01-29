(define-map prices { symbol: (string-ascii 12) } uint)
(define-map timestamps { symbol: (string-ascii 12) } uint)

(define-public (set-price (symbol (string-ascii 12)) (price uint))
  (begin
    (map-set prices { symbol: symbol } price)
    (map-set timestamps { symbol: symbol } burn-block-height)
    (print { type: "oracle-update", symbol: symbol, price: price })
    (ok true)))

(define-public (set-multiple-prices (entries (list 10 (tuple (symbol (string-ascii 12)) (price uint)))))
  (begin
    (map set-price-iter entries)
    (ok true)))

(define-private (set-price-iter (entry (tuple (symbol (string-ascii 12)) (price uint))))
  (let ((symbol (get symbol entry))
        (price (get price entry)))
    (map-set prices { symbol: symbol } price)
    (map-set timestamps { symbol: symbol } burn-block-height)
    (print { type: "oracle-update", symbol: symbol, price: price })))

(define-read-only (get-latest-price (symbol (string-ascii 12)))
  (default-to u0 (map-get? prices { symbol: symbol })))

(define-read-only (is-stale (symbol (string-ascii 12)))
  (let ((timestamp (default-to u0 (map-get? timestamps { symbol: symbol }))))
   (< (- burn-block-height timestamp) u3600)))

(define-read-only (calc-liquidation-price (entry-price uint) (leverage uint))
  (/ (* entry-price u110) leverage))