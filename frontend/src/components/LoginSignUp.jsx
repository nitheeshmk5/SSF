import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginSignUp = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    //const API_URL = "http://192.168.194.154:5000"; // Dharshan
    const API_URL = "http://192.168.0.101:5000"; // HOME
    const url = isLogin ? `${API_URL}/login` : `${API_URL}/register`;

    /* const url = isLogin
      ? "http://localhost:5000/login"
      : "http://localhost:5000/register"; */
    try {
      const { data } = await axios.post(url, { email, password });
      alert(data.message);
      if (isLogin) {
        localStorage.setItem("user", email);
        navigate("/budget");
      } else {
        setIsLogin(true);
        setEmail(""); // Clear fields after signup
        setPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-900 to-dark-800 p-4">
      <div className="max-w-md w-full bg-dark-800 p-8 rounded-xl shadow-2xl transform transition-all duration-500 hover:scale-105">
        <h2 className="text-3xl font-bold text-center text-text-100 mb-6 tracking-tight">
          {isLogin ? "Welcome Back" : "Join Us"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-4 border border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-600 bg-dark-700 text-text-100 placeholder-text-500 transition-all duration-300"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-4 border border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-600 bg-dark-700 text-text-100 placeholder-text-500 transition-all duration-300"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full p-4 border border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-600 bg-dark-700 text-text-100 placeholder-text-500 transition-all duration-300"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              required
            />
          )}
          {error && (
            <p className="text-danger-600 text-sm text-center">{error}</p>
          )}
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-text-100 rounded-lg disabled:opacity-50 transition-all duration-300 hover:from-primary-700 hover:to-accent-700 shadow-md"
            disabled={loading}
          >
            {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        {/* Demo Note - Shown only on Login Page */}
        {isLogin && (
          <p className="mt-4 text-text-400 text-sm text-center">
            Demo:{" "}
            <span className="font-medium text-text-300">muthu@gmail.com</span> /{" "}
            <span className="font-medium text-text-300">123</span>
          </p>
        )}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="mt-6 w-full text-accent-600 hover:text-accent-700 transition-all duration-300 font-medium"
        >
          {isLogin
            ? "Need an account? Sign Up"
            : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
};

export default LoginSignUp;
