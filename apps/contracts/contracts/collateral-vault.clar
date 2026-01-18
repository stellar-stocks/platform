;; (impl-trait .trait-sip-010.sip-010-trait)
;; (impl-trait .trait-sip-018.sip-018-trait)
(impl-trait .traits.vault-trait)

(define-constant contract-owner tx-sender)
(define-constant err-unauthorized (err u100))
(define-constant err-insufficient-balance (err u1001))

(define-fungible-token collateral-vault u1000000000000) ;; 1M tokens, 6 decimals

(define-map vaults { owner: principal } uint)
(define-data-var total-locked uint u0)

(define-read-only (get-name) (ok "Collateral Vault"))
(define-read-only (get-symbol) (ok "CVLT"))
(define-read-only (get-decimals) (ok u6))
(define-read-only (get-balance (owner principal)) 
  (ok (ft-get-balance collateral-vault owner)))

(define-read-only (get-total-supply) (ok (ft-get-supply collateral-vault)))

(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    (asserts! (is-eq tx-sender sender) err-unauthorized)
    (try! (ft-transfer? collateral-vault amount sender recipient))
    (print { type: "transfer", sender: sender, recipient: recipient, amount: amount, memo: memo })
    (ok true)))

(define-public (mint (recipient principal) (amount uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-unauthorized)
    (ft-mint? collateral-vault amount recipient)))

(define-public (lock-collateral (owner principal) (amount uint))
  (let ((owner-balance (unwrap-panic (get-balance owner))))
    (asserts! (>= owner-balance amount) err-insufficient-balance)
    (try! (ft-transfer? collateral-vault amount tx-sender (as-contract tx-sender)))
    (map-set vaults { owner: (as-contract tx-sender) } 
             (+ (default-to u0 (map-get? vaults { owner: (as-contract tx-sender) })) amount))
    (var-set total-locked (+ (var-get total-locked) amount))
    (ok true)))

(define-public (unlock-collateral (owner principal) (amount uint))
  (let ((contract-balance (default-to u0 (map-get? vaults { owner: (as-contract tx-sender) }))))
    (asserts! (>= contract-balance amount) err-insufficient-balance)
    (map-set vaults { owner: (as-contract tx-sender) } (- contract-balance amount))
    (var-set total-locked (- (var-get total-locked) amount))
    (ft-transfer? collateral-vault amount (as-contract tx-sender) owner)))
