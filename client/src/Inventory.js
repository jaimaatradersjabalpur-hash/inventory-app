import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash, FaSearch, FaBoxOpen } from 'react-icons/fa';

function Inventory() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: '', category: 'Hardware', hsn: '', gst: '', purchasePrice: '', sellingPrice: '', quantity: ''
  });
  const [searchTerm, setSearchTerm] = useState("");
  const API_URL = "https://jaimaa-backend.onrender.com/items";

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try { const res = await axios.get(API_URL); setItems(res.data); } 
    catch (err) { console.error(err); }
  };

  const handleChange = (e) => setNewItem({ ...newItem, [e.target.name]: e.target.value });

  const addItem = async () => {
    // Validation: Ensure Price is a number
    if (!newItem.name || !newItem.sellingPrice) return alert("Item Name and Selling Price are required!");
    
    try {
      const res = await axios.post(API_URL, newItem);
      setItems([...items, res.data]);
      // Clear form
      setNewItem({ name: '', category: 'Hardware', hsn: '', gst: '', purchasePrice: '', sellingPrice: '', quantity: '' });
    } catch (err) { alert("Error adding item"); }
  };

  const deleteItem = async (id) => {
    if(!window.confirm("Delete this item?")) return;
    try { await axios.delete(`${API_URL}/${id}`); setItems(items.filter(item => item._id !== id)); } 
    catch (err) { alert("Error deleting"); }
  };

  const filteredItems = items.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div style={{ padding: "20px", fontFamily: "Segoe UI, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "white", padding: "15px", borderRadius: "8px", marginBottom: "20px", display: "flex", justifyContent: "space-between" }}>
        <h2 style={{ margin: 0, color: "#0056b3" }}><FaBoxOpen /> Inventory</h2>
        <h3 style={{ margin: 0, color: "#28a745" }}>Stock: {items.length}</h3>
      </div>

      {/* ADD ITEM FORM */}
      <div style={{ background: "white", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <h4>+ Add New Item</h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "10px" }}>
          
          <input name="name" placeholder="Item Name (e.g. Tap)" value={newItem.name} onChange={handleChange} style={inputStyle} />
          
          {/* THESE ARE THE PRICE FIELDS YOU ASKED FOR */}
          <input name="purchasePrice" type="number" placeholder="Buy Price (₹)" value={newItem.purchasePrice} onChange={handleChange} style={inputStyle} />
          <input name="sellingPrice" type="number" placeholder="Sell Price (₹)" value={newItem.sellingPrice} onChange={handleChange} style={inputStyle} />
          
          <input name="quantity" type="number" placeholder="Quantity" value={newItem.quantity} onChange={handleChange} style={inputStyle} />
          
          <button onClick={addItem} style={{ background: "#0056b3", color: "white", border: "none", borderRadius: "4px", padding: "10px", cursor: "pointer" }}>Add Item</button>
        </div>
      </div>

      {/* List */}
      <div style={{ background: "white", padding: "20px", borderRadius: "8px" }}>
        <input placeholder="Search items..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ width: "100%", padding: "10px", border: "1px solid #ddd", marginBottom: "15px" }} />
        
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#eee", textAlign: "left" }}>
              <th style={th}>Name</th>
              <th style={th}>Buy Price</th>
              <th style={th}>Sell Price</th>
              <th style={th}>Qty</th>
              <th style={th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(item => (
              <tr key={item._id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={td}>{item.name}</td>
                <td style={td}>₹{item.purchasePrice || "-"}</td>
                <td style={td} style={{color: "green", fontWeight: "bold"}}>₹{item.sellingPrice}</td>
                <td style={td}><b>{item.quantity}</b></td>
                <td style={td}><button onClick={() => deleteItem(item._id)} style={{ color: "red", border: "none", background: "none" }}><FaTrash /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const inputStyle = { padding: "10px", border: "1px solid #ccc", borderRadius: "4px" };
const th = { padding: "10px", borderBottom: "2px solid #ddd" };
const td = { padding: "10px" };

export default Inventory;