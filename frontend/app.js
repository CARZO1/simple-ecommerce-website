// base URL for all API calls
const API_URL = '/api';

// fetch products from the backend
async function fetchProducts() {
  try {
    const res = await fetch(`${API_URL}/products`);
    const products = await res.json();
    return products;
  } catch (err) {
    console.error('error fetching products:', err);
    return [];
  }
}

// get the token from localStorage
function getToken() {
  return localStorage.getItem('token');
}

// check if user is logged in
function isLoggedIn() {
  return !!getToken();
}

// State
let activeCategory = 'All';
let promoApplied = false;

// Render
async function renderProducts() {
  const products = await fetchProducts();
  const query = document.getElementById('searchInput').value.toLowerCase().trim();
  const grid = document.getElementById('productsGrid');

  // Build category chips
  const categories = ['All', ...new Set(products.map(p => p.category))];
  document.getElementById('filterChips').innerHTML = categories
    .map(c => `<button class="chip ${activeCategory === c ? 'active' : ''}" onclick="filterCategory('${c}')">${c}</button>`)
    .join('');

  // Filter
  let filtered = products;
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
          <button class="add-to-cart-btn" onclick="addToCart('${p._id}')">Add to Cart</button>
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
  document.getElementById('view-shop').style.display     = name === 'shop'     ? 'block' : 'none';
  document.getElementById('view-cart').style.display     = name === 'cart'     ? 'block' : 'none';
  document.getElementById('view-success').style.display  = name === 'success'  ? 'block' : 'none';
  document.getElementById('view-login').style.display    = name === 'login'    ? 'block' : 'none';
  document.getElementById('view-register').style.display = name === 'register' ? 'block' : 'none';
  document.getElementById('view-orders').style.display   = name === 'orders'   ? 'block' : 'none';

  if (name === 'cart') renderCart();
  if (name === 'shop') renderProducts();
  if (name === 'orders') renderOrders();
}

// Cart (Create, Read, Update, Delete)
async function addToCart(productId) {
  if (!isLoggedIn()) {
    toast('Please log in to add items to your cart.', 'error');
    switchView('login');
    return;
  }

  try {
    const res = await fetch(`${API_URL}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify({ productId, qty: 1 })
    });
    const data = await res.json();
    if (!res.ok) {
      toast(data.message, 'error');
      return;
    }
    updateCartBadge();
    toast('Added to cart!', 'success');
  } catch (err) {
    toast('Something went wrong.', 'error');
  }
}

async function renderCart() {
  const cartEl    = document.getElementById('cartItems');
  const summaryEl = document.getElementById('orderSummary');
  const countEl   = document.getElementById('cartItemCount');

  if (!isLoggedIn()) {
    cartEl.innerHTML = `
      <div class="cart-empty">
        <div class="big-emoji">🛒</div>
        <h3>Please log in to view your cart</h3>
        <button class="btn-primary" onclick="switchView('login')">Login</button>
      </div>`;
    summaryEl.innerHTML = '';
    return;
  }

  try {
    const res = await fetch(`${API_URL}/cart`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    const cart = await res.json();

    const totalQty = cart.items.reduce((sum, c) => sum + c.qty, 0);
    countEl.textContent = totalQty > 0 ? `(${totalQty} item${totalQty !== 1 ? 's' : ''})` : '';

    if (cart.items.length === 0) {
      cartEl.innerHTML = `
        <div class="cart-empty">
          <div class="big-emoji">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add some products to get started.</p>
        </div>`;
      summaryEl.innerHTML = '';
      return;
    }

    cartEl.innerHTML = `<div class="cart-items">` + cart.items.map(c => `
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
          <button class="qty-btn" onclick="changeQty('${c.product._id}', ${c.qty - 1})">−</button>
          <span class="qty-num">${c.qty}</span>
          <button class="qty-btn" onclick="changeQty('${c.product._id}', ${c.qty + 1})">+</button>
        </div>
        <span class="cart-item-total">$${(c.product.price * c.qty).toFixed(2)}</span>
        <button class="cart-remove" onclick="removeFromCart('${c.product._id}')" title="Remove">✕</button>
      </div>
    `).join('') + `</div>`;

    // order summary
    const subtotal = cart.items.reduce((sum, c) => sum + c.product.price * c.qty, 0);
    const discount = promoApplied ? subtotal * 0.10 : 0;
    const shipping  = subtotal > 100 ? 0 : 9.99;
    const tax       = subtotal * 0.08;
    const total     = subtotal - discount + shipping + tax;

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

  } catch (err) {
    toast('Something went wrong loading your cart.', 'error');
  }
}

async function changeQty(productId, qty) {
  try {
    const res = await fetch(`${API_URL}/cart/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify({ qty })
    });
    if (!res.ok) {
      toast('Could not update quantity.', 'error');
      return;
    }
    updateCartBadge();
    renderCart();
  } catch (err) {
    toast('Something went wrong.', 'error');
  }
}

async function removeFromCart(productId) {
  try {
    const res = await fetch(`${API_URL}/cart/${productId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    if (!res.ok) {
      toast('Could not remove item.', 'error');
      return;
    }
    updateCartBadge();
    renderCart();
    toast('Item removed from cart.', 'success');
  } catch (err) {
    toast('Something went wrong.', 'error');
  }
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

async function checkout() {
  try {
    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify({ promoApplied })
    });
    const data = await res.json();
    if (!res.ok) {
      toast(data.message, 'error');
      return;
    }
    promoApplied = false;
    updateCartBadge();
    switchView('success');
  } catch (err) {
    toast('Something went wrong during checkout.', 'error');
  }
}

async function renderOrders() {
  const listEl = document.getElementById('ordersList');

  if (!isLoggedIn()) {
    listEl.innerHTML = `
      <div class="cart-empty">
        <div class="big-emoji">📦</div>
        <h3>Please log in to view your orders</h3>
        <button class="btn-primary" onclick="switchView('login')">Login</button>
      </div>`;
    return;
  }

  try {
    const res = await fetch(`${API_URL}/orders`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    const orders = await res.json();

    if (orders.length === 0) {
      listEl.innerHTML = `
        <div class="cart-empty">
          <div class="big-emoji">📦</div>
          <h3>No orders yet</h3>
          <p>Your completed orders will appear here.</p>
          <button class="btn-primary" onclick="switchView('shop')">Start Shopping</button>
        </div>`;
      return;
    }

    listEl.innerHTML = orders.map(order => {
      const date = new Date(order.createdAt).toLocaleDateString('en-AU', {
        day: 'numeric', month: 'short', year: 'numeric'
      });
      const ref = order._id.slice(-6).toUpperCase();
      return `
        <div class="order-card">
          <div class="order-header">
            <div>
              <div class="order-ref">Order #${ref}</div>
              <div class="order-date">${date}</div>
            </div>
            <div class="order-header-right">
              <span class="status-badge status-${order.status}">${order.status}</span>
              <div class="order-total">$${order.total.toFixed(2)}</div>
            </div>
          </div>
          <div class="order-items-list">
            ${order.items.map(item => `
              <div class="order-item">
                <span class="order-item-emoji">${item.emoji}</span>
                <span class="order-item-name">${item.name}</span>
                <span class="order-item-qty">x${item.qty}</span>
                <span class="order-item-price">$${(item.price * item.qty).toFixed(2)}</span>
              </div>
            `).join('')}
          </div>
          ${order.discount > 0 ? `<div class="order-promo">Promo SAVE10 applied · -$${order.discount.toFixed(2)}</div>` : ''}
        </div>`;
    }).join('');

  } catch (err) {
    toast('Something went wrong loading your orders.', 'error');
  }
}

async function clearCartAndReturn() {
  try {
    await fetch(`${API_URL}/cart`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    promoApplied = false;
    updateCartBadge();
    switchView('shop');
  } catch (err) {
    toast('Something went wrong.', 'error');
  }
}

async function updateCartBadge() {
  if (!isLoggedIn()) {
    document.getElementById('cartCount').textContent = 0;
    return;
  }
  try {
    const res = await fetch(`${API_URL}/cart`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    const cart = await res.json();
    const total = cart.items.reduce((sum, c) => sum + c.qty, 0);
    document.getElementById('cartCount').textContent = total;
  } catch (err) {
    console.error('error updating cart badge:', err);
  }
}

// Toast Notifications
function toast(msg, type = 'success') {
  const el = document.createElement('div');
  el.className = `toast-msg ${type}`;
  el.textContent = msg;
  document.getElementById('toast').appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

// Background Music
document.addEventListener('click', function startMusic() {
  const music = document.getElementById('background_music');
  const record = document.querySelector('.music-player');
  if (music.paused) {
    music.volume = 0.2;
    music.play();
    record.style.animationPlayState = 'running';
  }
}, { once: true });

function toggleMusic() {
  const music = document.getElementById('background_music');
  const record = document.querySelector('.music-player');
  if (music.paused) {
    music.play();
    record.style.animationPlayState = 'running';
  } else {
    music.pause();
    record.style.animationPlayState = 'paused';
  }
}

// Register a new user
async function register() {
  const username = document.getElementById('registerUsername').value.trim();
  const email    = document.getElementById('registerEmail').value.trim();
  const password = document.getElementById('registerPassword').value.trim();

  if (!username || !email || !password) {
    toast('Please fill in all fields.', 'error');
    return;
  }

  if (password.length < 8) {
    toast('Password must be at least 8 characters.', 'error');
    return;
  }

  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      toast(data.message, 'error');
      return;
    }
    toast('Account created! Please log in.', 'success');
    switchView('login');
  } catch (err) {
    toast('Something went wrong.', 'error');
  }
}

// Log in
async function login() {
  const email    = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  if (!email || !password) {
    toast('Please fill in all fields.', 'error');
    return;
  }

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      toast(data.message, 'error');
      return;
    }

    // save token and user to localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    updateNavForUser(data.user);
    toast(`Welcome back, ${data.user.username}!`, 'success');
    switchView('shop');
  } catch (err) {
    toast('Something went wrong.', 'error');
  }
}

// Log out
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  updateNavForUser(null);
  switchView('shop');
  toast('Logged out.', 'success');
}

// Update header based on login state
function updateNavForUser(user) {
  const usernameEl  = document.getElementById('navUsername');
  const loginBtn    = document.getElementById('navLoginBtn');
  const logoutBtn   = document.getElementById('navLogoutBtn');

  const ordersBtn = document.getElementById('navOrdersBtn');

  if (user) {
    usernameEl.textContent  = `Hi, ${user.username}`;
    loginBtn.style.display  = 'none';
    logoutBtn.style.display = 'block';
    ordersBtn.style.display = 'block';
  } else {
    usernameEl.textContent  = '';
    loginBtn.style.display  = 'block';
    logoutBtn.style.display = 'none';
    ordersBtn.style.display = 'none';
  }
}

// Check if user is already logged in on page load
const savedUser = localStorage.getItem('user');
if (savedUser) updateNavForUser(JSON.parse(savedUser));

// Initialise
renderProducts();
updateCartBadge();