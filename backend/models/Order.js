const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name:  { type: String, required: true },
      price: { type: Number, required: true },
      image: { type: String },
      emoji: { type: String },
      qty:   { type: Number, required: true }
    }
  ],
  subtotal:     { type: Number, required: true },
  discount:     { type: Number, default: 0 },
  shipping:     { type: Number, required: true },
  tax:          { type: Number, required: true },
  total:        { type: Number, required: true },
  promoApplied: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['processing', 'shipped', 'delivered', 'cancelled'],
    default: 'processing'
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
