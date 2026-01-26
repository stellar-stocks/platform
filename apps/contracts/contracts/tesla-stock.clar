(impl-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

;; Tesla Stock Token (6 decimals = micro-shares)
(define-fungible-token tesla-stock)

;; USDCX SIP-010 Interface
(define-trait usdcx-trait
  (
    (transfer (uint principal principal (optional (buff 34))) (response bool bool))
    (get-balance (principal) (uint))
  )
)

;; Constants
(define-constant ERR_OWNER_ONLY (err u100))
(define-constant ERR_NOT_TOKEN_OWNER (err u101))
(define-constant ERR_INSUFFICIENT_USDCX (err u102))
(define-constant ERR_INVALID_AMOUNT (err u104))
(define-constant CONTRACT_OWNER tx-sender)
(define-constant TOKEN_NAME "Tesla Stock")
(define-constant TOKEN_SYMBOL "TSLA")
(define-constant TOKEN_DECIMALS u6)
(define-constant USDCX_TOKEN 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.usdcx)
(define-constant TSLA_PRICE_USDC u449000000)  ;; 1 TSLA = $449 USDC (6 decimals)

;; Storage
(define-data-var token-uri (string-utf8 256) u"https://tesla.com")
(define-data-var total-usdcx-treasury uint u0)
(define-data-var total-tsla-circulation uint u0)

;; SIP-010 Functions
(define-read-only (get-balance (who principal)) (ok (ft-get-balance tesla-stock who)))
(define-read-only (get-total-supply) (ok (ft-get-supply tesla-stock)))
(define-read-only (get-name) (ok TOKEN_NAME))
(define-read-only (get-symbol) (ok TOKEN_SYMBOL))
(define-read-only (get-decimals) (ok TOKEN_DECIMALS))
(define-read-only (get-token-uri) (ok (some (var-get token-uri))))

;; 📊 Tesla Dashboard
(define-read-only (get-tesla-market)
  (ok {
    price_per_tsla: TSLA_PRICE_USDC,
    treasury_usdc: (var-get total-usdcx-treasury),
    total_shares: (ft-get-supply tesla-stock),
    shares_circulation: (var-get total-tsla-circulation)
  })
)

;; 🔥 MAIN FUNCTION: Send USDC → Get Exact TSLA Worth $449/share
(define-public (buy-tsla-with-usdc (usdc-amount uint))
  (let
    (
      (buyer tx-sender)
      (tsla-shares (/ (* u1000000 usdc-amount) TSLA_PRICE_USDC))  ;; Convert USDC → TSLA
    )
    (begin
      ;; Validate minimum purchase (0.001 TSLA)
      (asserts! (> usdc-amount u1000000) ERR_INVALID_AMOUNT)  ;; Min $1 USDC
      (asserts! (> tsla-shares u1000) ERR_INVALID_AMOUNT)     ;; Min 0.001 TSLA
      
      ;; Transfer USDC from buyer to contract
      (try! (contract-call? 
        USDCX_TOKEN 
        transfer 
        usdc-amount 
        buyer 
        (as-contract tx-sender) 
        (some 0x)
      ))
      
      ;; Mint exact TSLA shares worth the USDC sent
      (try! (as-contract (ft-mint? tesla-stock tsla-shares buyer)))
      
      ;; Update treasury
      (var-set total-usdcx-treasury (+ (var-get total-usdcx-treasury) usdc-amount))
      (var-set total-tsla-circulation (+ (var-get total-tsla-circulation) tsla-shares))
      
      (ok {
        usdc_received: usdc-amount,
        tsla_minted: tsla-shares,
        tsla_per_usdc: (/ tsla-shares usdc-amount),
        shares_worth: (* tsla-shares (/ TSLA_PRICE_USDC u1000000))
      })
    )
  )
)

;; 💰 Owner withdraw USDC treasury
(define-public (withdraw-treasury (amount uint))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_OWNER_ONLY)
    (asserts! (<= amount (var-get total-usdcx-treasury)) ERR_INSUFFICIENT_USDCX)
    
    (try! (as-contract 
      (contract-call? 
        USDCX_TOKEN 
        transfer 
        amount 
        (as-contract tx-sender) 
        CONTRACT_OWNER 
        none
      )
    ))
    
    (var-set total-usdcx-treasury (- (var-get total-usdcx-treasury) amount))
    (ok { withdrawn: amount })
  )
)

;; SIP-010 Transfer
(define-public (transfer
  (amount uint)
  (sender principal)
  (recipient principal)
  (memo (optional (buff 34)))
)
  (begin
    (asserts! (or (is-eq tx-sender sender) (is-eq contract-caller sender)) ERR_NOT_TOKEN_OWNER)
    (try! (ft-transfer? tesla-stock amount sender recipient))
    (match memo to-print (print to-print) 0x)
    (ok true)
  )
)
