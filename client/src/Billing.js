import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaPrint, FaTimes } from 'react-icons/fa';

function Billing() {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({ name: "Cash Customer", phone: "" });
  const [bill, setBill] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // USE LOCALHOST FOR NOW
  const API_URL = "https://jaimaa-backend.onrender.com"; 

  const SHOP_DETAILS = {
    name: "Jai Maa Traders",
    address: "Main Market, Jabalpur, MP",
    phone: "8819892290",
    email: "jaimaatraders@gmail.com"
  };

  useEffect(() => { axios.get(`${API_URL}/items`).then(res => setItems(res.data)); }, []);

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (item.size && item.size.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const addToCart = (item) => {
    if (!item.sellingPrice) return alert("Error: Item has no price.");
    const qty = prompt(`Quantity for ${item.name}?`, "1");
    if (!qty) return;
    const quantity = Number(qty);
    setCart([...cart, { ...item, quantity, total: quantity * Number(item.sellingPrice) }]);
    setSearchTerm("");
  };

  const generateBill = async () => {
    if (cart.length === 0) return alert("Cart is empty!");
    const grandTotal = cart.reduce((a, b) => a + b.total, 0);
    const billData = { ...customer, items: cart, grandTotal, date: new Date() };

    try {
      await axios.post(`${API_URL}/bills`, billData);
      setBill(billData);
      setCart([]);
      axios.get(`${API_URL}/items`).then(res => setItems(res.data));
    } catch (err) { alert("Error saving bill"); }
  };

  // --- RECEIPT VIEW ---
  if (bill) {
    return (
      <div style={{ padding: "20px", fontFamily: "Courier New", textAlign: "center", background: "#eee", minHeight: "100vh" }}>
        <div style={{ background: "white", padding: "20px", maxWidth: "400px", margin: "auto", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
          <h2 style={{ margin: "0" }}>{SHOP_DETAILS.name}</h2>
          <p style={{ fontSize: "12px" }}>{SHOP_DETAILS.address}</p>
          <hr />
          <table style={{ width: "100%", textAlign: "left", fontSize: "14px" }}>
            <tbody>
              {bill.items.map((item, i) => (
                <tr key={i}><td>{item.name}</td><td>x{item.quantity}</td><td>₹{item.total}</td></tr>
              ))}
            </tbody>
          </table>
          <hr />
          <h3>Total: ₹{bill.grandTotal}</h3>
          <button onClick={() => window.print()} style={{ padding: "10px", background: "#0056b3", color: "white", border: "none", width: "100%" }}>Print</button>
          <button onClick={() => setBill(null)} style={{ marginTop:"10px", padding: "10px", width: "100%" }}>Close</button>
        </div>
      </div>
    );
  }

  // --- RESPONSIVE BILLING VIEW ---
  return (
    <div style={{ padding: "10px", maxWidth: "100%", fontFamily: "Segoe UI", paddingBottom: "100px" }}> {/* Padding bottom for fixed cart */}
      
      {/* 1. Customer Details */}
      <div style={{ background: "white", padding: "10px", borderRadius: "8px", marginBottom: "15px", display: "flex", gap: "10px" }}>
        <input placeholder="Name" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} style={inputStyle} />
        <input placeholder="Mobile" value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})} style={inputStyle} />
      </div>

      {/* 2. Search Bar */}
      <div style={{ position: "relative", marginBottom: "15px" }}>
        <FaSearch style={{ position: "absolute", left: "12px", top: "12px", color: "#888" }} />
        <input placeholder="Search item..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ ...inputStyle, paddingLeft: "40px" }} />
      </div>

      {/* 3. Product Grid (Auto-adjusts to screen size) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "8px" }}>
        {filteredItems.map(item => (
          <div key={item._id} onClick={() => addToCart(item)} style={itemCardStyle}>
            <div style={{ fontWeight: "bold", fontSize: "14px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</div>
            <div style={{ fontSize: "11px", color: "#666" }}>{item.size || "-"} | {item.brand || "-"}</div>
            <div style={{ color: "green", fontWeight: "bold", marginTop: "5px" }}>₹{item.sellingPrice}</div>
          </div>
        ))}
      </div>

      {/* 4. Fixed Bottom Cart (Mobile Friendly) */}
      {cart.length > 0 && (
        <div style={{ position: "fixed", bottom: "0", left: "0", right: "0", background: "#fff", borderTop: "1px solid #ddd", padding: "15px", boxShadow: "0 -2px 10px rgba(0,0,0,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 1000 }}>
          <div>
            <div style={{ fontSize: "12px", color: "#666" }}>{cart.length} Items</div>
            <div style={{ fontSize: "18px", fontWeight: "bold", color: "#0056b3" }}>₹{cart.reduce((a, b) => a + b.total, 0)}</div>
          </div>
          <button onClick={generateBill} style={{ background: "#2e7d32", color: "white", padding: "10px 25px", border: "none", borderRadius: "25px", fontWeight: "bold", fontSize: "14px" }}>CONFIRM &rarr;</button>
        </div>
      )}
    </div>
  );
}

const inputStyle = { width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px", boxSizing: "border-box" };
const itemCardStyle = { background: "white", padding: "10px", border: "1px solid #eee", borderRadius: "8px", cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" };

export default Billing;