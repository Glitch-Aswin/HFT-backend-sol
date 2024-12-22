const Product = require("./models/product.model.js");
const productRoute = require("./routes/product.route.js");
const express = require('express');
const mongoose = require('mongoose');
const { ethers } = require('ethers');
const app = express();

// Import routes
const sellerRoute = require('./routes/seller.route.js');
const buyerRoute = require("./routes/buyer.route.js");
const contractRoutes = require("./routes/contractRoutes.js");

// Middleware for handling JSON and URL encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Define your routes
app.use("/buyer", buyerRoute);
app.use("/seller", sellerRoute);
app.use("/payment", contractRoutes);

// Import environment variables
require('dotenv').config();

// Connect to MongoDB using environment variables
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB!');
    const port = process.env.PORT || 3000;  // Default to 3000 if PORT is not set
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log('Failed to connect to MongoDB:', err);
  });
