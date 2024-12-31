import React, {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const Account = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate(); // Define navigate
    return (<div>
        <h1>Account</h1>
    </div>);
};

export default Account;