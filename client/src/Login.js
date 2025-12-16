import React, { useState } from 'react';
import { FaLock, FaUserShield } from 'react-icons/fa';

function Login({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    // 🔐 THE SECRET KEY (Change this to whatever you want)
    const SECRET_KEY = "jai123";

    if (password === SECRET_KEY) {
      onLogin(true); // Unlock the door
    } else {
      setError("❌ Wrong Password! Access Denied.");
    }
  };

  return (
    <div style={containerStyle}>
      <div style={boxStyle}>
        <div style={{ color: "#0056b3", marginBottom: "20px" }}>
          <FaUserShield size={50} />
        </div>
        <h2 style={{ margin: "0 0 20px 0", color: "#333" }}>Owner Login</h2>
        
        <div style={{ position: "relative", marginBottom: "20px" }}>
          <FaLock style={{ position: "absolute", left: "15px", top: "15px", color: "#888" }} />
          <input 
            type="password" 
            placeholder="Enter Shop Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
        </div>

        {error && <p style={{ color: "red", fontSize: "14px", marginTop: "-10px" }}>{error}</p>}

        <button onClick={handleLogin} style={buttonStyle}>UNLOCK SHOP</button>
      </div>
      <p style={{ marginTop: "20px", color: "#888", fontSize: "12px" }}>Jai Maa Traders Inventory System v1.0</p>
    </div>
  );
}

// Professional Styles for the Login Page
const containerStyle = { height: "100vh", background: "linear-gradient(135deg, #e3f2fd 0%, #f1f8e9 100%)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", fontFamily: "Segoe UI" };
const boxStyle = { background: "white", padding: "40px", borderRadius: "15px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", textAlign: "center", width: "100%", maxWidth: "350px" };
const inputStyle = { width: "100%", padding: "12px 12px 12px 40px", fontSize: "16px", border: "1px solid #ddd", borderRadius: "8px", outline: "none", boxSizing: "border-box" };
const buttonStyle = { width: "100%", padding: "12px", background: "#0056b3", color: "white", border: "none", borderRadius: "8px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", marginTop: "10px", transition: "0.3s" };

export default Login;