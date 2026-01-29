;; Mock USDCx for Local Testing & Devnet
;; This simulates the behavior of ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.usdcx on Testnet
(impl-trait .traits.sip-010-trait)

(define-fungible-token usdcx)

;; Precise decimals for USDCx (6 decimals)
(define-read-only (get-decimals) (ok u6))

(define-read-only (get-name) (ok "USDCx"))
(define-read-only (get-symbol) (ok "USDCx"))

(define-public (mint (amount uint) (recipient principal))
    (ft-mint? usdcx amount recipient)
)

(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
    (begin
        (asserts! (is-eq tx-sender sender) (err u101))
        (ft-transfer? usdcx amount sender recipient)
    )
)

(define-read-only (get-balance (who principal)) (ok (ft-get-balance usdcx who)))
(define-read-only (get-total-supply) (ok (ft-get-supply usdcx)))
(define-read-only (get-token-uri) (ok none))