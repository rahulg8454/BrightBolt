import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../components/axios_instance';
import '../styles/signup.css';

const SignupPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    async function handleSignup(e) {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setTimeout(() => setError(""), 4000);
            return;
        }

        try {
                        const response = await axiosInstance.post("/api/user/register", {
                email,
                password
            });
            console.log(response.data);
            setSuccessMessage("Registration successful! Redirecting...");
            setTimeout(() => {
                navigate("/logging");
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
            setTimeout(() => setError(""), 4000);
        }
    }

    return (
        <div className="form-container">
            <div className="form">
                <h2>Signup</h2>
                <form onSubmit={handleSignup}>
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
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    {successMessage && <p className="success-message">{successMessage}</p>}
                    <button type="submit" className="form-btn">Signup</button>
                </form>
                <div className="redirect-link">
                    <p>Already have an account? <Link to="/logging">Login here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
