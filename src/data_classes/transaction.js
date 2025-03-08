const Enums = require("./enums");

const enums = new Enums()

class Transaction {
    constructor(
        id = "",
        amount = 0.0,
        accountNumber = "",
        userEmail = "",
        type = enums.transactionTypes.DEPOSIT,
        targetAccountNumber = null,
        targetUserEmail = null,
        goal = null,
        currency = enums.currencyTypes.USD,
        timestamp = Date.now()
    ) {
        this.id = id
        this.amount = amount
        this.accountNumber = accountNumber
        this.userEmail = userEmail
        this.type = type
        this.targetAccountNumber = targetAccountNumber
        this.targetUserEmail = targetUserEmail
        this.goal = goal
        this.currency = currency
        this.timestamp = timestamp
    }

    static fromJson(json) {
        return new Transaction(
            json.id,
            json.amount,
            json.accountNumber,
            json.userEmail,
            json.type,
            json.targetAccountNumber,
            json.targetUserEmail,
            json.goal,
            json.currency,
            json.timestamp
        )
    }

    getCurrency() {
        return enums.currencySymbols[this.currency]
    }

    amountFormatted() {
        return `${this.getCurrency()}${this.amount}`
    }

    getCreatedAt() {
        /**
         * Converts a timestamp (milliseconds since the Unix epoch) to a human-readable date string.
         *
         * @param {number} timestamp - The timestamp in milliseconds.
         * @returns {string} The date string in the format "YYYY-MM-DD HH:MM:SS".
         */
        const date = new Date(this.timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
}

export default Transaction