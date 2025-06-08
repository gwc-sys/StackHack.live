import { useState } from 'react';
import { Link } from 'react-router-dom';
import './AuthStyles.css';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [branch, setBranch] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign up logic
    console.log('Signing up with:', { name, email, password, branch });
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1>Engineering Resources Reimagined</h1>
        <p>The most comprehensive platform for engineering students</p>
      </div>

      <div className="auth-card">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
            <label htmlFor="branch">Your Branch</label>
            <input
              type="text"
              id="branch"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              placeholder="Search for your branch..."
              required
            />
          </div>
          <button type="submit" className="primary-button">Sign Up</button>
        </form>
        <div className="auth-footer">
          <p>Already have an account? <Link to="/signin">Sign In</Link></p>
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

export default SignUp;