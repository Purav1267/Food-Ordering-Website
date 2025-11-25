import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Login.css';

const Login = ({ setToken, setStallOwner, url }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    stallName: '',
    phone: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const response = await axios.post(`${url}/api/stall-owner/login`, {
          email: formData.email,
          password: formData.password
        });
        if (response.data.success) {
          localStorage.setItem('stallOwnerToken', response.data.token);
          localStorage.setItem('stallOwner', JSON.stringify(response.data.stallOwner));
          setToken(response.data.token);
          setStallOwner(response.data.stallOwner);
          toast.success('Login successful!');
          navigate('/dashboard');
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(`${url}/api/stall-owner/register`, formData);
        if (response.data.success) {
          localStorage.setItem('stallOwnerToken', response.data.token);
          localStorage.setItem('stallOwner', JSON.stringify(response.data.stallOwner));
          setToken(response.data.token);
          setStallOwner(response.data.stallOwner);
          toast.success('Registration successful!');
          navigate('/dashboard');
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="stall-login">
      <div className="stall-login-container">
        <h1>{isLogin ? 'Stall Owner Login' : 'Stall Owner Registration'}</h1>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="stallName"
                placeholder="Stall Name"
                value={formData.stallName}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
              />
            </>
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
        </form>
        <p onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
};

export default Login;

