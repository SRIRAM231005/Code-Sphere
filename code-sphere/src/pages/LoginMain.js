import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./LoginMain.css";

const Login = () => {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function FetchSignUp(username,email,password){
    try{
        const response = await fetch('http://localhost:5002/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password
            })
        });
        const data = await response.json();
        console.log(data);
    }catch(error){
        console.log("Error:",error);
    }
  };

  async function FetchLogin(email,password){
    try{
        const response = await fetch('http://localhost:5002/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                identifier: email,
                password: password
            })
        });
        const data = await response.json();
        console.log(data);
        localStorage.setItem('username', data.user.username);
        navigate('/messaging');
    }catch(error){
        console.log("Error:",error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignup) {
      alert("Sign Up submitted!");
      FetchSignUp(form.username, form.email, form.password);
    } else {
      alert("Login submitted!");
      FetchLogin(form.email, form.password);
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleSubmit}>
        <div className="login-title">{isSignup ? "Sign Up" : "Login"}</div>
        {isSignup && (
          <div className="login-input-group">
            <label className="login-label" htmlFor="username">
              Username
            </label>
            <input
              className="login-input"
              type="text"
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>
        )}
        <div className="login-input-group">
          <label className="login-label" htmlFor="email">
            Email
          </label>
          <input
            className="login-input"
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="login-input-group">
          <label className="login-label" htmlFor="password">
            Password
          </label>
          <input
            className="login-input"
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <button className="login-button" type="submit">
          {isSignup ? "Sign Up" : "Login"}
        </button>
        <div
          className="login-toggle"
          onClick={() => setIsSignup((prev) => !prev)}
        >
          {isSignup
            ? "Already have an account? Login"
            : "Don't have an account? Sign Up"}
        </div>
      </form>
    </div>
  );
};

export default Login;
