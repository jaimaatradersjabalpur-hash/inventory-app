const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// --- 1. DATABASE CONNECTION ---
// (Replace <password> with your actual password if you see this error later)
const MONGO_URI = "mongodb+srv://suyash:suyash123@cluster0.qb0trqo.mongodb.net/?appName=Cluster0";

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to Jai Maa Warehouse!'))
  .catch(err => console.log('Database connection error:', err));

// --- 2. DATA STRUCTURE (The Rulebook) ---
const ItemSchema = new mongoose.Schema({
  name: String,
  category: String,
  hsn: String,
  gst: Number,
  purchasePrice: Number,  // ✅ The Manager now knows this exists
  sellingPrice: Number,   // ✅ The Manager now knows this exists
  quantity: Number
});
const Item = mongoose.model('Item', ItemSchema);

const BillSchema = new mongoose.Schema({
  customerName: String,
  customerPhone: String,
  items: Array,
  grandTotal: Number,
  date: { type: Date, default: Date.now }
});
const Bill = mongoose.model('Bill', BillSchema);

// --- 3. ROUTES (The Instructions) ---

// GET: Show me the stock
app.get('/items', async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

// POST: Add new stock (THE FIX IS HERE)
app.post('/items', async (req, res) => {
  try {
    // We used to only pick name/qty. Now we take EVERYTHING (req.body)
    const newItem = new Item(req.body); 
    await newItem.save();
    res.json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: Remove stock
app.delete('/items/:id', async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Save a Bill (and reduce stock)
app.post('/bills', async (req, res) => {
  try {
    const { customerName, customerPhone, items, grandTotal } = req.body;

    // 1. Save the Bill
    const newBill = new Bill({ customerName, customerPhone, items, grandTotal });
    await newBill.save();

    // 2. Reduce Stock for each item
    for (const item of items) {
      // Find item by ID to be precise, or Name if ID is missing
      const product = await Item.findOne({ name: item.name });
      if (product) {
        product.quantity = product.quantity - item.quantity;
        await product.save();
      }
    }
    res.json(newBill);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Show bill history
app.get('/bills', async (req, res) => {
  const bills = await Bill.find().sort({ date: -1 });
  res.json(bills);
});

// --- 4. START THE SERVER ---
const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));