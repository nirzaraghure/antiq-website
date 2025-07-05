require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors"); // Import cors

const app = express();
const PORT = process.env.PORT || 5501; // Use the provided PORT or default to 5501
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET; // Though not used directly in this basic setup, good to include

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

// MongoDB Connection
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define Schemas
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: false },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const preorderSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: false },
  model: { type: String, required: true },
  quantity: { type: Number, required: true },
  address: { type: String, required: true },
  notes: { type: String, required: false },
  date: { type: Date, default: Date.now },
});

// Create Models
const Contact = mongoose.model("Contact", contactSchema);
const Preorder = mongoose.model("Preorder", preorderSchema);

// API Endpoints

// Contact Form Submission
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ message: "Name, email, and message are required." });
    }

    const newContact = new Contact({
      name,
      email,
      subject,
      message,
    });

    await newContact.save();
    res
      .status(200)
      .json({
        message: "Contact message sent successfully!",
        data: newContact,
      });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    res
      .status(500)
      .json({
        message: "Failed to send contact message.",
        error: error.message,
      });
  }
});

// Preorder Form Submission
app.post("/api/preorder", async (req, res) => {
  try {
    const { fullName, email, phone, model, quantity, address, notes } =
      req.body;

    // Basic validation
    if (!fullName || !email || !model || !quantity || !address) {
      return res
        .status(400)
        .json({
          message:
            "Full Name, email, model, quantity, and address are required.",
        });
    }
    if (typeof quantity !== "number" || quantity <= 0) {
      return res
        .status(400)
        .json({ message: "Quantity must be a positive number." });
    }

    const newPreorder = new Preorder({
      fullName,
      email,
      phone,
      model,
      quantity,
      address,
      notes,
    });

    await newPreorder.save();
    res
      .status(200)
      .json({ message: "Preorder submitted successfully!", data: newPreorder });
  } catch (error) {
    console.error("Error submitting preorder form:", error);
    res
      .status(500)
      .json({ message: "Failed to submit preorder.", error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
