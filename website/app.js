// Products
const PRODUCTS = [
  {
    id: 1,
    name: 'Mega Evolution Booster Box',
    category: 'Mega Evolution',
    type: 'Booster Box (36 Packs)',
    image: 'images/mega-evolution-booster-box.jpg',
    price: 339.99,
    emoji: '📦'
  },
  {
    id: 2,
    name: 'Mega Evolution Booster Bundle',
    category: 'Mega Evolution',
    type: 'Booster Bundle (6 Packs)',
    image: 'images/mega-evolution-booster-bundle.jpg',
    price: 69.99,
    emoji: '🎁'
  },
  {
    id: 3,
    name: 'Mega Evolution Elite Trainer Box',
    category: 'Mega Evolution',
    type: 'Elite Trainer Box',
    image: 'images/mega-evolution-etb.png',
    price: 119.99,
    emoji: '⭐'
  },
];

// Cart
const DB = {
  getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  },

  saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  },

  addToCart(productId) {
    const cart = this.getCart();
    const existing = cart.find(c => c.productId === productId);
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ productId, qty: 1 });
    }
    this.saveCart(cart);
  },

  removeFromCart(productId) {
    const cart = this.getCart().filter(c => c.productId !== productId);
    this.saveCart(cart);
  },

  updateQty(productId, qty) {
    let cart = this.getCart();
    if (qty <= 0) {
      cart = cart.filter(c => c.productId !== productId);
    } else {
      cart.find(c => c.productId === productId).qty = qty;
    }
    this.saveCart(cart);
  }
};

// Render
function renderProducts() {
  const grid = document.getElementById('productsGrid');

  grid.innerHTML = PRODUCTS.map(p => `
    <div class="product-card">
      <h3 class="product-name">${p.name}</h3>
      <div class="product-img">
        <img src="${p.image}" alt="${p.name}" />
      </div>
      <p class="product-category">${p.category}</p>
      <p class="product-type">${p.type}</p>
      <p class="product-price">$${p.price}</p>
      <button class="add-to-cart-btn" onclick="addToCart(${p.id})">Add to Cart</button>
    </div>
  `).join('');
}

function renderCart() {
  const cart = DB.getCart();
  const cartEl = document.getElementById('cartItems');

  if (cart.length === 0) {
    cartEl.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }

  cartEl.innerHTML = cart.map(c => {
    const product = PRODUCTS.find(p => p.id === c.productId);
    return `
      <div>
        <p>${product.name}</p>
        <button onclick="changeQty(${c.productId}, ${c.qty - 1})">−</button>
        <span>${c.qty}</span>
        <button onclick="changeQty(${c.productId}, ${c.qty + 1})">+</button>
        <span>$${(product.price * c.qty).toFixed(2)}</span>
        <button onclick="removeFromCart(${c.productId})">Remove</button>
      </div>
    `;
  }).join('');
}

// Interactions

function addToCart(productId) {
  DB.addToCart(productId);
  renderCart();
  console.log('Cart:', DB.getCart()); // check its working
}

function removeFromCart(productId) {
  DB.removeFromCart(productId);
  renderCart();
}

function changeQty(productId, qty) {
  DB.updateQty(productId, qty);
  renderCart();
}

function switchView(name) {
  document.getElementById('view-shop').style.display = name === 'shop' ? 'block' : 'none';
  document.getElementById('view-cart').style.display = name === 'cart' ? 'block' : 'none';
}

// Initialise

renderProducts();
renderCart();
