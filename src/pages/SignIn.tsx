import { useState } from 'react';
import { Link } from 'react-router-dom';
import './AuthStyles.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign in logic
    console.log('Signing in with:', { email, password });
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <Link to="/" className="back-to-home">
          &larr; Back to Home
        </Link>
        <h1>Engineering Resources Reimagined</h1>
        <p>The most comprehensive platform for engineering students</p>
      </div>

      <div className="auth-card">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
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
          <button type="submit" className="primary-button">Sign In</button>
        </form>
        <div className="auth-footer">
          <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
          <p className="text-center mt-4">
            <Link to="/" className="text-blue-600 hover:underline">
              Return to Home Page
            </Link>
          </p>
        </div>
      </div>

      <div className="stats-container">
        <div className="stat-item">
          <h3>10K+</h3>
          <p>Question Papers</p>
        </div>
        <div className="stat-item">
          <h3>50+</h3>
          <p>Universities</p>
        </div>
        <div className="stat-item">
          <h3>100K+</h3>
          <p>Students</p>
        </div>
        <div className="stat-item">
          <h3>5K+</h3>
          <p>Study Materials</p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;