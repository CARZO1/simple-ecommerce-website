const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

// Products
const products = [
  {
    name: 'Mega Evolution Booster Box',
    category: 'Mega Evolution',
    type: 'Booster Box (36 Packs)',
    image: 'images/mega-evolution-booster-box.png',
    price: 339.99,
    emoji: '📦'
  },
  {
    name: 'Mega Evolution Booster Bundle',
    category: 'Mega Evolution',
    type: 'Booster Bundle (6 Packs)',
    image: 'images/mega-evolution-booster-bundle.png',
    price: 59.99,
    emoji: '🎁'
  },
  {
    name: 'Mega Evolution Elite Trainer Box',
    category: 'Mega Evolution',
    type: 'Elite Trainer Box',
    image: 'images/mega-evolution-etb.png',
    price: 119.99,
    emoji: '⭐'
  },
  {
    name: 'Phantasmal Flames Booster Box',
    category: 'Phantasmal Flames',
    type: 'Booster Box (36 Packs)',
    image: 'images/phantasmal-flames-booster-box.png',
    price: 339.99,
    emoji: '📦'
  },
  {
    name: 'Phantasmal Flames Booster Bundle',
    category: 'Phantasmal Flames',
    type: 'Booster Bundle (6 Packs)',
    image: 'images/phantasmal-flames-booster-bundle.png',
    price: 59.99,
    emoji: '🎁'
  },
  {
    name: 'Phantasmal Flames Elite Trainer Box',
    category: 'Phantasmal Flames',
    type: 'Elite Trainer Box',
    image: 'images/phantasmal-flames-etb.png',
    price: 119.99,
    emoji: '⭐'
  },
  {
    name: 'Ascended Heroes Elite Trainer Box',
    category: 'Ascended Heroes',
    type: 'Elite Trainer Box',
    image: 'images/ascended-heroes-etb.png',
    price: 119.99,
    emoji: '⭐'
  },
  {
    name: 'Ascended Heroes Booster Bundle',
    category: 'Ascended Heroes',
    type: 'Booster Bundle (6 Packs)',
    image: 'images/ascended-heroes-booster-bundle.png',
    price: 69.99,
    emoji: '🎁'
  },
  {
    name: 'Ascended Heroes Pin Collection',
    category: 'Ascended Heroes',
    type: 'Pin Collection (5 Packs)',
    image: 'images/ascended-heroes-pin-collection.png',
    price: 49.99,
    emoji: '🎁'
  },
  {
    name: 'Perfect Order Booster Box',
    category: 'Perfect Order',
    type: 'Booster Box (36 Packs)',
    image: 'images/perfect-order-booster-box.png',
    price: 339.99,
    emoji: '📦'
  },
  {
    name: 'Perfect Order Booster Bundle',
    category: 'Perfect Order',
    type: 'Booster Bundle (6 Packs)',
    image: 'images/perfect-order-booster-bundle.png',
    price: 59.99,
    emoji: '🎁'
  },
  {
    name: 'Perfect Order Elite Trainer Box',
    category: 'Perfect Order',
    type: 'Elite Trainer Box',
    image: 'images/perfect-order-etb.png',
    price: 119.99,
    emoji: '⭐'
  },
  {
    name: 'Chaos Rising Booster Box',
    category: 'Chaos Rising',
    type: 'Booster Box (36 Packs)',
    image: 'images/chaos-rising-booster-box.png',
    price: 339.99,
    emoji: '📦'
  },
  {
    name: 'Chaos Rising Booster Bundle',
    category: 'Chaos Rising',
    type: 'Booster Bundle (6 Packs)',
    image: 'images/chaos-rising-booster-bundle.png',
    price: 59.99,
    emoji: '🎁'
  },
  {
    name: 'Chaos Rising Elite Trainer Box',
    category: 'Chaos Rising',
    type: 'Elite Trainer Box',
    image: 'images/chaos-rising-etb.png',
    price: 119.99,
    emoji: '⭐'
  },
  {
    name: 'PSA 10 Mega Charizard X ex',
    category: 'Graded Cards',
    type: 'Slab',
    image: 'images/psa-10-mega-charizard-x.png',
    price: 1499.99,
    emoji: '🧱'
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('connected to MongoDB');

    // clear existing products first
    await Product.deleteMany({});
    console.log('cleared existing products');

    // insert new products
    await Product.insertMany(products);
    console.log('products seeded successfully');

    mongoose.disconnect();
  } catch (err) {
    console.error('seed error:', err.message);
    mongoose.disconnect();
  }
}

seed();