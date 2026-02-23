import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../components/axios_instance';
import '../styles/adminLogin.css';

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    // Function to handle form submission
    async function handleLogin(e) {
        e.preventDefault();

        try {
            const response = await axiosInstance.post("/api/login", {
                email,
                password
            });
            console.log(response.data);
            // Save the token to localStorage
            if (response.data.token) {
                localStorage.setItem('adminToken', response.data.token);
            }
            setSuccessMessage("Login successful! Redirecting...");
            setTimeout(() => {
                navigate("/dashboard");
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Invalid credentials");
            setTimeout(() => setError(""), 4000);
        }
    }

    return (
        <div className="form-container">
            <div className="form">
                <h2>Admin Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    {successMessage && <p className="success-message">{successMessage}</p>}
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
