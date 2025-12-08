// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// --- 1. DATABASE CONNECTION ---
// IMPORTANT: We will replace this text below with your real Cloud URL in the next step.
const MONGO_URI = "mongodb+srv://admin:admin123@cluster0.mongodb.net/jaiMaaInventory?retryWrites=true&w=majority";

// (If you haven't created the cloud database yet, this will fail. We fix this in Step 6!)
mongoose.connect('mongodb+srv://suyash:suyash123@cluster0.qb0trqo.mongodb.net/?appName=Cluster0')
  .then(() => console.log('Connected to Jai Maa Warehouse!'))
  .catch(err => console.log('Database connection error:', err));


// --- 2. DATA STRUCTURE (What an Item looks like) ---
const ItemSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  price: Number
});
const Item = mongoose.model('Item', ItemSchema);


// --- 3. ROUTES (The Instructions) ---

// Get all items (Read)
app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch items" });
  }
});

// Add new item (Create)
app.post('/items', async (req, res) => {
  try {
    const newItem = new Item(req.body);
    await newItem.save();
    res.json(newItem);
  } catch (error) {
    res.status(500).json({ error: "Could not add item" });
  }
});

// Delete item (Delete)
app.delete('/items/:id', async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted" });
  } catch (error) {
    res.status(500).json({ error: "Could not delete item" });
  }
});

// Start the Manager
const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));