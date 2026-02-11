import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("buyer");

  const handleLogin = (e) => {
    e.preventDefault();

    console.log({ email, password, role });

    if (role === "buyer") navigate("/buyer");
    if (role === "seller") navigate("/seller");
    if (role === "delivery") navigate("/delivery");
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Login – Oor Sandhai</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br /><br />

        <label>Login as:</label>
        <br />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
          <option value="delivery">Delivery Partner</option>
        </select>

        <br /><br />

        <button type="submit">Login</button>
      </form>

      <p>
        New user?{" "}
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => navigate("/register")}
        >
          Register here
        </span>
      </p>
    </div>
  );
}

export default Login;
