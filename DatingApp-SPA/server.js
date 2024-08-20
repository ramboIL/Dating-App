const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(express.json());

// Enable CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "DateApp",
});

// User model
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: "" }, // store the URL or file path of the profile picture
  images: [{ type: String }], // store the URLs or file paths of user's images
  description: { type: String, default: "" }, // user description
  likedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // store the IDs of users the current user liked
});

const User = mongoose.model("user", UserSchema);

// Register route
app.post("/register", async (req, res) => {
  const { username, password, profilePicture, images, description } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    username,
    password: hashedPassword,
    profilePicture,
    images,
    description,
  });
  await user.save();

  res.status(201).send("User registered");
});

// Login route
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.json({ message: "Login successful", token: token, user: user });
    } else {
      res.status(400).send("Invalid credentials");
    }
  } catch (error) {
    res.status(500).send("Error logging in");
    console.error(error);
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));

//user: bittonassaf pass: dbtZbH3bm5mVqUOfV0
