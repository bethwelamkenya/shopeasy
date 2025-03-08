class User {
    constructor(
        id = "",
        email = "",
        passwordHash = "",
        salt = "",
        createdAt = Date.now()
    ) {
        this.id = id
        this.email = email
        this.passwordHash = passwordHash
        this.salt = salt
        this.createdAt = createdAt
    }

    static fromJson(json){
        return new User(
            json.id,
            json.email,
            json.passwordHash,
            json.salt,
            json.createdAt
        )
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

export default User