const express = require('express');
const mongoose = require('mongoose');
const Product = require("./models/product.model.js");
const productRoute = require("./routes/product.route.js");
const app = express();

// Import environment variables
require('dotenv').config();

// Routes
const sellerRoute = require('./routes/seller.route.js');
const buyerRoute = require("./routes/buyer.route.js");

// Use JSON and URL encoding middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Define routes
app.use("/buyer", buyerRoute);
app.use("/seller", sellerRoute);

// Connect to MongoDB using environment variables
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected!');
    // Render will automatically assign the PORT environment variable
    const port = process.env.PORT || 3000;  // Default to 3000 if PORT is not set (for local development)
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log('Not Connected!', err);
  });
