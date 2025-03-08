const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require("bcrypt");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',  // Replace with your MySQL server host
    user: 'root',       // Replace with your MySQL username
    password: '9852',       // Replace with your MySQL password
    database: 'shopeasy'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
        return;
    }
    console.log('Connected to MySQL');
});

// Routes
app.get('/products', (req, res) => {
    const query = 'SELECT * FROM products';
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).send(err.message);
            return;
        }
        res.json(results);
    });
});

// Endpoint to fetch a single product by ID
app.get("/products/:id", (req, res) => {
    const productId = req.params.id;
    const query = "SELECT * FROM products WHERE id = ?";
    db.query(query, [productId], (err, results) => {
        if (err) {
            console.error("Error fetching product:", err.message);
            res.status(500).send("Internal Server Error");
            return;
        }

        if (results.length === 0) {
            res.status(404).send("Product not found");
            return;
        }

        res.json(results[0]); // Return the first (and only) result
    });
});

app.post('/signup', async (req, res) => {
    const {email, password, name} = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({success: false, message: "All fields are required"});
    }

    try {
        // Check if the user already exists
        db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
            if (err) {
                console.error("Error during signup:", err);
                return res.status(500).json({success: false, message: "Server error"});
            }

            if (results.length > 0) {
                return res.status(400).json({success: false, message: "User already exists"});
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert the new user into the database
            db.query(
                'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
                [email, hashedPassword, name],
                (insertErr, insertResults) => {
                    if (insertErr) {
                        console.error("Error inserting user:", insertErr);
                        return res.status(500).json({success: false, message: "Server error"});
                    }

                    // Fetch the newly created user
                    db.query(
                        'SELECT id, email, name FROM users WHERE id = ?',
                        [insertResults.insertId],
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

    // Replace this with your actual users table
    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [email], async (err, results) => {
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
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            res.status(401).json({success: false, message: "Invalid password"});
            return;
        }
        res.json({success: true, user: {id: user.id, email: user.email, name: user.name}});
    });
});

app.get('/user/:email', (req, res) => {
    const email = req.params.email;

    if (!email) {
        return res.status(400).json({success: false, message: 'Missing user email'});
    }

    // Replace this with your actual users table
    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [email], async (err, results) => {
        if (err) {
            console.error("Error fetching user:", err.message);
            res.status(500).json({success: false, message: "Internal server error"});
            return res.status(500).json({success: false, message: 'Error checking user'});
        }

        if (results.length === 0) {
            res.status(401).json({success: false, message: "Invalid email"});
            return res.status(401).json({success: false, message: 'Invalid email'});
        }

        const user = results[0];
        // res.json({success: true, user: {id: user.id, email: user.email, name: user.name}});
        return res.status(200).json({success: true, user: {id: user.id, email: user.email, name: user.name, timestamp: user.addedAt}});
    });
});


// Add item to cart
app.post('/cart', (req, res) => {
    const {productId, userId} = req.body;

    if (!productId || !userId) {
        return res.status(400).json({success: false, message: 'Missing product ID or user ID'});
    }

    // Query to check if the product already exists in the user's cart
    const checkQuery = 'SELECT * FROM cart WHERE userId = ? AND productId = ?';
    db.query(checkQuery, [userId, productId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({success: false, message: 'Error checking cart'});
        }

        if (results.length > 0) {
            return res.status(400).json({success: false, message: 'Item already in cart'});
        }

        // Insert product into the cart table
        const insertQuery = 'INSERT INTO cart (userId, productId) VALUES (?, ?)';
        db.query(insertQuery, [userId, productId], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({success: false, message: 'Error adding to cart'});
            }

            return res.status(200).json({success: true, message: 'Item added to cart'});
        });
    });
});

// Get items in the cart for a user
app.get('/cart/:userId', (req, res) => {
    const userId = req.params.userId;

    // Query to get all products in the user's cart, including productId
    const query = `
        SELECT c.id AS cartId, c.productId, p.name, p.description, p.price, p.image_url
        FROM cart c
                 JOIN products p ON c.productId = p.id
        WHERE c.userId = ?
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Error retrieving cart items' });
        }

        // If no items in the cart
        if (results.length === 0) {
            return res.status(200).json({ success: true, message: 'No items in cart', cartItems: [] });
        }

        // Return the cart items
        return res.status(200).json({ success: true, cartItems: results });
    });
});

// Remove an item from the cart
app.delete('/cart/remove', async (req, res) => {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
        return res.status(400).json({ success: false, message: 'User ID and Product ID are required' });
    }

    try {
        // Execute the delete query using the defined connection
        db.query(
            'DELETE FROM cart WHERE userId = ? AND productId = ?',
            [userId, productId],
            (err, result) => {
                if (err) {
                    console.error('Error removing item from cart:', err);
                    return res.status(500).json({ success: false, message: 'Error removing item from cart' });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({ success: false, message: `Item id ${productId} and user id ${userId} not found in cart` });
                }

                res.status(200).json({ success: true, message: 'Item removed from cart' });
            }
        );
    } catch (err) {
        console.error('Unexpected error removing item from cart:', err);
        res.status(500).json({ success: false, message: 'Unexpected error' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
