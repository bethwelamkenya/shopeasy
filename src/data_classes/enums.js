class Enums {
    constructor() {
        this.currencySymbols = Object.freeze(
            {
                USD: "$",
                EUR: "€",
                GBP: "£",
                JPY: "¥",
                AUD: "A$",
                CAD: "C$",
                CHF: "Fr.",
                CNY: "¥",
                SEK: "kr",
                NZD: "NZ$"
            }
        )
        this.transactionTypes = Object.freeze(
            {
                DEPOSIT: 'DEPOSIT',
                WITHDRAW: 'WITHDRAW',
                TRANSFER_OUT: 'TRANSFER_OUT',
                TRANSFER_IN: 'TRANSFER_IN',
                TRANSFER_OUT_TO: 'TRANSFER_OUT_TO',
                TRANSFER_IN_FROM: 'TRANSFER_IN_FROM',
                DEPOSIT_GOAL: 'DEPOSIT_GOAL',
                WITHDRAW_GOAL: 'WITHDRAW_GOAL'
            }
        )
        this.currencyTypes = Object.freeze(
            {
                USD: "USD",
                EUR: "EUR",
                GBP: "GBP",
                JPY: "JPY",
                AUD: "AUD",
                CAD: "CAD",
                CHF: "CHF",
                CNY: "CNY",
                SEK: "SEK",
                NZD: "NZD",
            }
        )
    }
}

module.exports = Enums;