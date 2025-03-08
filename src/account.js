import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const Account = () => {
    const user = JSON.parse(localStorage.getItem("user"))
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState("");
    const navigate = useNavigate(); // Define navigate
    const [cartItems, setCartItems] = useState([]);
    const [serverUser, setServerUser] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/user/${user.email}`);
                if (response.data.success) {
                    setServerUser(response.data.user)
                } else {
                    setError(response.data.message);
                }
            } catch (e) {
                setError('An error occurred while fetching the user: ' + e.message)
            }
        }
        const fetchCartItems = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/cart/${user.id}`);
                if (response.data.success) {
                    setCartItems(response.data.cartItems);
                } else {
                    setError(response.data.message);
                }
            } catch (err) {
                setError('An error occurred while fetching the cart items: ' + err.message);
            }
        };
        fetchUser();
        fetchCartItems();
    }, [user]);

    const handleLogOut = async (e) => {
        localStorage.removeItem("user")
        localStorage.setItem("isLoggedIn", "false")
        navigate("/")
    }

    return (
        <div className="account-container">
            <h1>Account</h1>
            {error && <p className="error">{error}</p>}
            <table className="account-table">
                <thead>
                <tr>
                    <td rowSpan="2">User Details</td>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <th>Name:</th>
                    <td>{serverUser.name}</td>
                </tr>
                <tr>
                    <th>Email:</th>
                    <td>{serverUser.email}</td>
                </tr>
                <tr>
                    <th>Joined:</th>
                    <td>{serverUser.timestamp}</td>
                </tr>
                </tbody>
            </table>
            <div className="centered-div">
                <button onClick={handleLogOut}>Log Out</button>
            </div>
        </div>
    );
};

export default Account;