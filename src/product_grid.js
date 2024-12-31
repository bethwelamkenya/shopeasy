import React from 'react';
import {useNavigate} from "react-router-dom";

const ProductGrid = ({products}) => {

    const navigate = useNavigate();

    const handleViewDetails = (productId) => {
        navigate(`/product/${productId}`); // Redirect to the product details page
    };

    return (
        <div>
            <h1 className="product-grid__title">Products</h1>
            <div className="product-grid">
                {products.length > 0 ? (
                    products.map((product) => (
                        <div key={product.id} className="product-card">
                            <img src={product.image_url} alt={product.name}/>
                            <h3>{product.name}</h3>
                            <p>{product.description}</p>
                            <p>${product.price.toFixed(2)}</p>
                            <button className="product-card__button"
                                    onClick={() => handleViewDetails(product.id)}
                            >Details
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="loading-container">
                        <p className="loading-text">
                            Loading products
                            <span className="loading-dots">
                            <span>.</span>
                            <span>.</span>
                            <span>.</span>
                        </span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductGrid;
