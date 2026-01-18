;; dia-oracle-wrapper.clar
(define-constant ERR-STALE-PRICE (err u500))
(define-constant MAX-PRICE-AGE u300) ;; 5 minutes in seconds

(define-read-only (get-stock-price (symbol (string-ascii 32)))
    (let (
        (price-data (unwrap! (contract-call? 'ST1S5ZGRZV5K4S9205RWPRTX9RGS9JV40KQMR4G1J.dia-oracle get-value symbol) (err u404)))
        (current-time (unwrap-panic (get-block-info? time (- block-height u1))))
    )
        ;; Check if price is older than 5 minutes
        (asserts! (< (- current-time (get timestamp price-data)) MAX-PRICE-AGE) ERR-STALE-PRICE)
        (ok (get price price-data))
    )
)