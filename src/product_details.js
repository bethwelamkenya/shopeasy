// product_details.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Check if the user is logged in
    const isLoggedIn = localStorage.getItem('user') !== null;

    useEffect(() => {
        // Replace with your actual API endpoint to fetch product details
        fetch(`http://localhost:5000/products/${id}`)
            .then((response) => response.json())
            .then((data) => setProduct(data))
            .catch((error) => console.error("Error fetching product details:", error));
    }, [id]);

    const handleAddToCart = async () => {
        if (!isLoggedIn) {
            setError('You must be logged in to add items to your cart.');
            return;
        }

        setIsAdding(true);
        setError(null);

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const response = await axios.post('http://localhost:5000/cart', {
                productId: product.id,
                userId: user.id,
            });

            if (response.data.success) {
                setSuccessMessage('Item added to cart!');
            } else {
                setError('An error occurred while adding to the cart.');
            }
        } catch (err) {
            const serverMessage = err.response?.data?.message || err.message;
            setError(serverMessage);
            // setError('An error occurred while adding to the cart: ' + err.message);
        }

        setIsAdding(false);
    };

    return (
        <div>
            {product ? (
                <div>
                    <h1>{product.name}</h1>
                    <img src={product.image_url} alt={product.name} />
                    <p>Price: ${product.price}</p>
                    <p>Description: {product.description}</p>

                    {error && <div style={{ color: 'red' }}>{error}</div>}
                    {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}

                    <button onClick={handleAddToCart} disabled={isAdding}>
                        {isAdding ? 'Adding to cart...' : 'Add to Cart'}
                    </button>
                </div>
            ) : (
                <div className="loading-container">
                    <p className="loading-text">
                        Loading product details
                        <span className="loading-dots">
                            <span>.</span>
                            <span>.</span>
                            <span>.</span>
                        </span>
                    </p>
                </div>
                )}
        </div>
    );
};

export default ProductDetails;
