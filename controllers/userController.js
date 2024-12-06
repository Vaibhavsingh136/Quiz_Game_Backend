// controllers/userController.js
const User = require('../models/User');

async function registerUser(req, res) {
  try {
    const { name, rollNumber } = req.body;

    // Log the received data for debugging
    console.log("Received request data:", { name, rollNumber });

    // Validate if rollNumber is provided
    if (!rollNumber || rollNumber.trim() === "") {
      return res.status(400).json({ message: "rollNumber is required and cannot be empty" });
    }

    // Check if the user with the same rollNumber already exists
    const existingUser = await User.findOne({ rollNumber });

    if (existingUser) {
      return res.status(400).json({ message: 'User with this rollNumber already exists' });
    }

    // Create a new user
    const newUser = new User({
      name,
      rollNumber,
    });

    // Log the user creation for debugging
    console.log("Created new user:", newUser);

    // Save the user to the database
    await newUser.save();

    // Respond with success
    return res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    // Log more information about the error to help identify the issue
    console.error("Error during user registration:", error.message);

    // Provide a meaningful error response
    return res.status(500).json({ message: 'Error registering user', error: error.message });
  }
}

module.exports = { registerUser };