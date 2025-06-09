const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const doctorRoutes = require("./routes/doctorRoutes");

dotenv.config();
const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);

mongoose.connect(process.env.MONGO_URI).catch((err) => console.error(err));
