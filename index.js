const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userModel = require("./models/User");
require("dotenv").config();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  // Check if the user already exists
  const existingUser = await userModel.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user with the hashed password
    const userDoc = await userModel.create({
      username,
      password: hashedPassword,
    });

    console.log("User registered:", userDoc);
    res.json(userDoc);
  } catch (e) {
    console.error("Error during registration:", e);
    res.status(500).json(e);
  }
});

app.get("/", (req, res) => {
  res.send("register");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});