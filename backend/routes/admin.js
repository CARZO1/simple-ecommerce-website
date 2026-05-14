const express = require('express');
const router = express.Router();
const User  = require('../models/User');
const Cart  = require('../models/Cart');
const Order = require('../models/Order');

// Note: protect + adminOnly are applied at mount time in server.js
// So every route here is automatically admin-only

// get all users (excluding passwords)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// delete a user and their cart
router.delete('/users/:id', async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await Cart.deleteOne({ user: req.params.id });
    res.json({ message: 'User deleted' });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// get all user carts
router.get('/carts', async (req, res) => {
  try {
    const carts = await Cart.find()
      .populate('user', 'username email')
      .populate('items.product');
    res.json(carts);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// get all orders across all users
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'username email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// update the status of an order
router.patch('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'username email');

    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
