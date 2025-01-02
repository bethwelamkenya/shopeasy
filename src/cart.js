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

    const handleRemoveFromCart = async (productId) => {
        try {
            const response = await axios.delete(`http://localhost:5000/cart/remove`, {
                data: {
                    userId,
                    productId
                }
            });

            if (response.data.success) {
                // Optionally, you could remove the item from the local state without needing to refetch
                // For example, filtering out the removed item:
                setCartItems(cartItems.filter(item => item.productId !== productId));
            }
        } catch (error) {
            const serverMessage = error.response?.data?.message || error.message;
            alert(serverMessage);
            console.error('Error removing item from cart:', error);
            // alert('An error occurred while removing the item from the cart.');
        }
    };

    return (
        <div className="cart-container">
            <h1 className="cart-header">Your Cart</h1>

            {error && <div className="error-message">{error}</div>}

            {cartItems.length === 0 ? (
                <p className="empty-cart-message">Your cart is empty. Start shopping now!</p>
            ) : (
                <div>
                    {cartItems.map((item) => (
                        <div key={item.cartID} className="cart-item">
                            <img src={item.image_url} alt={item.name} />
                            <div>
                                <h3>{item.name}</h3>
                                <p>{item.description}</p>
                                <p className="item-price">${item.price}</p>
                            </div>
                            <button className="remove-btn"  onClick={() => handleRemoveFromCart(item.productId)}>Remove</button>
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
