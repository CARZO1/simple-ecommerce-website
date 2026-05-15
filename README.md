31748 Programming on the Internet - Assignment 2

24754069 Domenic Carzo

Video Recording of website -> [HERE](https://www.youtube.com/watch?v=XrOT7SqIPJY)

# PokéCart (Pokemon TCG Store)

A full-stack single-page e-commerce app for browsing and purchasing Pokémon TCG sealed products.

## Problem

Pokémon card collectors often have to browse multiple retail stores, fist fight scalpers, or pay ridiculous prices to get their hands on sealed products across different sets.
PokéCart solves this by providing a clean, single-page storefront where users can browse a variety of sealed products, filter by set, and manage a persistent shopping cart — all without leaving the page (and for a fair price!)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT + bcryptjs password hashing |

---

## How to Run

### Prerequisites
- [Node.js](https://nodejs.org) installed
- `.env` file in the `backend/` folder (see below)

### Setup

```bash
cd backend
npm install
npm run dev
```

Then open **http://localhost:5000** in your browser.

`npm run dev` uses nodemon, so the server automatically restarts when you change backend files.

### Environment Variables

Place the `.env` file provided in my submission into the `backend/` folder before running.

> **Note if running on Mac:** Port 5000 is reserved by AirPlay Receiver on macOS. Either disable AirPlay Receiver in System Settings, or set `PORT=5001` in your `.env` and access the website at `http://localhost:5001`.

## Features

### Shop
- Catalogue of sealed Pokemon TCG products fetched from MongoDB
- Live search (filters products as you type)
- Category filter chips (filter by set e.g. Mega Evolution, Phantasmal Flames, etc.)

### Auth
- User registration and login with JWT
- Passwords must be at least 8 characters
- Session persists across page refreshes via localStorage token

### Cart
- Add products to cart with a single click (login required)
- Adjust quantities directly in the cart
- Remove individual items
- Cart is stored in MongoDB and linked to the logged-in user
- Order summary with subtotal, shipping (free over $100), and 8% tax
- Promo code **SAVE10** gives 10% discount

### Orders
- Checkout creates a permanent order record in the database
- Product details (name, price) are snapshotted at purchase time so history is preserved even if products change
- Users can view their full order history with status badges

### Admin Panel
- Separate `/api/admin` router — `protect + adminOnly` middleware applied at mount time so every admin route is automatically secured
- **Orders tab** - view all orders across all users, update order status (Processing → Shipped → Delivered → Cancelled)
- **Users tab** - view all registered users, delete accounts (cannot delete yourself or other admins)
- **Carts tab** - view every user's active cart and its contents
- Admin nav button only appears for users with `role: "admin"`

### Other
- Background Pokemart music with a spinning vinyl record (click to pause/play)

---

## Folder Structure

```
simple-ecommerce-website/
├── frontend/
│   ├── index.html
│   ├── app.js
│   ├── stylesheet.css
│   ├── images/
│   └── audio/
│       └── pokemart.mp3
└── backend/
    ├── server.js
    ├── seed.js
    ├── .env (needs to be manually placed here)
    ├── package.json
    ├── models/
    │   ├── User.js
    │   ├── Product.js
    │   ├── Cart.js
    │   └── Order.js
    ├── routes/
    │   ├── auth.js
    │   ├── products.js
    │   ├── cart.js
    │   ├── orders.js
    │   └── admin.js
    └── middleware/
        └── auth.js
└── db-export/
    ├── users.json
    ├── products.json
    ├── carts.json
    └── orders.json
```

## Design Decisions

**JWT over sessions** — the backend is a stateless REST API, so there's no server-side session store to maintain. The JWT carries the user's ID and role directly, meaning every request is verified with just a secret key and no extra database lookup. The tradeoff is that tokens can't be invalidated before expiry, but since logout simply removes the token from localStorage, this is an acceptable compromise for this use case.

**MongoDB over a relational database** — the app's data is naturally document-shaped. A cart is a user with an embedded list of items; an order is a snapshot of those items with pricing at the time of purchase. Modelling this in SQL would require joining across multiple tables (users, cart_items, products, order_items) on every read. MongoDB stores each cart and order as a single document that maps directly to what the frontend needs. Mongoose schemas and `.populate()` provide enough structure and referential integrity for this use case without the overhead of a relational model.

---

## Challenges

**Single-page architecture without a framework** - rather than loading new pages, all views are kept in the DOM and shown or hidden with JavaScript. Keeping the cart badge, nav state, and view content in sync required careful coordination across render functions.

**Moving from localStorage to a real database** - the original cart used localStorage which meant it was device-specific and lost on logout. Migrating to a MongoDB-backed cart with JWT auth meant every cart operation became an async API call, which required restructuring all the cart logic.

**Admin security** - the initial approach bolted `adminOnly` checks onto individual routes, which is easy to miss on new routes. The improved approach mounts `protect + adminOnly` once at the router level in `server.js`, so any route added under `/api/admin` is automatically secured without touching middleware again.

**macOS port conflict** - macOS Monterey reserves port 5000 for AirPlay / AirDrop, which intercepts requests before they reach Node and returns a 403. Solved by either disabling the AirPlay Receiver or using a different port in the `.env` file.

**Browser autoplay restrictions** - browsers block audio from playing automatically on page load. I solved this by attaching a one-time click listener that starts the music on the user's first interaction, after which the vinyl record button toggles it.
