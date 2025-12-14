import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaPrint, FaTimes } from 'react-icons/fa';

function Billing() {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({ name: "Cash Customer", phone: "" });
  const [bill, setBill] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 New Search State

  // USE LOCALHOST FOR NOW (We will switch to Cloud later)
  const API_URL = "https://jaimaa-backend.onrender.com";

  // 🏪 SHOP DETAILS FOR RECEIPT
  const SHOP_DETAILS = {
    name: "Jai Maa Traders",
    address: "J.D.A. Market Shop Number 3, Jabalpur, Madhya Pradesh", // <--- Edit this
    phone: "6260040886",                              // <--- Edit this
    email: "jaimaatraders@gmail.com",                            // <--- Edit this
  };

  useEffect(() => {
    axios.get(`${API_URL}/items`).then(res => setItems(res.data));
  }, []);

  // Filter items based on search
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (item) => {
    if (!item.sellingPrice) return alert(`Error: ${item.name} has no price! Fix in Inventory.`);

    const qty = prompt(`Enter Quantity for ${item.name}:`, "1");
    if (!qty) return;
    
    const quantity = Number(qty);
    const price = Number(item.sellingPrice);

    if (quantity > item.quantity) return alert(`Not enough stock! Only ${item.quantity} available.`);
    
    setCart([...cart, { ...item, quantity, total: quantity * price }]);
    setSearchTerm(""); // Clear search after adding
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
      <div style={{ padding: "40px", fontFamily: "Courier New, monospace", textAlign: "center", background: "#f9f9f9", minHeight: "100vh" }}>
        <div style={{ background: "white", border: "1px solid #ddd", padding: "20px", maxWidth: "400px", margin: "auto", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
          <h2 style={{ margin: "0 0 5px 0" }}>{SHOP_DETAILS.name}</h2>
          <p style={{ margin: "2px", fontSize: "12px" }}>{SHOP_DETAILS.address}</p>
          <p style={{ margin: "2px", fontSize: "12px" }}>Ph: {SHOP_DETAILS.phone} | GST: {SHOP_DETAILS.gst}</p>
          <hr style={{ borderTop: "1px dashed #333", margin: "15px 0" }} />
          
          <div style={{ textAlign: "left", fontSize: "13px" }}>
            <p><b>Date:</b> {new Date(bill.date).toLocaleString()}</p>
            <p><b>Customer:</b> {bill.name}</p>
            <p><b>Phone:</b> {bill.phone}</p>
          </div>
          <hr style={{ borderTop: "1px dashed #333", margin: "15px 0" }} />

          <table style={{ width: "100%", textAlign: "left", fontSize: "14px" }}>
            <thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
            <tbody>
              {bill.items.map((item, i) => (
                <tr key={i}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.sellingPrice}</td>
                  <td>{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <hr style={{ borderTop: "1px dashed #333", margin: "15px 0" }} />
          <h3 style={{ textAlign: "right" }}>Grand Total: ₹{bill.grandTotal}</h3>
          
          <div className="no-print" style={{ marginTop: "20px", display: "flex", gap: "10px", justifyContent: "center" }}>
            <button onClick={() => window.print()} style={{ ...btnStyle, background: "#0056b3" }}><FaPrint/> Print</button>
            <button onClick={() => setBill(null)} style={{ ...btnStyle, background: "#666" }}><FaTimes/> Close</button>
          </div>
          <style>{`@media print { .no-print { display: none; } body { background: white; } }`}</style>
        </div>
      </div>
    );
  }

  // --- BILLING COUNTER VIEW ---
  return (
    <div style={{ padding: "20px", fontFamily: "Segoe UI, sans-serif", maxWidth: "1200px", margin: "auto" }}>
      <h2 style={{ color: "#0056b3", display: "flex", alignItems: "center", gap: "10px" }}>🧾 Billing Counter</h2>
      
      {/* Customer Info */}
      <div style={{ background: "white", padding: "15px", borderRadius: "8px", marginBottom: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <div style={{ display: "flex", gap: "10px" }}>
          <input placeholder="Customer Name" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} style={inputStyle} />
          <input placeholder="Phone" value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})} style={inputStyle} />
        </div>
      </div>

      <div style={{ display: "flex", gap: "20px", flexDirection: "row" }}>
        
        {/* Left: Search & Products */}
        <div style={{ flex: 2 }}>
          {/* 🔍 SEARCH BAR */}
          <div style={{ position: "relative", marginBottom: "15px" }}>
            <FaSearch style={{ position: "absolute", left: "10px", top: "12px", color: "#888" }} />
            <input 
              placeholder="Search items..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              style={{ ...inputStyle, paddingLeft: "35px", width: "100%", fontSize: "16px" }} 
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "10px" }}>
            {filteredItems.map(item => (
              <button key={item._id} onClick={() => addToCart(item)} style={itemBtnStyle}>
                <b>{item.name}</b><br/>
                <span style={{ color: "green", fontWeight: "bold" }}>₹{item.sellingPrice}</span><br/>
                <small style={{ color: "#666" }}>Stock: {item.quantity}</small>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Cart */}
        <div style={{ flex: 1, background: "white", padding: "20px", borderRadius: "8px", height: "fit-content", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
          <h3 style={{ marginTop: 0 }}>Current Cart</h3>
          {cart.length === 0 ? <p style={{color:"#888", textAlign:"center"}}>Cart is empty</p> : (
            <table style={{ width: "100%", marginBottom: "20px", fontSize: "14px" }}>
              <thead><tr style={{textAlign:"left", borderBottom:"1px solid #eee"}}><th>Item</th><th>Qty</th><th>Total</th></tr></thead>
              <tbody>
                {cart.map((item, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <td style={{padding:"8px 0"}}>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
            <span style={{ fontSize: "18px", fontWeight: "bold" }}>Total:</span>
            <span style={{ fontSize: "22px", fontWeight: "bold", color: "#28a745" }}>₹{cart.reduce((a, b) => a + b.total, 0)}</span>
          </div>
          <button onClick={generateBill} style={payBtnStyle}>✅ Confirm & Print</button>
        </div>
      </div>
    </div>
  );
}

// Styles
const inputStyle = { padding: "10px", border: "1px solid #ccc", borderRadius: "5px", flex: 1, outline: "none" };
const itemBtnStyle = { padding: "15px", background: "white", border: "1px solid #ddd", borderRadius: "8px", cursor: "pointer", textAlign: "left", transition: "0.2s", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" };
const payBtnStyle = { width: "100%", padding: "15px", marginTop: "20px", background: "green", color: "white", fontSize: "16px", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" };
const btnStyle = { padding: "10px 20px", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" };

export default Billing;