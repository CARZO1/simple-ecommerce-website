const express = require('express');
const router = express.Router();
const Order   = require('../models/Order');
const Cart    = require('../models/Cart');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// place an order from the current cart
router.post('/', protect, async (req, res) => {
  try {
    const { promoApplied } = req.body;

    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty' });
    }

    // check stock is sufficient for all items (only if stock is being tracked)
    for (const c of cart.items) {
      if (c.product.stock != null && c.product.stock < c.qty) {
        return res.status(400).json({
          message: `Not enough stock for "${c.product.name}" (${c.product.stock} left)`
        });
      }
    }

    // calculate totals server-side (same logic as frontend)
    const subtotal = cart.items.reduce((sum, c) => sum + c.product.price * c.qty, 0);
    const discount = promoApplied ? subtotal * 0.10 : 0;
    const shipping = subtotal > 100 ? 0 : 9.99;
    const tax      = subtotal * 0.08;
    const total    = subtotal - discount + shipping + tax;

    // snapshot product details so order history survives future product changes
    const order = new Order({
      user: req.user.id,
      items: cart.items.map(c => ({
        product: c.product._id,
        name:    c.product.name,
        price:   c.product.price,
        image:   c.product.image,
        emoji:   c.product.emoji,
        qty:     c.qty
      })),
      subtotal,
      discount,
      shipping,
      tax,
      total,
      promoApplied: !!promoApplied
    });

    await order.save();

    // decrement stock for each ordered item
    for (const c of cart.items) {
      await Product.findByIdAndUpdate(c.product._id, { $inc: { stock: -c.qty } });
    }

    // clear the cart after order is placed
    cart.items = [];
    await cart.save();

    res.status(201).json(order);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// get the logged in user's order history
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
