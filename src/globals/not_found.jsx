import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import './not_found.css'

function NotFound() {
    const navigate = useNavigate(); // Define navigate
    const [countdown, setCountdown] = useState(5); // Start countdown at 5 seconds
    const handleGoHome = async (e) => {
        navigate("/"); // Redirect to home page
    }


    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown((prev) => prev - 1); // Decrease countdown by 1 every second
        }, 1000);

        // Redirect when countdown reaches 0
        if (countdown === 0) {
            navigate("/");
        }

        return () => clearInterval(interval); // Cleanup interval
    }, [countdown, navigate]);

    return (
        <div className="centered-div">
            <h1 style={styles.heading}>404</h1>
            <p style={styles.message}>Oops! The page you are looking for does not exist.</p>
            <p style={styles.message}>Redirecting to the homepage in <span
                style={styles.countdown}>{countdown}</span> seconds...</p>
            <button onClick={handleGoHome}>Go Home</button>
        </div>
    )
}

const styles = {
    container: {
        textAlign: "center",
        marginTop: "100px",
    },
    heading: {
        fontSize: "80px",
        color: "linear-gradient(to right, #1A6DFF, #C822FF)",
    },
    message: {
        fontSize: "20px",
        color: "var(--text-color)",
    },
    link: {
        marginTop: "20px",
        display: "inline-block",
        fontSize: "18px",
        color: "#1A6DFF",
        textDecoration: "none",
        border: "1px solid #1A6DFF",
        borderRadius: "5px",
        padding: "10px 20px",
    },
    countdown: {
        fontWeight: "bold",
        color: "#C822FF",
    },
};
export default NotFound;