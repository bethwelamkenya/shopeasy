import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // Define setLoading
    const navigate = useNavigate(); // Define navigate
    const [user, setUser] = useState(null); // Define setUser

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors
        setLoading(true);

        try {
            const response = await axios.post("http://localhost:5000/login", {email, password});

            if (response.data.success) {
                console.log("User logged in:", response.data.user);
                setUser(response.data.user); // Save user details
                // Save user data to localStorage
                localStorage.setItem("user", JSON.stringify(response.data.user));
                localStorage.setItem("isLoggedIn", "true");

                navigate("/"); // Redirect
            } else {
                throw new Error(response.data.message || "Login failed");
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
            <form className="login-form" onSubmit={handleLogin}>
                <h2>Login</h2>
                {error && <p className="error">{error}</p>}
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"

                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-a"><a href="/signup">Don't have an account? <span>Sign Up</span></a></div>

                <button type="submit" className="login-btn">
                    Log In
                </button>
            </form>
        </div>
    );
};

export default Login;
