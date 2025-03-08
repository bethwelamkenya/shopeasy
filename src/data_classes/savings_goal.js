import Enums from "./enums";

const enums = new Enums()

class SavingsGoal {
    constructor(
        id = "",
        accountNumber = "",
        goalName = "",
        targetAmount = 0.0,
        savedAmount = 0.0,
        currency = enums.currencyTypes.USD,
        createdAt = Date.now(),
    ) {
        this.id = id
        this.accountNumber = accountNumber
        this.goalName = goalName
        this.targetAmount = targetAmount
        this.savedAmount = savedAmount
        this.currency = currency
        this.createdAt = createdAt
    }

    static fromJson(json){
        return new SavingsGoal(
            json.id,
            json.accountNumber,
            json.goalName,
            json.targetAmount,
            json.savedAmount,
            json.currency,
            json.createdAt
        )
    }

    getCurrency() {
        return enums.currencySymbols[this.currency]
    }

    savedAmountFormatted() {
        return `${this.getCurrency()}${this.savedAmount}`
    }

    targetAmountFormatted() {
        return `${this.getCurrency()}${this.targetAmount}`
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

export default SavingsGoal