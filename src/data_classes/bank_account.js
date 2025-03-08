import Enums from "./enums";

const enums = new Enums()

class BankAccount {

    constructor(
        id = "",
        accountNumber = "",
        holderName = "",
        bankName = "",
        balance = 0.0,
        currency = enums.currencyTypes.USD,
        createdAt = Date.now(),
    ) {
        this.id = id
        this.accountNumber = accountNumber
        this.holderName = holderName
        this.bankName = bankName
        this.balance = balance
        this.currency = currency
        this.createdAt = createdAt
    }

    static fromJson(json){
        return new BankAccount(
            json.id,
            json.accountNumber,
            json.holderName,
            json.bankName,
            json.balance,
            json.currency,
            json.createdAt,
        )
    }

    getCurrency() {
        return enums.currencySymbols[this.currency]
    }

    balanceFormatted() {
        return `${this.getCurrency()}${this.balance}`
    }

    getCreatedAt() {
        /**
         * Converts a timestamp (milliseconds since the Unix epoch) to a human-readable date string.
         *
         * @param {number} timestamp - The timestamp in milliseconds.
         * @returns {string} The date string in the format "YYYY-MM-DD HH:MM:SS".
         */
        const date = new Date(this.createdAt);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
}

export default BankAccount

// module.exports = BankAccount;