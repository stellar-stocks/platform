;; collateral-vault.clar
;; Holds user USDCx. Only the engine can trigger withdrawals.

(define-constant ERR-NOT-AUTHORIZED (err u401))
(define-constant PERP-ENGINE .perp-engine)

(define-public (deposit (amount uint))
    (contract-call? 'ST120SBRBQJ00MCWS7TM5R8WJNTTKD5K0HFRC2CNE.usdcx transfer amount tx-sender (as-contract tx-sender) none)
)

(define-public (withdraw (amount uint) (recipient principal))
    (begin
        (asserts! (is-eq contract-caller PERP-ENGINE) ERR-NOT-AUTHORIZED)
        (as-contract (contract-call? 'ST120SBRBQJ00MCWS7TM5R8WJNTTKD5K0HFRC2CNE.usdcx transfer amount (as-contract tx-sender) recipient none))
    )
)