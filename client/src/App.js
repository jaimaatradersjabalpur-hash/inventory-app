import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Inventory from './Inventory';
import Billing from './Billing';
import Login from './Login'; 

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem("auth") === "true");

  const handleLogin = (status) => {
    setIsLoggedIn(status);
    if (status) localStorage.setItem("auth", "true");
    else localStorage.removeItem("auth");
  };

  if (!isLoggedIn) return <Login onLogin={handleLogin} />;

  return (
    <Router>
      <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
        
        {/* RESPONSIVE NAVIGATION */}
        <nav style={{ background: "#0056b3", padding: "10px 15px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 5px rgba(0,0,0,0.2)", flexWrap: "wrap" }}>
          
          {/* Logo / Title Area */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Logo Image (Make sure logo192.png is in public folder) */}
            <img src="/logo192.png" alt="Logo" style={{ height: "30px", width: "30px", borderRadius: "50%" }} />
            <h2 style={{ color: "white", margin: 0, fontSize: "18px", whiteSpace: "nowrap" }}>Jai Maa Traders</h2>
          </div>

          {/* Buttons Area */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Link to="/" style={linkStyle}>INVENTORY</Link>
            <Link to="/billing" style={linkStyle}>BILLING</Link>
            <button onClick={() => handleLogin(false)} style={logoutBtn}>Exit</button>
          </div>
        </nav>

        <div style={{ background: "#f4f7f6", flex: 1, overflow: "auto" }}>
          <Routes>
            <Route path="/" element={<Inventory />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

// Mobile-Friendly Styles
const linkStyle = { color: "rgba(255,255,255,0.9)", textDecoration: "none", fontWeight: "600", fontSize: "12px", padding: "5px" };
const logoutBtn = { background: "#d32f2f", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "11px" };

export default App;