(impl-trait .traits.sip-010-trait)

;; Tesla Stock Token (6 decimals = micro-shares)
(define-fungible-token tesla-stock)

;; USDCX SIP-010 Interface
(define-trait usdcx-trait
  (
    (transfer (uint principal principal (optional (buff 34))) (response bool uint))
    (get-balance (principal) (response uint uint))
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
(define-constant USDCX_TOKEN .mock-usdcx)
;; (define-constant TSLA_PRICE_USDC u449000000)  ;; Removed static price

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

(define-read-only (get-price)
  (let ((oracle-price (contract-call? .dia-oracle-wrapper get-latest-price "TSLA")))
    (if (> oracle-price u0) 
        oracle-price 
        u44900000000))) ;; Fallback/Default if oracle is 0 (approx $449)

;; Tesla Dashboard
(define-read-only (get-tesla-market)
  (ok {
    price_per_tsla: (get-price),
    treasury_usdc: (var-get total-usdcx-treasury),
    total_shares: (ft-get-supply tesla-stock),
    shares_circulation: (var-get total-tsla-circulation)
  })
)

;; MAIN FUNCTION: Send USDC  Get Exact TSLA Worth $449/share
(define-public (buy-tsla-with-usdc (usdc-amount uint))
  (let
    (
      (buyer tx-sender)
      (current-price (get-price))
      ;; Price is 8 decimals (from Oracle, e.g. 44900000000 => $449.00)
      ;; USDC is 6 decimals.
      ;; TSLA is 6 decimals.
      ;; Value in USD = (usdc-amount / 1e6)
      ;; TSLA shares = (Value / Price)
      ;; Calculation:
      ;; tsla-shares = (usdc-amount * 10^8) / price
      ;; wait, price is e.g. 449 * 10^8.
      ;; if 1 USDC (1e6), expected 1/449 shares.
      ;; 1e6 * 1e8 / (449 * 1e8) = 1e6 / 449 = 2227 micro-shares (0.002227 TSLA). Correct.
      ;; 
      ;; Adjusted for 6 decimal output:
      ;; shares = usdc_amount * 10^8 / price
      
      (tsla-shares (/ (* usdc-amount u100000000) current-price))
    )
    (begin
      ;; Validate minimum purchase (0.001 TSLA => 1000 units)
      (asserts! (> usdc-amount u1000000) ERR_INVALID_AMOUNT)  ;; Min $1 USDC
      (asserts! (> tsla-shares u1000) ERR_INVALID_AMOUNT)     ;; Min 0.001 TSLA
      
      ;; Transfer USDC from buyer to contract
      (try! (contract-call? 
        .mock-usdcx
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
        tsla_per_usdc: (/ (* tsla-shares u1000000) usdc-amount), ;; scaled for display
        shares_worth: (* tsla-shares (/ current-price u100000000)) ;; price normalized to dollars
      })
    )
  )
)

;; Owner withdraw USDC treasury
(define-public (withdraw-treasury (amount uint))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_OWNER_ONLY)
    (asserts! (<= amount (var-get total-usdcx-treasury)) ERR_INSUFFICIENT_USDCX)
    
    (try! (as-contract 
      (contract-call? 
        .mock-usdcx
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
