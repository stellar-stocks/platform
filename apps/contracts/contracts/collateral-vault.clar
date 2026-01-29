;; Collateral Vault
;; Holds collateral (USDC) for the Perpetual Exchange

(impl-trait .traits.vault-trait)
(use-trait sip-010-trait .traits.sip-010-trait)

(define-constant ERR_UNAUTHORIZED (err u401))

;; The engine authorized to unlock collateral
(define-data-var allowed-engine principal tx-sender)

;; Mock or reference to the collateral token (USDC)
;; Currently using the principal known elsewhere in the project
;; Ideally this should be passed in or set by owner
(define-data-var usdc-token-principal principal .mock-usdcx)

(define-public (set-allowed-engine (engine principal))
  (begin
    (ok (var-set allowed-engine engine))
  )
)

(define-public (set-usdc-token (token principal))
    (ok (var-set usdc-token-principal token))
)

;; Lock collateral: User -> Vault
(define-public (lock-collateral (owner principal) (amount uint))
  (begin
     (try! (contract-call? .mock-usdcx transfer amount owner (as-contract tx-sender) none))
     (ok true)
  )
)

;; Unlock collateral: Vault -> Receiver
(define-public (unlock-collateral (receiver principal) (amount uint))
  (begin
    (asserts! (is-eq contract-caller (var-get allowed-engine)) ERR_UNAUTHORIZED)
    (as-contract (contract-call? .mock-usdcx transfer amount tx-sender receiver none))
  )
)

