const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/auth");
const User = require("../models/User");

// @route GET api/auth
// @desc Check if user is logged in
// @access Public
router.get("/", verifyToken, async (req, res) => {
  try {
    // Don't get password when return user object
    const user = await User.findById(req.userId).select("-password");
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User found", data: user });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Internal server error", data: null });
  }
});

// @route POST api/auth/register
// @desc Register user
// @access Public
router.post("/register", async (req, res) => {
  const { username, password, role } = req.body;

  // Simple validation
  if (!username || !password)
    return res.status(400).json({
      success: false,
      message: "Missing username and/or password",
      data: null,
    });

  if (!role)
    return res
      .status(400)
      .json({ success: false, message: "Missing role", data: null });

  try {
    // Check for existing user
    const user = await User.findOne({ username });

    if (user)
      return res.status(400).json({
        success: false,
        message: "Username is already taken",
        data: null,
      });

    // Save new user
    const hashedPassword = await argon2.hash(password);
    const newUser = new User({
      username,
      password: hashedPassword,
      role,
    });
    await newUser.save();

    // Return token
    const accessToken = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.ACCESS_TOKEN_SECRET
    );

    // Status 200 with res.json
    res.json({
      success: true,
      message: "User is created successfully",
      data: accessToken,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Internal server error", data: null });
  }
});

// @route POST api/auth/login
// @desc Login user
// @access Public

router.post("/login", async (req, res) => {
  const { username, password, role } = req.body;

  // Simple validation
  if (!username || !password)
    return res.status(400).json({
      success: false,
      message: "Missing username and/or password",
      data: null,
    });

  try {
    // Check for existing user
    const user = await User.findOne({ username });

    // The message should not tell that which exactly is incorrect (show username or password is incorrect)
    if (!user)
      return res.status(400).json({
        success: false,
        message: "Incorrect username or password",
        data: null,
      });

    // Username found
    const passwordValid = await argon2.verify(user.password, password);
    if (!passwordValid)
      return res.status(400).json({
        success: false,
        message: "Incorrect username or password",
        data: null,
      });

    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET
    );

    // Status 200 with res.json
    res.json({
      success: true,
      message: "User logged in successfully",
      data: accessToken,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Internal server error", data: null });
  }
});

module.exports = router;
