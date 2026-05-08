const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

// get all products (public)
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    // if search query exists, filter by name, category or type
    if (search) {
      query = {
        $or: [
          { name:     { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
          { type:     { $regex: search, $options: 'i' } }
        ]
      };
    }

    const products = await Product.find(query);
    res.json(products);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// get single product (public)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// add a product (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, category, type, price, image, badge, emoji } = req.body;
    const product = new Product({ name, category, type, price, image, badge, emoji });
    await product.save();
    res.status(201).json(product);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// update a product (admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // returns the updated product
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// delete a product (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted' });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;