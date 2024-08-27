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
  profilePicture: { type: String, default: "" },
  images: [{ type: String }],
  description: { type: String, default: "" },
  likedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  gender: { type: Number, required: true },
});

const User = mongoose.model("User", UserSchema);

// Register route
app.post("/register", async (req, res) => {
  try {
    const { username, password, profilePicture, images, description, gender } =
      req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const checkUsername = await User.findOne({ username });
    if (checkUsername) {
      return res.status(404).json({ error: "Invalid user name" });
    }

    const user = new User({
      username,
      password: hashedPassword,
      profilePicture,
      images,
      description,
      gender,
    });
    await user.save();

    res.status(201).send("User registered");
  } catch (error) {
    console.log(error);
  }
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

// Route to get the list of users
app.get("/users/:username", async (req, res) => {
  try {
    const { username } = req.params;

    // Find the current authenticated user
    const currentUser = await User.findOne({ username });

    if (!currentUser) {
      return res.status(404).json({ error: "Authenticated user not found" });
    }

    // Fetch all users except the current authenticated user
    const users = await User.find(
      { _id: { $ne: currentUser._id } },
      "-password"
    );

    // Add an isLiked field to each user to indicate if they are liked by the current user
    const usersWithLikeStatus = users.map((user) => {
      return {
        ...user._doc, // Spread the user object
        isLiked: currentUser.likedUsers.includes(user._id), // Check if the current user has liked this user
      };
    });

    res.status(200).json(usersWithLikeStatus);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Error fetching users");
  }
});

// Route to handle "like" action based on username
app.post("/like/:username", async (req, res) => {
  try {
    const { username } = req.params; // The username of the user being liked
    const { likedUsername } = req.body; // The username of the user who is liking

    // Find the user who is being liked
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the user who is liking
    const likedUser = await User.findOne({ username: likedUsername });
    if (!likedUser) {
      return res.status(404).json({ error: "Liking user not found" });
    }

    // Check if the likedUsername is already in the likedUsers array
    const index = user.likedUsers.indexOf(likedUser._id);

    if (index !== -1) {
      // If user is already liked, remove from likedUsers array
      user.likedUsers.splice(index, 1);
      await user.save();
      return res.status(200).json({
        message: "User unliked successfully",
        likedUsers: user.likedUsers,
      });
    } else {
      // If user is not liked, add to likedUsers array
      user.likedUsers.push(likedUser._id);
      await user.save();
      return res.status(200).json({
        message: "User liked successfully",
        likedUsers: user.likedUsers,
      });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the request" });
  }
});

// Route to get matches
app.get("/matches/:username", async (req, res) => {
  try {
    const { username } = req.params;

    // Find the current authenticated user
    const currentUser = await User.findOne({ username }).populate(
      "likedUsers",
      "-password"
    );

    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get list of user IDs that the current user has liked
    const likedUserIds = currentUser.likedUsers.map((user) => user._id);

    // Find users who are in the likedUserIds list and have the current user in their likedUsers list
    const mutualLikes = await User.find({
      _id: { $in: likedUserIds },
      likedUsers: currentUser._id,
    }).populate("likedUsers", "-password");

    res.status(200).json(mutualLikes);
  } catch (error) {
    console.error("Error fetching mutual likes:", error);
    res.status(500).send("Error fetching mutual likes");
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));

//user: bittonassaf pass: dbtZbH3bm5mVqUOfV0
