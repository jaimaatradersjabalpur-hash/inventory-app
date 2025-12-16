const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const XLSX = require('xlsx'); // Excel Tool

const app = express(); // <--- THIS WAS MISSING!

app.use(express.json());
app.use(cors());

// --- 1. DATABASE CONNECTION ---
const MONGO_URI = "mongodb+srv://suyash:suyash123@cluster0.qb0trqo.mongodb.net/?appName=Cluster0";

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to Jai Maa Warehouse!'))
  .catch(err => console.log('Database connection error:', err));

// --- 2. DATA STRUCTURE ---
const ItemSchema = new mongoose.Schema({
  name: String,
  size: String,
  brand: String,
  category: String,
  purchasePrice: Number,
  sellingPrice: Number,
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

// --- 3. ROUTES ---

// GET: Show stock
app.get('/items', async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

// POST: Add stock
app.post('/items', async (req, res) => {
  try {
    const newItem = new Item(req.body); 
    await newItem.save();
    res.json(newItem);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE: Remove stock
app.delete('/items/:id', async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST: Save Bill & Reduce Stock
app.post('/bills', async (req, res) => {
  try {
    const { customerName, customerPhone, items, grandTotal, date } = req.body;
    const newBill = new Bill({ customerName, customerPhone, items, grandTotal, date });
    await newBill.save();

    for (const item of items) {
      const product = await Item.findById(item._id);
      if (product) {
        product.quantity = product.quantity - item.quantity;
        await product.save();
      }
    }
    res.json(newBill);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET: Bill History
app.get('/bills', async (req, res) => {
  const bills = await Bill.find().sort({ date: -1 });
  res.json(bills);
});

// --- EXCEL EXPORT ROUTES ---

// Download Inventory
app.get('/download/inventory', async (req, res) => {
  try {
    const items = await Item.find();
    const data = items.map(item => ({
      Name: item.name,
      Size: item.size || "-",
      Brand: item.brand || "-",
      Category: item.category,
      "Buy Price": item.purchasePrice,
      "Sell Price": item.sellingPrice,
      Quantity: item.quantity,
      "Total Value": (item.purchasePrice || 0) * (item.quantity || 0)
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Stock");
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    res.setHeader("Content-Disposition", "attachment; filename=Inventory_Report.xlsx");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.send(buffer);
  } catch (err) { res.status(500).send("Error generating Excel"); }
});

// Download Bills
// 2. Download Detailed Sales History (Item-wise)
app.get('/download/bills', async (req, res) => {
  try {
    const bills = await Bill.find().sort({ date: -1 });

    let data = [];

    // Loop through every bill
    bills.forEach(bill => {
      const billDate = bill.date ? bill.date.toString().split('T')[0] : "Old Record";
      
      // Loop through every item inside the bill
      if (bill.items && bill.items.length > 0) {
        bill.items.forEach(item => {
          data.push({
            "Bill Date": billDate,
            "Customer Name": bill.customerName || "Cash Customer",
            "Customer Phone": bill.customerPhone || "-",
            "Item Name": item.name,
            "Size": item.size || "-",     // Shows Size
            "Brand": item.brand || "-",   // Shows Brand
            "Quantity": item.quantity,
            "Price (Per Unit)": item.sellingPrice,
            "Total for Item": item.total,
            "Bill Grand Total": bill.grandTotal // Shows full bill total for reference
          });
        });
      } else {
        // Handle old bills that might have empty item lists
        data.push({
          "Bill Date": billDate,
          "Customer Name": bill.customerName || "Cash Customer",
          "Customer Phone": bill.customerPhone || "-",
          "Item Name": "Unknown (Old Record)",
          "Size": "-", "Brand": "-", "Quantity": 0, "Price (Per Unit)": 0, "Total for Item": 0,
          "Bill Grand Total": bill.grandTotal
        });
      }
    });

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Detailed Sales");

    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    res.setHeader("Content-Disposition", "attachment; filename=Detailed_Sales_Report.xlsx");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.send(buffer);

  } catch (err) { res.status(500).send("Error generating Excel"); }
});

// --- 4. START SERVER ---
const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));