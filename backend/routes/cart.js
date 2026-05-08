const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const { protect, adminOnly } = require('../middleware/auth');

// get the logged in user's cart
router.get('/', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart) {
      return res.json({ items: [] });
    }
    res.json(cart);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// add an item to the cart
router.post('/', protect, async (req, res) => {
  try {
    const { productId, qty } = req.body;

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      // create a new cart if the user doesn't have one
      cart = new Cart({ user: req.user.id, items: [] });
    }

    const existingItem = cart.items.find(
      item => item.product.toString() === productId
    );

    if (existingItem) {
      // item already in cart, increase qty
      existingItem.qty += qty || 1;
    } else {
      // add new item to cart
      cart.items.push({ product: productId, qty: qty || 1 });
    }

    await cart.save();
    await cart.populate('items.product');
    res.json(cart);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// update quantity of an item in the cart
router.put('/:productId', protect, async (req, res) => {
  try {
    const { qty } = req.body;
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find(
      item => item.product.toString() === req.params.productId
    );

    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    if (qty <= 0) {
      // remove item if qty drops to 0
      cart.items = cart.items.filter(
        item => item.product.toString() !== req.params.productId
      );
    } else {
      item.qty = qty;
    }

    await cart.save();
    await cart.populate('items.product');
    res.json(cart);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// remove an item from the cart
router.delete('/:productId', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== req.params.productId
    );

    await cart.save();
    await cart.populate('items.product');
    res.json(cart);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// clear the entire cart
router.delete('/', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();
    res.json({ message: 'Cart cleared' });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// admin - get all users' carts
router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    const carts = await Cart.find()
      .populate('user', 'username email') // only return username and email, not password
      .populate('items.product');
    res.json(carts);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;