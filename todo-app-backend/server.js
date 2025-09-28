const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const todoRoutes = require("./routes/todoRoutes");

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth/", authRoutes);
app.use("/api/users/", userRoutes);
app.use("/api/todos/", todoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
