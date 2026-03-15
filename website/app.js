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
    image: 'images/phantasmal-flames-booster-bundle.jpg',
    price: 69.99,
    emoji: '🎁'
  },
  {
    id: 6,
    name: 'Phantasmal Flames Elite Trainer Box',
    category: 'Phantasmal Flames',
    type: 'Elite Trainer Box',
    image: 'images/phantasmal-flames-etb.jpg',
    price: 119.99,
    emoji: '⭐'
  },
];

// State
let activeCategory = 'All';

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

function filterCategory(cat) {
  activeCategory = cat;
  renderProducts();
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