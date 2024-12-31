import React, {useEffect, useState} from 'react';
import './App.css';
import ProductsGrid from './product_grid';
import Header from "./header";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import ProductDetails from "./product_details";
import Login from "./login";
import Signup from "./signup";
import ProtectedRoute from "./protected_route";
import Account from "./account";
import Cart from "./cart";

function App() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // Fetch product data from the backend
        fetch('http://localhost:5000/products')
            .then((response) => response.json())
            .then((data) => {
                setProducts(data);
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
            });
    }, []);

    return (
        <div className="App">
            <Header/>
            <Router>
                <Routes>
                    <Route path="/" element={<ProductsGrid products={products}/>}/>
                    <Route path="/product/:id" element={<ProductDetails/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/signup" element={<Signup/>}/>
                    <Route path="/account" element={<ProtectedRoute> <Account/> </ProtectedRoute>}/>
                    <Route path="/cart" element={<ProtectedRoute> <Cart/> </ProtectedRoute>}/>
                </Routes>
            </Router>
        </div>
    );
}

export default App;
