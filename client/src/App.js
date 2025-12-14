import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Inventory from './Inventory';
import Billing from './Billing';

function App() {
  return (
    <Router>
      <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
        <nav style={{ background: "#0056b3", padding: "15px", display: "flex", gap: "20px", alignItems: "center" }}>
          <h2 style={{ color: "white", margin: 0 }}>Jai Maa Traders</h2>
          <Link to="/" style={{ color: "white", textDecoration: "none", fontWeight: "bold" }}>INVENTORY</Link>
          <Link to="/billing" style={{ color: "white", textDecoration: "none", fontWeight: "bold" }}>BILLING</Link>
        </nav>

        <div style={{ background: "#f4f4f4", flex: 1, overflow: "auto" }}>
          <Routes>
            <Route path="/" element={<Inventory />} />
            <Route path="/billing" element={<Billing />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
export default App;