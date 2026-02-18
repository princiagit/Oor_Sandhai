import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

import "./Auth.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("select");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
  e.preventDefault();
  setError("");

  if (role === "select") {
    setError("Select your role");
    return;
  }

  try {
    const response = await API.post("/auth/login", {
      email,
      password,
    });

    const { token, role: userRole,id } = response.data;

    // ROLE CHECK
    if (role !== userRole) {
      alert(`You are registered as ${userRole}. Please login with correct role.`);
      return; // stop execution
    }

    // If role matches
    localStorage.setItem("token", token);
    localStorage.setItem("role", userRole);
    localStorage.setItem("userId",id);

    if (userRole === "buyer") navigate("/buyer");
    if (userRole === "seller") navigate("/seller");
    if (userRole === "delivery") navigate("/delivery");

  } catch (error) {
    setError(error.response?.data?.message || "Login failed");
  }
};


  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome to Ungal Oor Sandhai</h2>
        <p className="auth-subtitle">Login to continue</p>

       <form onSubmit={handleLogin} className="auth-form">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
         placeholder="Enter your password"
         type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /> 
          

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="select">Select</option>
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
          <option value="delivery">Delivery Partner</option>
        </select>

        {/* Error message here */}
        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="primary-btn">
          Login
        </button>
      </form>


        <p className="auth-footer">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/register")}>
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
