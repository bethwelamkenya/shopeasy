const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const FirebaseEncryptionHelper = require("./db_encryption_helper");
// const  = require("express");

const app = express();
const PORT = 5001;
const key = "xZK9Gr0l1uu45euMSl5W+A=="
const encryptor = new FirebaseEncryptionHelper(key)

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',  // Replace with your MySQL server host
    // user: process.env.db_user,       // Replace with your MySQL username
    user: 'root',       // Replace with your MySQL username
    password: '9852',       // Replace with your MySQL password
    database: 'finance_tracker'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
        return;
    }
    console.log('Connected to MySQL');
});

// Routes
app.get('/user', (req, res) => {
    const [email] = req.body
    const hashedEmail = encryptor.hashForFirebase(email)
    const query = 'SELECT * FROM users WHERE id = ?';
    db.query(query, hashedEmail, (err, results) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        res.json(results[0]);
    });
});

app.post('/signup', async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({success: false, message: "All fields are required"});
    }

    const hashedEmail = encryptor.hashForFirebase(email)
    const encryptedEmail = encryptor.encryptForFirebase(email)
    const salt = encryptor.generateSalt()
    const hashedPassword = encryptor.hashPassword(password, salt)

    try {
        // Check if the user already exists
        db.query('SELECT * FROM users WHERE id = ?', [hashedEmail], async (err, results) => {
            if (err) {
                console.error("Error during signup:", err);
                return res.status(500).json({success: false, message: "Server error"});
            }

            if (results.length > 0) {
                return res.status(400).json({success: false, message: "User already exists"});
            }

            // Insert the new user into the database
            db.query(
                'INSERT INTO users (id, email, passwordHash, salt) VALUES (?, ?, ?, ?)',
                [hashedEmail, encryptedEmail, hashedPassword, salt],
                (insertErr, insertResults) => {
                    if (insertErr) {
                        console.error("Error inserting user:", insertErr);
                        return res.status(500).json({success: false, message: "Server error"});
                    }

                    // Fetch the newly created user
                    db.query(
                        'SELECT * FROM users WHERE id = ?',
                        [hashedEmail],
                        (fetchErr, userResults) => {
                            if (fetchErr) {
                                console.error("Error fetching user details:", fetchErr);
                                return res.status(500).json({success: false, message: "Server error"});
                            }

                            if (userResults.length > 0) {
                                return res.status(201).json({
                                    success: true,
                                    user: userResults[0],
                                    message: "Successfully signed up"
                                });
                            } else {
                                return res.status(500).json({success: false, message: "User not found after signup"});
                            }
                        }
                    );
                }
            );
        });
    } catch (err) {
        console.error("Unexpected error during signup:", err);
        res.status(500).json({success: false, message: "Unexpected error occurred"});
    }
});

app.post("/login", (req, res) => {
    const {email, password} = req.body;
    console.log(email, password)
    const hashedEmail = encryptor.hashForFirebase(email)

    // Replace this with your actual users table
    const query = "SELECT * FROM users WHERE id = ?";
    db.query(query, [hashedEmail], async (err, results) => {
        if (err) {
            console.error("Error fetching user:", err.message);
            res.status(500).json({success: false, message: "Internal server error"});
            return;
        }

        if (results.length === 0) {
            res.status(401).json({success: false, message: "Invalid email"});
            return;
        }

        const user = results[0];
        const salt = user.salt
        const hashedPassword = encryptor.hashPassword(password, salt)
        const passwordMatch = hashedPassword === user.passwordHash;
        user.email = encryptor.decryptFromFirebase(user.email)

        if (!passwordMatch) {
            res.status(401).json({success: false, message: "Invalid password"});
            return;
        }
        res.json({success: true, user: user});
    });
});


app.post('/accounts', (req, res) => {
    try {
        const {email, accountNumber, holderName, bankName, balance, currency} = req.body;

        // Validation
        if (!email || !accountNumber || !holderName || !bankName || !currency || typeof balance !== 'number') {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields or invalid data types'
            });
        }

        const hashedEmail = encryptor.hashForFirebase(email)
        // const encryptedEmail = encryptor.encryptForFirebase(email)
        const hashedAccountNumber = encryptor.hashForFirebase(accountNumber)
        const newAccount = {
            accountNumber: encryptor.encryptForFirebase(accountNumber),
            holderName: encryptor.encryptForFirebase(holderName),
            bankName: bankName,
            balance: balance,
            currency: currency,
            createdAt: Date.now(),
        };

        // Check if account exists
        const query = 'SELECT * FROM bank_accounts WHERE id = ?';
        db.query(query, hashedAccountNumber, (err, results) => {
            if (err) {
                res.status(500).send(err.message);
                return;
            }
            if (results.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Account number already exists'
                });
            }

            // Insert the new account into the database
            db.query(
                `INSERT INTO bank_accounts
                     (id, accountNumber, holderName, bankName, balance, currency, userEmail)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [hashedAccountNumber, newAccount.accountNumber, newAccount.holderName, newAccount.bankName, newAccount.balance, newAccount.currency, hashedEmail],
                (insertErr, insertResults) => {
                    if (insertErr) {
                        console.error("Error inserting account:", insertErr);
                        return res.status(500).json({success: false, message: "Server error"});
                    }

                    // Fetch the newly created user
                    db.query(
                        'SELECT * FROM bank_accounts WHERE id = ?',
                        [hashedAccountNumber],
                        (fetchErr, accountResults) => {
                            if (fetchErr) {
                                console.error("Error fetching account details:", fetchErr);
                                return res.status(500).json({success: false, message: "Server error"});
                            }

                            if (accountResults.length > 0) {
                                return res.status(201).json({
                                    success: true,
                                    account: accountResults[0],
                                    message: "Successfully created an account"
                                });
                            } else {
                                return res.status(500).json({
                                    success: false,
                                    message: "Account not found after creating"
                                });
                            }
                        }
                    );
                }
            );
        });
    } catch (error) {
        console.error('Error creating account:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Updated GET endpoint
app.get('/accounts/:email', async (req, res) => {
    const email = req.params.email
    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'Missing required email'
        });
    }
    const hashedEmail = encryptor.hashForFirebase(email)
    try {
        const query = 'SELECT * FROM bank_accounts WHERE userEmail = ? ORDER BY createdAt DESC'
        db.query(query, [hashedEmail], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({success: false, message: 'Error retrieving accounts'});
            }

            // If no items in the cart
            if (results.length === 0) {
                console.log('length = 0')
                return res.status(200).json({success: true, message: 'No accounts for user found', accounts: []});
            }

            const decryptedAccount = results.map(acc => ({
                accountNumber: encryptor.decryptFromFirebase(acc.accountNumber),
                holderName: encryptor.decryptFromFirebase(acc.holderName),
                bankName: acc.bankName,
                balance: acc.balance,
                currency: acc.currency,
                createdAt: acc.createdAt,
            }))
            return res.status(200).json({success: true, accounts: decryptedAccount});
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'Failed to fetch accounts'});
    }
});


app.post('/savings', (req, res) => {
    try {
        const {email, accountNumber, goalName, targetAmount, currency} = req.body;

        // Validation
        if (!email || !accountNumber || !goalName || !currency || typeof targetAmount !== 'number') {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields or invalid data types'
            });
        }

        const hashedEmail = encryptor.hashForFirebase(email)
        const hashedGoalName = encryptor.hashForFirebase(goalName)
        const newGoal = {
            accountNumber: encryptor.encryptForFirebase(accountNumber),
            goalName: encryptor.encryptForFirebase(goalName),
            targetAmount: targetAmount,
            currency: currency,
            createdAt: Date.now(),
        };

        // Check if account exists
        const query = 'SELECT * FROM savings_goals WHERE id = ?';
        db.query(query, hashedGoalName, (err, results) => {
            if (err) {
                res.status(500).send(err.message);
                return;
            }
            if (results.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Savings Goals already exists'
                });
            }

            // Insert the new account into the database
            db.query(
                `INSERT INTO savings_goals
                     (id, accountNumber, goalName, targetAmount, currency, userEmail)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [hashedGoalName, newGoal.accountNumber, newGoal.goalName, newGoal.targetAmount, newGoal.currency, hashedEmail],
                (insertErr, insertResults) => {
                    if (insertErr) {
                        console.error("Error inserting goal:", insertErr);
                        return res.status(500).json({success: false, message: "Server error"});
                    }

                    // Fetch the newly created user
                    db.query(
                        'SELECT * FROM savings_goals WHERE id = ?',
                        [hashedGoalName],
                        (fetchErr, goalResults) => {
                            if (fetchErr) {
                                console.error("Error fetching goal details:", fetchErr);
                                return res.status(500).json({success: false, message: "Server error"});
                            }

                            if (goalResults.length > 0) {
                                return res.status(201).json({
                                    success: true,
                                    goal: goalResults[0],
                                    message: "Successfully created savings goal"
                                });
                            } else {
                                return res.status(500).json({
                                    success: false,
                                    message: "Goal not found after creating"
                                });
                            }
                        }
                    );
                }
            );
        });
    } catch (error) {
        console.error('Error creating goal:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Updated GET endpoint
app.get('/savings/:email', async (req, res) => {
    const email = req.params.email
    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'Missing required email'
        });
    }
    const hashedEmail = encryptor.hashForFirebase(email)
    try {
        const query = 'SELECT * FROM savings_goals WHERE userEmail = ? ORDER BY createdAt DESC'
        db.query(query, [hashedEmail], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({success: false, message: 'Error retrieving goals'});
            }

            // If no items in the cart
            if (results.length === 0) {
                console.log('length = 0')
                return res.status(200).json({success: true, message: 'No goals for user found', goals: []});
            }

            const decryptedGoals = results.map(acc => ({
                accountNumber: encryptor.decryptFromFirebase(acc.accountNumber),
                goalName: encryptor.decryptFromFirebase(acc.goalName),
                savedAmount: acc.savedAmount,
                targetAmount: acc.targetAmount,
                currency: acc.currency,
                createdAt: acc.createdAt,
            }))
            return res.status(200).json({success: true, goals: decryptedGoals});
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'Failed to fetch goals'});
    }
});

app.post('/transactions', async (req, res) => {
    try {
        const {email, accountNumber, type, amount, targetAccountNumber, targetUserEmail, currency} = req.body;

        // Validation
        if (!email || !accountNumber || !type || !currency || typeof amount !== 'number') {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields or invalid data types'
            });
        }

        const hashedEmail = encryptor.hashForFirebase(email)
        const hashedAccount = encryptor.hashForFirebase(accountNumber)
        const newTransaction = {
            accountNumber: encryptor.encryptForFirebase(accountNumber),
            type: type,
            amount: amount,
            targetAccountNumber: encryptor.encryptForFirebase(targetAccountNumber),
            targetUserEmail: encryptor.encryptForFirebase(targetUserEmail),
            currency: currency,
            userEmail: hashedEmail
        }

        const theResults = deposit_withdraw(newTransaction.userEmail, newTransaction.type, newTransaction.amount, hashedAccount)
        const results = await theResults
        console.log(results)
        if (results === true) {
            // Insert the new account into the database
            db.query(
                `INSERT INTO transactions
                 (accountNumber, type, amount, targetAccountNumber, targetUserEmail, currency, userEmail)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [newTransaction.accountNumber, newTransaction.type, newTransaction.amount, newTransaction.targetAccountNumber, newTransaction.targetUserEmail, newTransaction.currency, newTransaction.userEmail],
                (insertErr, insertResults) => {
                    if (insertErr) {
                        console.error("Error inserting transaction:", insertErr);
                        return res.status(500).json({success: false, message: "Server error"});
                    }

                    // Fetch the newly created user
                    db.query(
                        'SELECT * FROM transactions WHERE id = ?',
                        [insertResults.insertId],
                        (fetchErr, transactionResults) => {
                            if (fetchErr) {
                                console.error("Error fetching transaction details:", fetchErr);
                                return res.status(500).json({success: false, message: "Server error"});
                            }
                            if (transactionResults.length > 0) {
                                return res.status(201).json({
                                    success: true,
                                    transaction: transactionResults[0],
                                    message: "Successfully created transaction"
                                });
                            } else {
                                return res.status(500).json({
                                    success: false,
                                    message: "Transaction not found after creating"
                                });
                            }
                        }
                    );
                }
            );
        } else {
            res.status(500).json({
                success: results,
                message: 'Internal server error'
            })
        }
    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// function f() : boolean {
//     return true
// }

async function deposit_withdraw(email = '', type = encryptor.transactionTypes.WITHDRAW, amount = 0.0, account = ''){
    try {
        db.query(
            `SELECT *
             FROM bank_accounts
             WHERE id = ?`,
            [account],
            (fetchError, accountResults) => {
                if (fetchError) {
                    console.error("Error fetching account details:", fetchError);
                    return false
                }
                if (accountResults.length > 0) {
                    const currentBalance = accountResults[0].balance
                    let finalBalance = 0.0
                    if (type === encryptor.transactionTypes.DEPOSIT || type === encryptor.transactionTypes.TRANSFER_IN || type === encryptor.transactionTypes.TRANSFER_IN_FROM) {
                        finalBalance = currentBalance + amount
                    } else if (type === encryptor.transactionTypes.WITHDRAW || type === encryptor.transactionTypes.TRANSFER_OUT || type === encryptor.transactionTypes.TRANSFER_OUT_TO) {
                        if (currentBalance < amount) {
                            return false
                        }
                        finalBalance = currentBalance - amount
                    }
                    db.query(
                        `UPDATE bank_accounts
                         SET balance = ?
                         where id = ?`,
                        [finalBalance, account],
                        (updateError, updateResults) => {
                            if (updateError) {
                                console.error("Error updating account details:", fetchError);
                                return false
                            }
                            console.log(updateResults)
                            return updateResults.affectedRows > 0;
                        }
                    )
                } else {
                    return false
                }
            }
        )
    } catch (e) {
        return false
    }
}

// Updated GET endpoint
app.get('/transactions/:email', async (req, res) => {
    const email = req.params.email
    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'Missing required email'
        });
    }
    const hashedEmail = encryptor.hashForFirebase(email)
    try {
        const query = 'SELECT * FROM transactions WHERE userEmail = ? ORDER BY timestamp DESC'
        db.query(query, [hashedEmail], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({success: false, message: 'Error retrieving transactions'});
            }

            // If no items in the cart
            if (results.length === 0) {
                console.log('length = 0')
                return res.status(200).json({
                    success: true,
                    message: 'No transactions for user found',
                    transactions: []
                });
            }

            const decryptedTransactions = results.map(transaction => ({
                id: transaction.id,
                accountNumber: encryptor.decryptFromFirebase(transaction.accountNumber),
                type: transaction.type,
                amount: transaction.amount,
                targetAccountNumber: encryptor.decryptFromFirebase(transaction.targetAccountNumber),
                targetUserEmail: encryptor.decryptFromFirebase(transaction.targetUserEmail),
                currency: transaction.currency,
                timestamp: transaction.timestamp,
            }))
            return res.status(200).json({success: true, transactions: decryptedTransactions});
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'Failed to fetch goals'});
    }
});


// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});