import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash, FaSearch, FaExclamationTriangle, FaChartPie, FaRupeeSign } from 'react-icons/fa';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

function Inventory() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: '', size: '', brand: '', category: 'Hardware', purchasePrice: '', sellingPrice: '', quantity: ''
  });
  const [searchTerm, setSearchTerm] = useState("");
  
  // USE LOCALHOST (Switch to Cloud URL before uploading!)
  const API_URL = "https://jaimaa-backend.onrender.com/items"; 

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try { const res = await axios.get(API_URL); setItems(res.data); } 
    catch (err) { console.error(err); }
  };

  const handleChange = (e) => setNewItem({ ...newItem, [e.target.name]: e.target.value });

  const addItem = async () => {
    if (!newItem.name || !newItem.sellingPrice) return alert("Name and Selling Price are required!");
    try {
      const res = await axios.post(API_URL, newItem);
      setItems([...items, res.data]);
      setNewItem({ name: '', size: '', brand: '', category: 'Hardware', purchasePrice: '', sellingPrice: '', quantity: '' });
    } catch (err) { alert("Error adding item"); }
  };

  const deleteItem = async (id) => {
    if(!window.confirm("Delete this item?")) return;
    try { await axios.delete(`${API_URL}/${id}`); setItems(items.filter(item => item._id !== id)); } 
    catch (err) { alert("Error deleting"); }
  };

  // --- SAFETY CHECK ADDED HERE ---
  // We use (item.name || "") to ensure we never crash if name is missing
  const filteredItems = items.filter(item => {
    const name = (item.name || "").toLowerCase();
    const brand = (item.brand || "").toLowerCase();
    const term = searchTerm.toLowerCase();
    return name.includes(term) || brand.includes(term);
  });

  // Analytics Calculations
  const totalStockValue = items.reduce((acc, item) => acc + (Number(item.purchasePrice || 0) * Number(item.quantity || 0)), 0);
  const lowStockItems = items.filter(item => item.quantity < 5);
  
  const categoryData = [
    { name: 'Hardware', value: items.filter(i => i.category === 'Hardware').length },
    { name: 'Plumbing', value: items.filter(i => i.category === 'Plumbing').length },
    { name: 'Paints', value: items.filter(i => i.category === 'Paints').length },
    { name: 'Electrical', value: items.filter(i => i.category === 'Electrical').length },
  ];
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div style={{ padding: "20px", fontFamily: "Segoe UI, sans-serif", background: "#f4f7f6", minHeight: "100vh" }}>
      
      {/* 1. CEO DASHBOARD */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "30px" }}>
        
        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <div style={{ ...iconBox, background: "#e3f2fd", color: "#1976d2" }}><FaRupeeSign size={24}/></div>
            <div>
              <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>Total Stock Value</p>
              <h2 style={{ margin: 0, color: "#333" }}>₹{totalStockValue.toLocaleString()}</h2>
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <div style={{ ...iconBox, background: "#ffebee", color: "#c62828" }}><FaExclamationTriangle size={24}/></div>
            <div>
              <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>Low Stock Alerts</p>
              <h2 style={{ margin: 0, color: "#c62828" }}>{lowStockItems.length} Items</h2>
            </div>
          </div>
          {lowStockItems.length > 0 && <small style={{color:"red"}}>Restock needed!</small>}
        </div>

        <div style={cardStyle}>
           <p style={{ margin: "0 0 10px", color: "#666", fontSize: "14px", display:"flex", alignItems:"center", gap:"10px" }}><FaChartPie/> Category Spread</p>
           <div style={{ width: "100%", height: "100px" }}>
             <ResponsiveContainer>
               <PieChart>
                 <Pie data={categoryData} cx="50%" cy="50%" innerRadius={30} outerRadius={45} paddingAngle={5} dataKey="value">
                   {categoryData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                   ))}
                 </Pie>
                 <Tooltip />
               </PieChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Card 4: Downloads */}
        <div style={cardStyle}>
           <p style={{ margin: "0 0 15px", color: "#666", fontSize: "14px", fontWeight:"bold" }}>📊 Excel Reports</p>
           <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
             
             <button onClick={() => window.open(`${API_URL.replace('/items', '')}/download/inventory`)} style={{...downloadBtn, background: "#2e7d32"}}>
               📥 Download Stock List
             </button>
             
             <button onClick={() => window.open(`${API_URL.replace('/items', '')}/download/bills`)} style={{...downloadBtn, background: "#0056b3"}}>
               📥 Download Sales History
             </button>

           </div>
        </div>
      </div>

      {/* 2. ADD ITEM FORM */}
      <div style={{ background: "white", padding: "25px", borderRadius: "12px", marginBottom: "20px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        <h4 style={{ marginTop: 0, color: "#444" }}>+ Add New Stock</h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "15px" }}>
          <input name="name" placeholder="Item Name" value={newItem.name} onChange={handleChange} style={inputStyle} />
          <input name="size" placeholder="Size" value={newItem.size} onChange={handleChange} style={inputStyle} />
          <input name="brand" placeholder="Brand" value={newItem.brand} onChange={handleChange} style={inputStyle} />
          <select name="category" value={newItem.category} onChange={handleChange} style={inputStyle}>
            <option>Hardware</option><option>Plumbing</option><option>Paints</option><option>Electrical</option>
          </select>
          <input name="purchasePrice" type="number" placeholder="Buy Price" value={newItem.purchasePrice} onChange={handleChange} style={inputStyle} />
          <input name="sellingPrice" type="number" placeholder="Sell Price" value={newItem.sellingPrice} onChange={handleChange} style={inputStyle} />
          <input name="quantity" type="number" placeholder="Qty" value={newItem.quantity} onChange={handleChange} style={inputStyle} />
          <button onClick={addItem} style={buttonStyle}>Add Item</button>
        </div>
      </div>

      {/* 3. INVENTORY LIST */}
      <div style={{ background: "white", padding: "25px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ margin: 0, color: "#444" }}>Stock List</h3>
          <div style={{ position: "relative", width: "100%", maxWidth: "300px" }}>
            <FaSearch style={{ position: "absolute", left: "12px", top: "12px", color: "#aaa" }} />
            <input placeholder="Search items..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ ...inputStyle, paddingLeft: "40px", width: "100%" }} />
          </div>
        </div>
        
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8f9fa", textAlign: "left" }}>
                <th style={th}>Item</th>
                <th style={th}>Prices</th>
                <th style={th}>Stock</th>
                <th style={th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => (
                <tr key={item._id} style={{ borderBottom: "1px solid #f1f1f1" }}>
                  <td style={td}>
                    {/* SAFE RENDERING: Handle missing names */}
                    <div style={{ fontWeight: "600", color: "#333" }}>{item.name || "Unnamed Item"}</div>
                    <div style={{ fontSize: "12px", color: "#777", marginTop: "4px" }}>
                      {item.size && <span style={tagStyle}>{item.size}</span>}
                      {item.brand && <span style={{...tagStyle, background: "#fff3e0", color: "#e65100"}}>{item.brand}</span>}
                    </div>
                  </td>
                  <td style={td}>
                    <div style={{ fontSize: "12px", color: "#888" }}>Buy: ₹{item.purchasePrice || 0}</div>
                    <div style={{ color: "#2e7d32", fontWeight: "bold" }}>Sell: ₹{item.sellingPrice || 0}</div>
                  </td>
                  <td style={td}>
                    {item.quantity < 5 ? (
                      <span style={{ color: "red", fontWeight: "bold", display:"flex", alignItems:"center", gap:"5px" }}>
                        <FaExclamationTriangle/> {item.quantity}
                      </span>
                    ) : (
                      <span style={{ fontWeight: "bold", color: "#333" }}>{item.quantity}</span>
                    )}
                  </td>
                  <td style={td}>
                    <button onClick={() => deleteItem(item._id)} style={{ color: "#ff5252", border: "none", background: "none", cursor: "pointer", fontSize: "16px" }}><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Styles
const cardStyle = { background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", justifyContent: "center" };
const iconBox = { width: "50px", height: "50px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" };
const inputStyle = { padding: "12px", border: "1px solid #e0e0e0", borderRadius: "8px", outline: "none", fontSize: "14px", transition: "0.2s" };
const buttonStyle = { background: "#1976d2", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", padding: "12px" };
const tagStyle = { background: "#e3f2fd", color: "#1565c0", padding: "2px 8px", borderRadius: "4px", marginRight: "6px", fontSize: "11px" };
const th = { padding: "15px", borderBottom: "2px solid #f0f0f0", color: "#555", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.5px" };
const td = { padding: "15px", verticalAlign: "middle" };
const downloadBtn = { padding: "10px", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: "bold" };

export default Inventory;