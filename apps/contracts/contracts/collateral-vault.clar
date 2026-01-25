;; TSLA Stock Token - SIP-010 Fungible Token for Tesla Stock Representation
;; Implements tokenized stock shares on Stacks Blockchain (Clarity)
(impl-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

;; Token Configuration - TSLA Stock
(define-fungible-token tsla-stock-token)

;; Errors
(define-constant ERR_OWNER_ONLY (err u100))
(define-constant ERR_NOT_TOKEN_OWNER (err u101))
(define-constant ERR_SUPPLY_EXCEEDED (err u102))
(define-constant ERR_INVALID_TRADE_HOURS (err u103))

;; Token Metadata - Tesla Stock Specific
(define-constant CONTRACT_OWNER tx-sender)
(define-constant TOKEN_NAME "Tesla Stock Token")
(define-constant TOKEN_SYMBOL "TSLA")
(define-constant TOKEN_DECIMALS u8)  ;; 8 decimals for precise stock pricing (0.00000001 shares)
(define-constant MAX_SUPPLY u1000000000)  ;; 1B total shares (market cap representation)

;; Stock Market Data Variables
(define-data-var token-uri (string-utf8 256) 
    u"https://api.stellar-stocks.com/tsla-metadata.json")
(define-data-var current-price (uint) u248.50)  ;; Current stock price in USD * 1e8
(define-data-var market-cap (uint) u792000000000000000)  ;; Market cap in USD * 1e8
(define-data-var last-updated uint u0)

;; Stock Trading State
(define-data-var trading-enabled bool true)
(define-data-var total-shares-outstanding uint u0)

;; Events for Stock Analytics
(define-data-var total-volume-24h uint u0)
(define-data-var total-trades uint u0)

;; SIP-010 Standard Functions
(define-read-only (get-balance (who principal))
  (ok (ft-get-balance tsla-stock-token who)))

(define-read-only (get-total-supply)
  (ok (ft-get-supply tsla-stock-token)))

(define-read-only (get-name)
  (ok TOKEN_NAME))

(define-read-only (get-symbol)
  (ok TOKEN_SYMBOL))

(define-read-only (get-decimals)
  (ok TOKEN_DECIMALS))

(define-read-only (get-token-uri)
  (ok (some (var-get token-uri))))

;; Stock Price Oracle Functions
(define-read-only (get-current-price)
  (ok (var-get current-price)))

(define-read-only (get-market-cap)
  (ok (var-get market-cap)))

(define-read-only (get-shares-outstanding)
  (ok (var-get total-shares-outstanding)))

(define-read-only (get-token-value-usd (amount uint))
  (let (
    (price (var-get current-price))
    (value (* amount (/ price TOKEN_DECIMALS)))
  )
    (ok value)
  )
)

;; Owner Functions - Stock Management
(define-public (set-token-uri (value (string-utf8 256)))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_OWNER_ONLY)
    (var-set token-uri value)
    (ok (print { 
        notification: "token-metadata-update",
        payload: {
          contract-id: (as-contract tx-sender),
          token-class: "ft"
        }
      }))
  )
)

(define-public (update-stock-price (new-price uint))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_OWNER_ONLY)
    (var-set current-price new-price)
    (var-set last-updated block-height)
    (ok true)
  )
)

(define-public (mint-shares (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_OWNER_ONLY)
    (asserts! (<= (+ (ft-get-supply tsla-stock-token) amount) MAX_SUPPLY) ERR_SUPPLY_EXCEEDED)
    (var-set total-shares-outstanding (+ (var-get total-shares-outstanding) amount))
    (ft-mint? tsla-stock-token amount recipient)
  )
)

(define-public (toggle-trading (enabled bool))
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_OWNER_ONLY)
    (var-set trading-enabled enabled)
    (ok enabled)
  )
)

;; Enhanced Transfer with Stock Trading Features
(define-public (transfer
  (amount uint)
  (sender principal)
  (recipient principal)
  (memo (optional (buff 34)))
)
  (begin
    (asserts! (var-get trading-enabled) ERR_INVALID_TRADE_HOURS)
    (asserts! (or (is-eq tx-sender sender) (is-eq contract-caller sender)) ERR_NOT_TOKEN_OWNER)
    (asserts! (> amount u0) ERR_SUPPLY_EXCEEDED)
    
    ;; Update trading volume
    (var-set total-volume-24h (+ (var-get total-volume-24h) amount))
    (var-set total-trades (+ (var-get total-trades) u1))
    
    (try! (as-contract (contract-call? 
      'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait 
      transfer clarity-coin amount sender recipient)))
    
    (match memo to-print 
      (print { 
        event: "stock-trade", 
        symbol: TOKEN_SYMBOL, 
        amount: amount, 
        from: sender, 
        to: recipient, 
        price: (var-get current-price)
      }) 
      0x)
    
    (ok true)
  )
)

;; Stock-Specific Functions
(define-public (buy-shares (amount uint))
  (let (
    (buyer tx-sender)
    (total-cost (try! (get-token-value-usd amount)))
  )
    ;; Integrate with payment token/oracle here
    (begin
      (asserts! (var-get trading-enabled) ERR_INVALID_TRADE_HOURS)
      (mint-shares amount buyer)
    )
  )
)

(define-read-only (get-trading-stats)
  (ok {
    symbol: TOKEN_SYMBOL,
    price: (var-get current-price),
    market-cap: (var-get market-cap),
    shares-outstanding: (var-get total-shares-outstanding),
    volume-24h: (var-get total-volume-24h),
    total-trades: (var-get total-trades),
    trading-enabled: (var-get trading-enabled)
  })
)

;; Admin: Reset daily volume (call daily)
(define-public (reset-daily-volume)
  (begin
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_OWNER_ONLY)
    (var-set total-volume-24h u0)
    (ok true)
  )
)
