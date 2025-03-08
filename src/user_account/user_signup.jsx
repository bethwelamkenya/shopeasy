import React, { useState } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import './user_signup.css'
import enter from '../app_images/enter_2.svg'
import spinner from '../app_images/spinner_frame_1.svg'
import {Icon} from "../globals/icon";

export const UserSignup = () => {
    const [loading, setLoading] = useState(false); // Define setLoading
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [passwordHash, setPasswordHash] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate(); // Define navigate

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const response = await axios.post("http://localhost:8080/users/signup", {
                name: name,
                email: email,
                passwordHash: passwordHash,
            });

            if (response.status === 200 && response.data) {
                setSuccess(response.data);
                console.log("User signed up:", response.data);
                setEmail("");
                setPasswordHash("");
                setName('')

                // Save user data to localStorage
                localStorage.setItem("user", JSON.stringify(response.data));
                localStorage.setItem("isLoggedIn", "true");
                navigate("/"); // Redirect to home page
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message); // Display server error message
            } else {
                setError("An error occurred during signup. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <form onSubmit={handleSignUp}>
                <h2>Sign Up</h2>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={passwordHash}
                        onChange={(e) => setPasswordHash(e.target.value)}
                        required
                    />
                </div>
                <a href="/user_login">Already have an account? <span>Log In</span></a>
                <button type="submit" className="login-btn">
                    {loading ? (
                            <Icon src={spinner} rotatingIcon={true} backgroundColor={"var(--body-background)"}/>
                        )
                        : (
                            <Icon src={enter} backgroundColor={"var(--body-background)"}/>
                        )
                    }Sign Up
                </button>
            </form>
        </div>
    );
}