import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/userModel.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();
const router = express.Router();
const secretKey = process.env.JWT_SECRET || 'default_secret_key';

// Create a user (used by Admin to add users)
router.post('/add-user', async (req, res) => {
  const { userId, name, email, role } = req.body;

  // Hash the default password before saving
  const defaultPassword = "qwe123";
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  const newUser = new User({
    userId,
    name,
    email,
    password: hashedPassword,
    role,
    score: 0,
  });

  try {
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user', error });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Delete user by ID
router.delete('/users/delete-user/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

// Edit user by ID
router.put('/users/edit-user/:id', async (req, res) => {
  const userId = req.params.id;
  const { name, email, role } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, role },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
});

// User login - returns JWT token
router.post('/users/login', async (req, res) => {
  const { userId, password } = req.body;
  try {
    // Find user by userId
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    // Compare password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password.' });
    }
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, userId: user.userId, role: user.role },
      secretKey,
      { expiresIn: '1h' }
    );
    res.status(200).json({ message: 'Login successful!', token, userId: user.userId });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

export default router;
