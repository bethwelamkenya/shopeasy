import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import './user_login.css'
import enter from '../app_images/enter_2.svg'
import spinner from '../app_images/spinner_frame_1.svg'
import {Icon} from "../globals/icon";

export const UserLogin = () => {
    const [email, setEmail] = useState("");
    const [passwordHash, setPasswordHash] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // Define setLoading
    const navigate = useNavigate(); // Define navigate
    const [user, setUser] = useState(null); // Define setUser
    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors
        setLoading(true);

        try {
            const response = await axios.post("http://localhost:8080/users/login", {
                email: email, passwordHash: passwordHash
            });

            // Check if the response contains the user object
            if (response.status === 200 && response.data) {
                console.log("User logged in:", response.data);
                setUser(response.data); // Save user details

                // Save user data to localStorage
                localStorage.setItem("user", JSON.stringify(response.data));
                localStorage.setItem("isLoggedIn", "true");

                navigate("/"); // Redirect to homepage
            } else {
                setError("Login failed. Please try again.");
            }
        } catch (err) {
            const serverMessage = err.response?.data?.message || err.message;
            setError(serverMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleLogin}>
                <h2>Login</h2>
                {error && <p className="error">{error}</p>}
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
                <a href="/user_signup">Dont have an account? <span>Sign Up</span></a>

                <button type="submit">
                    {loading ? (
                            <Icon src={spinner} rotatingIcon={true} backgroundColor={"var(--body-background)"}/>
                        )
                        : (
                            <Icon src={enter} backgroundColor={"var(--body-background)"}/>
                        )
                    }Log In
                </button>
            </form>
        </div>
    );
}