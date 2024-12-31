import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState(null);
    const userId = JSON.parse(localStorage.getItem('user'))?.id;

    useEffect(() => {
        if (!userId) {
            setError('You must be logged in to view your cart.');
            return;
        }

        const fetchCartItems = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/cart/${userId}`);
                if (response.data.success) {
                    setCartItems(response.data.cartItems);
                } else {
                    setError(response.data.message);
                }
            } catch (err) {
                setError('An error occurred while fetching the cart items: ' + err.message);
            }
        };

        fetchCartItems();
    }, [userId]);

    return (
        <div className="cart-container">
            <h1 className="cart-header">Your Cart</h1>

            {error && <div className="error-message">{error}</div>}

            {cartItems.length === 0 ? (
                <p className="empty-cart-message">Your cart is empty. Start shopping now!</p>
            ) : (
                <div>
                    {cartItems.map((item) => (
                        <div key={item.id} className="cart-item">
                            <img src={item.image_url} alt={item.name} />
                            <div>
                                <h3>{item.name}</h3>
                                <p>{item.description}</p>
                                <p className="item-price">${item.price}</p>
                            </div>
                            <button className="remove-btn">Remove</button>
                        </div>
                    ))}
                    <div className="cart-summary">
                        <p>Total: ${cartItems.reduce((total, item) => total + item.price, 0).toFixed(2)}</p>
                        <button className="remove-btn">Proceed to Checkout</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
