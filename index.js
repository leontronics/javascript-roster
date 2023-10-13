require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Create an instance of the Express app
const app = express();

// Import the student routes
const studentRoutes = require("./routes/routes");

// Middleware to enable Cross-Origin Resource Sharing
app.use(cors());

// Middleware to parse JSON payloads
app.use(express.json());

// Middleware to parse URL-encoded payloads
app.use(express.urlencoded({ extended: true }));

// Use the student routes for any requests to /api/students
app.use("/api/students", studentRoutes);

// Define the port the server will listen on
const port = 3000;

// Start the server and listen on the defined port
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
