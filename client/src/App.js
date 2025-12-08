// client/src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");

  // 1. Load items from the Manager (Backend)
  useEffect(() => {
    // IMPORTANT: We use localhost for now. Later we change this to the cloud link.
    axios.get('http://localhost:5000/items')
      .then(res => setItems(res.data))
      .catch(err => console.log(err));
  }, []);

  // 2. Add a new item
  const addItem = () => {
    if(!name || !qty || !price) return alert("Please fill all fields");
    
    axios.post('http://localhost:5000/items', { name, quantity: qty, price })
      .then(res => {
        setItems([...items, res.data]); // Update the list instantly
        setName(""); setQty(""); setPrice(""); // Clear the boxes
      });
  };

  // 3. Delete an item
  const deleteItem = (id) => {
    axios.delete(`http://localhost:5000/items/${id}`)
      .then(() => {
        setItems(items.filter(item => item._id !== id));
      });
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial", maxWidth: "600px", margin: "auto" }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>📦 Jai Maa Traders</h1>
      
      {/* Input Form */}
      <div style={{ background: "#f4f4f4", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
        <h3>Add New Stock</h3>
        <input style={{ margin: "5px", padding: "8px" }} placeholder="Item Name (e.g. Tap)" value={name} onChange={e => setName(e.target.value)} />
        <input style={{ margin: "5px", padding: "8px", width: "60px" }} placeholder="Qty" type="number" value={qty} onChange={e => setQty(e.target.value)} />
        <input style={{ margin: "5px", padding: "8px", width: "80px" }} placeholder="Price" type="number" value={price} onChange={e => setPrice(e.target.value)} />
        <br />
        <button onClick={addItem} style={{ marginTop: "10px", padding: "10px 20px", background: "green", color: "white", border: "none", cursor: "pointer" }}>
          + Add Item
        </button>
      </div>

      {/* The List */}
      <h3>Current Inventory: {items.length} items</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {items.map(item => (
          <li key={item._id} style={{ borderBottom: "1px solid #ddd", padding: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <strong style={{ fontSize: "1.1rem" }}>{item.name}</strong> <br/>
              <span style={{ color: "#555" }}>Qty: {item.quantity} | ₹{item.price}</span>
            </div>
            <button onClick={() => deleteItem(item._id)} style={{ background: "red", color: "white", border: "none", padding: "5px 10px", cursor: "pointer" }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;