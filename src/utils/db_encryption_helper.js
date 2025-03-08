const crypto = require('crypto');
const {Buffer} = require('buffer');

class FirebaseEncryptionHelper {
    constructor(secretKey) {
        this.secretKey = this.getSecretKey(secretKey);
        this.AES_MODE = 'aes-256-gcm';
        this.IV_SIZE = 12;
        this.TAG_LENGTH = 16; // 128 bits
        this.algorithm = 'pbkdf2';
        this.iterations = 10000;
        this.keyLength = 32; // 256 bits
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
    }

    getSecretKey(key) {
        const digest = crypto.createHash('sha256')
        digest.update(key)
        return digest.digest()
    }

    // 🔐 Firebase-safe SHA-256 hash
    hashForFirebase(input) {
        const hash = crypto.createHash('sha256').update(input).digest();
        return this.toFirebaseBase64(hash);
    }

    // 🔒 AES-GCM Encryption (Firebase-safe)
    encryptForFirebase(data) {
        if (!data) {
            return ''
        }
        const iv = crypto.randomBytes(this.IV_SIZE);
        const cipher = crypto.createCipheriv(this.AES_MODE, this.secretKey, iv, {
            authTagLength: this.TAG_LENGTH
        });

        let encrypted = cipher.update(data, 'utf8');
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        const tag = cipher.getAuthTag();

        const combined = Buffer.concat([iv, encrypted, tag]);
        return this.toFirebaseBase64(combined);
    }

    // 🔓 AES-GCM Decryption
    decryptFromFirebase(encryptedData) {
        if (!encryptedData) return ''
        const buffer = Buffer.from(encryptedData, 'base64');
        const iv = buffer.subarray(0, this.IV_SIZE);
        const tag = buffer.subarray(-this.TAG_LENGTH);
        const encrypted = buffer.subarray(this.IV_SIZE, -this.TAG_LENGTH);

        const decipher = crypto.createDecipheriv(this.AES_MODE, this.secretKey, iv, {
            authTagLength: this.TAG_LENGTH
        });

        decipher.setAuthTag(tag);
        let decrypted = decipher.update(encrypted, null, 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    }

    // 🔑 Password hashing utilities
    generateSalt() {
        return crypto.randomBytes(16).toString('base64');
    }

    hashPassword(password, salt) {
        return crypto.pbkdf2Sync(
            password,
            Buffer.from(salt, 'base64'),
            this.iterations,
            this.keyLength,
            'sha256'
        ).toString('base64');
    }

    // 🛠️ Firebase-safe Base64 encoding
    toFirebaseBase64(buffer) {
        return buffer.toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }

    // 🔄 For key derivation (if needed)
    static deriveKey(password, salt) {
        return crypto.pbkdf2Sync(
            password,
            salt,
            10000,
            32,
            'sha256'
        );
    }
}

module.exports = FirebaseEncryptionHelper;
