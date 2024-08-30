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
  description: { type: String, default: "" },
  likedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  gender: { type: Number, required: true },
});

const User = mongoose.model("User", UserSchema);

// Message model
const MessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", MessageSchema);

// Register route
app.post("/register", async (req, res) => {
  try {
    const { username, password, description, gender } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const checkUsername = await User.findOne({ username });
    if (checkUsername) {
      return res.status(404).json({ error: "Invalid user name" });
    }

    const user = new User({
      username,
      password: hashedPassword,
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

// Route the profile of the user
app.get("/user/profile/:username", async (req, res) => {
  try {
    const { username } = req.params;

    // Find the user by their username
    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Send only the username and description back to the client
    res.status(200).json({
      newUsername: user.username,
      description: user.description,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

// Route update user detail
app.put("/user/profile/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const { description } = req.body;

    // Find the user by the current username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the username and description
    user.description = description || user.description; // Update only if description is provided

    await user.save();

    res.status(200).json({
      message: "User profile updated successfully",
      user: {
        description: user.description,
      },
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: "Failed to update user profile" });
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

// Route to send a message
app.post("/message", async (req, res) => {
  try {
    const { senderUsername, receiverUsername, content } = req.body;

    // Find sender and receiver users
    const sender = await User.findOne({ username: senderUsername });
    const receiver = await User.findOne({ username: receiverUsername });

    if (!sender || !receiver) {
      return res.status(404).json({ error: "Sender or receiver not found" });
    }

    // Create a new message
    const message = new Message({
      sender: sender._id,
      receiver: receiver._id,
      content,
    });

    await message.save();

    res.status(201).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).send("Error sending message");
  }
});

// Route to get all messages for a user including both sent and received messages
app.get("/messages/:username", async (req, res) => {
  try {
    const { username } = req.params;

    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch all messages where the user is either the sender or the receiver
    const messages = await Message.find({
      $or: [{ sender: user._id }, { receiver: user._id }],
    })
      .populate("sender", "username description gender")
      .populate("receiver", "username description gender")
      .sort({ timestamp: 1 });

    // Group messages by conversation (unique pair of sender and receiver)
    const conversations = messages.reduce((acc, msg) => {
      const otherUser = msg.sender._id.equals(user._id)
        ? msg.receiver
        : msg.sender;
      const conversationKey = otherUser._id.toString();

      if (!acc[conversationKey]) {
        acc[conversationKey] = [];
      }

      acc[conversationKey].push({
        sender: {
          username: msg.sender.username,
          description: msg.sender.description,
          gender: msg.sender.gender,
        },
        receiver: {
          username: msg.receiver.username,
          description: msg.receiver.description,
          gender: msg.receiver.gender,
        },
        content: msg.content,
        timestamp: msg.timestamp,
      });

      return acc;
    }, {});

    // Convert conversations object to array
    const conversationsArray = Object.values(conversations);

    res.status(200).json(conversationsArray);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Error fetching messages" });
  }
});

app.post("/messages/delete", async (req, res) => {
  try {
    const { senderUsername, receiverUsername, content, timestamp } = req.body;

    // Find the sender and receiver by username
    const sender = await User.findOne({ username: senderUsername });
    const receiver = await User.findOne({ username: receiverUsername });

    if (!sender || !receiver) {
      return res.status(404).json({ error: "Sender or receiver not found" });
    }

    // Find and delete the message
    const deletedMessage = await Message.findOneAndDelete({
      sender: sender._id,
      receiver: receiver._id,
      content: content,
      timestamp: timestamp,
    });

    if (!deletedMessage) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).send("Error deleting message");
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
