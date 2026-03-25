// Products
const PRODUCTS = [
  {
    id: 1,
    name: 'Mega Evolution Booster Box',
    category: 'Mega Evolution',
    type: 'Booster Box (36 Packs)',
    image: 'images/mega-evolution-booster-box.png',
    price: 339.99,
    emoji: '📦'
  },
  {
    id: 2,
    name: 'Mega Evolution Booster Bundle',
    category: 'Mega Evolution',
    type: 'Booster Bundle (6 Packs)',
    image: 'images/mega-evolution-booster-bundle.png',
    price: 59.99,
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
  {
    id: 4,
    name: 'Phantasmal Flames Booster Box',
    category: 'Phantasmal Flames',
    type: 'Booster Box (36 Packs)',
    image: 'images/phantasmal-flames-booster-box.png',
    price: 339.99,
    emoji: '📦'
  },
  {
    id: 5,
    name: 'Phantasmal Flames Booster Bundle',
    category: 'Phantasmal Flames',
    type: 'Booster Bundle (6 Packs)',
    image: 'images/phantasmal-flames-booster-bundle.png',
    price: 59.99,
    emoji: '🎁'
  },
  {
    id: 6,
    name: 'Phantasmal Flames Elite Trainer Box',
    category: 'Phantasmal Flames',
    type: 'Elite Trainer Box',
    image: 'images/phantasmal-flames-etb.png',
    price: 119.99,
    emoji: '⭐'
  },
  {
    id: 7,
    name: 'Ascended Heroes Elite Trainer Box',
    category: 'Ascended Heroes',
    type: 'Elite Trainer Box',
    image: 'images/ascended-heroes-etb.png',
    price: 119.99,
    emoji: '⭐'
  },
  {
    id: 8,
    name: 'Ascended Heroes Booster Bundle',
    category: 'Ascended Heroes',
    type: 'Booster Bundle (6 Packs)',
    image: 'images/ascended-heroes-booster-bundle.png',
    price: 69.99,
    emoji: '🎁'
  },
  {
    id: 9,
    name: 'Ascended Heroes Pin Collection',
    category: 'Ascended Heroes',
    type: 'Pin Collection (5 Packs)',
    image: 'images/ascended-heroes-pin-collection.png',
    price: 49.99,
    emoji: '🎁'
  },
  {
    id: 10,
    name: 'Perfect Order Booster Box',
    category: 'Perfect Order',
    type: 'Booster Box (36 Packs)',
    image: 'images/perfect-order-booster-box.png',
    price: 339.99,
    emoji: '📦'
  },
  {
    id: 11,
    name: 'Perfect Order Booster Bundle',
    category: 'Perfect Order',
    type: 'Booster Bundle (6 Packs)',
    image: 'images/perfect-order-booster-bundle.png',
    price: 59.99,
    emoji: '🎁'
  },
  {
    id: 12,
    name: 'Perfect Order Elite Trainer Box',
    category: 'Perfect Order',
    type: 'Elite Trainer Box',
    image: 'images/perfect-order-etb.png',
    price: 119.99,
    emoji: '⭐'
  },
  {
    id: 13,
    name: 'Chaos Rising Booster Box',
    category: 'Chaos Rising',
    type: 'Booster Box (36 Packs)',
    image: 'images/chaos-rising-booster-box.png',
    price: 339.99,
    emoji: '📦'
  },
  {
    id: 14,
    name: 'Chaos Rising Booster Bundle',
    category: 'Chaos Rising',
    type: 'Booster Bundle (6 Packs)',
    image: 'images/chaos-rising-booster-bundle.png',
    price: 59.99,
    emoji: '🎁'
  },
  {
    id: 15,
    name: 'Chaos Rising Elite Trainer Box',
    category: 'Chaos Rising',
    type: 'Elite Trainer Box',
    image: 'images/chaos-rising-etb.png',
    price: 119.99,
    emoji: '⭐'
  },
  {
    id: 16,
    name: 'PSA 10 Mega Charizard X ex',
    category: 'Graded Cards',
    type: 'Slab',
    image: 'images/psa-10-mega-charizard-x.png',
    price: 1499.99,
    emoji: '🧱'
  },
];

// State
let activeCategory = 'All';
let promoApplied = false;

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
  },

  clearCart() {
    this.saveCart([]);
  }
};

// Render
function renderProducts() {
  const query = document.getElementById('searchInput').value.toLowerCase().trim();
  const grid  = document.getElementById('productsGrid');

  // Build category chips
  const categories = ['All', ...new Set(PRODUCTS.map(p => p.category))];
  document.getElementById('filterChips').innerHTML = categories
    .map(c => `<button class="chip ${activeCategory === c ? 'active' : ''}" onclick="filterCategory('${c}')">${c}</button>`)
    .join('');

  // Filter
  let filtered = PRODUCTS;
  if (activeCategory !== 'All') {
    filtered = filtered.filter(p => p.category === activeCategory);
  }
  if (query) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.type.toLowerCase().includes(query)
    );
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <p>No products found.</p>
      </div>`;
    return;
  }

  grid.innerHTML = filtered.map(p => `
    <div class="product-card">
      <div class="product-img">
        <img
          src="${p.image}"
          alt="${p.name}"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
        />
        <div class="no-image" style="display:none;">
          <span>${p.emoji}</span>
          <span>No image</span>
        </div>
      </div>
      <div class="product-body">
        <div class="product-category">${p.category}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-type">${p.type}</div>
        <div class="product-footer">
          <span class="product-price">$${p.price.toFixed(2)}</span>
          <button class="add-to-cart-btn" onclick="addToCart(${p.id})">Add to Cart</button>
        </div>
      </div>
    </div>
  `).join('');
}

function filterCategory(cat) {
  activeCategory = cat;
  renderProducts();
}

// Navigation

function switchView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-' + name).classList.add('active');
  document.querySelector('.cart-nav-btn').classList.toggle('active', name === 'cart');

  if (name === 'cart') renderCart();
  if (name === 'shop') renderProducts();
}

// Cart (Create, Read, Update, Delete)
function addToCart(productId) {
  DB.addToCart(productId);
  updateCartBadge();
  const product = PRODUCTS.find(p => p.id === productId);
  toast(`${product.name} added to cart!`, 'success');
}

function renderCart() {
  const cart      = DB.getCart();
  const cartEl    = document.getElementById('cartItems');
  const summaryEl = document.getElementById('orderSummary');
  const countEl   = document.getElementById('cartItemCount');

  const totalQty = cart.reduce((sum, c) => sum + c.qty, 0);
  countEl.textContent = totalQty > 0 ? `(${totalQty} item${totalQty !== 1 ? 's' : ''})` : '';

  if (cart.length === 0) {
    cartEl.innerHTML = `
      <div class="cart-empty">
        <div class="big-emoji">🛒</div>
        <h3>Your cart is empty</h3>
        <p>Add some products to get started.</p>
      </div>`;
    summaryEl.innerHTML = '';
    return;
  }

  const enriched = cart
    .map(c => ({ ...c, product: PRODUCTS.find(p => p.id === c.productId) }))
    .filter(c => c.product);

  cartEl.innerHTML = `<div class="cart-items">` + enriched.map(c => `
    <div class="cart-item">
      <div class="cart-item-thumb">
        <img
          src="${c.product.image}"
          alt="${c.product.name}"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
        />
        <span class="thumb-placeholder" style="display:none;">${c.product.emoji}</span>
      </div>
      <div class="cart-item-info">
        <div class="cart-item-name">${c.product.name}</div>
        <div class="cart-item-price">$${c.product.price.toFixed(2)} each · ${c.product.type}</div>
      </div>
      <div class="qty-control">
        <button class="qty-btn" onclick="changeQty(${c.productId}, ${c.qty - 1})">−</button>
        <span class="qty-num">${c.qty}</span>
        <button class="qty-btn" onclick="changeQty(${c.productId}, ${c.qty + 1})">+</button>
      </div>
      <span class="cart-item-total">$${(c.product.price * c.qty).toFixed(2)}</span>
      <button class="cart-remove" onclick="removeFromCart(${c.productId})" title="Remove">✕</button>
    </div>
  `).join('') + `</div>`;

  // Order summary
  const subtotal = enriched.reduce((sum, c) => sum + c.product.price * c.qty, 0);
  const discount = promoApplied ? subtotal * 0.10 : 0;
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax      = subtotal * 0.08;
  const total    = subtotal - discount + shipping + tax;

  summaryEl.innerHTML = `
    <div class="order-summary">
      <div class="summary-title">Order Summary</div>
      <div class="summary-line"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
      ${promoApplied ? `<div class="summary-line" style="color: green;"><span>Discount (10%)</span><span>-$${discount.toFixed(2)}</span></div>` : ''}
      <div class="summary-line">
        <span>Shipping</span>
        <span>${shipping === 0 ? 'Free' : '$' + shipping.toFixed(2)}</span>
      </div>
      <div class="summary-line"><span>Tax (8%)</span><span>$${tax.toFixed(2)}</span></div>
      <div class="summary-line total"><span>Total</span><span>$${total.toFixed(2)}</span></div>
      <div class="promo-wrap">
        <input class="promo-input" id="promoInput" placeholder="Promo code" />
        <button class="btn-secondary" onclick="applyPromo()">Apply</button>
      </div>
      <button class="checkout-btn" onclick="checkout()">Checkout</button>
      <div class="checkout-note">🔒 Secure checkout · Free shipping over $100</div>
    </div>`;
}

function changeQty(productId, qty) {
  DB.updateQty(productId, qty);
  updateCartBadge();
  renderCart();
}

function removeFromCart(productId) {
  DB.removeFromCart(productId);
  updateCartBadge();
  renderCart();
  toast('Item removed from cart.', 'error');
}

function applyPromo() {
  const code = document.getElementById('promoInput').value.trim().toUpperCase();
  if (code === 'SAVE10') {
    promoApplied = true;
    renderCart();
    toast('10% discount applied!', 'success');
  } else {
    promoApplied = false;
    toast('Invalid promo code.', 'error');
  }
}

function checkout() {
  switchView('success');
}

function clearCartAndReturn() {
  DB.clearCart();
  promoApplied = false;
  updateCartBadge();
  switchView('shop');
}

function updateCartBadge() {
  const total = DB.getCart().reduce((sum, c) => sum + c.qty, 0);
  document.getElementById('cartCount').textContent = total;
}

// Toast Notifications
function toast(msg, type = 'success') {
  const el = document.createElement('div');
  el.className = `toast-msg ${type}`;
  el.textContent = msg;
  document.getElementById('toast').appendChild(el);
  setTimeout(() => el.remove(), 3000);
}


// Initialise

renderProducts();
updateCartBadge();