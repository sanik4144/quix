import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState({ message: "", remarks: "" });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/auth/login', { email, password });
            login(res.data.user, res.data.token);
            
            // Redirect based on role
            const role = res.data.user.role;
            if (role === 'Super Admin' || role === 'Admin') navigate('/admin');
            else if (role === 'Instructor') navigate('/instructor');
            else navigate('/student');
        } catch (err) {
            setError({
                message: err.response?.data?.message || 'Login failed',
                remarks: err.response?.data?.remarks || 'No remarks'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="logo-icon">
                        <LogIn size={32} />
                    </div>
                    <h1>Welcome Back</h1>
                    <p>Login to access your Quix dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error.message && <div className="error-message">{error.message}</div>}
                    {error.remarks && <div className="error-message">Reason: {error.remarks}</div>}
                    
                    <div className="input-group">
                        <label>Email Address</label>
                        <div className="input-wrapper">
                            <Mail className="input-icon" size={20} />
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <div className="input-wrapper">
                            <Lock className="input-icon" size={20} />
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Login'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Don't have an account? <Link to="/register">Create an account</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
