const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userModel = require("./models/User");

app.use(cors());
app.use(express.json());

mongoose.connect(
  "mongodb+srv://blog:Antares%401234@cluster0.wksya.mongodb.net/"
);

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

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
