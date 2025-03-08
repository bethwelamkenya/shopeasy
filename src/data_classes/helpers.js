class Helpers {
    createInstanceFromJson(Class, json) {
        if (!json) return null
        return new Class(...Object.values(json))
    }

    truncateString(str, visibleChars = 4) {
        /**
         * Truncates a string to display the last 'visibleChars' characters,
         * preceded by "...".
         *
         * @param {string} str - The string to truncate.
         * @param {number} visibleChars - The number of characters to display at the end.
         * @returns {string} The truncated string.
         */

        if (str.length <= visibleChars) {
            return str; // No need to truncate if the string is short enough
        }

        const truncated = str.substring(str.length - visibleChars);
        return `...${truncated}`;
    }
}

export default Helpers