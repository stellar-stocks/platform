;; perp-engine.clar
(define-map Positions principal 
    {
        size: uint,          ;; Total position value (Amount * Leverage)
        entry-price: uint,   ;; Price from DIA at open
        collateral: uint,    ;; Actual USDCx deposited
        is-long: bool        ;; Long or Short
    }
)

;; Open a Leveraged Position
(define-public (open-position (amount uint) (leverage uint) (symbol (string-ascii 32)) (is-long bool))
    (let (
        (entry-price (unwrap! (contract-call? .dia-oracle-wrapper get-stock-price symbol) (err u404)))
        (position-size (* amount leverage))
    )
        ;; Step 1: Transfer USDCx from user to the DEX vault
        (try! (contract-call? 'SP120SBRBQJ00MCWS7TM5R8WJNTTKD5K0HFRC2CNE.usdcx transfer amount tx-sender (as-contract tx-sender) none))
        
        ;; Step 2: Save the position
        (map-set Positions tx-sender {
            size: position-size,
            entry-price: entry-price,
            collateral: amount,
            is-long: is-long
        })
        (ok true)
    )
)