const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  category: { type: String, required: true },
  type:     { type: String, required: true },
  image:    { type: String },
  price:    { type: Number, required: true },
  emoji:    { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);