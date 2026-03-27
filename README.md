31748 Programming on the Internet - Assignment 1
24754069 Domenic Carzo

# PokéCart (Pokemon TCG Store)

A single page e-commerce app for browsing and purchasing Pokemon TCG products!

# Problem
Pokémon card collectors often have to browse multiple retail stores, fist fight scalpers, or pay ridiculous prices to get their hands on sealed products across different sets.
PokéCart solves this by providing a clean, single-page storefront where users can browse a variety of sealed products, filter by set, and manage a persistent shopping cart — all without leaving the page (and for a fair price!)

# Tech Stack
Frontend -> HTML, CSS, Javascript
Styling -> CSS
Data -> Browswer localStorage (persistent cart)
Deployment -> Static (open index.html via Live Server)

# Feature List
- Catalogue of sealed Pokémon TCG Products
- Live search - filters products as you type
- Category filter chips - filter by set (e.g. Mega Evolution, Phantasmal Flames, etc)
- Add products to cart with a single click
- Adjust item quantities directly in the cart
- Remove individual items from the cart
- Cart persists across page refreshes via localStorage
- Order summary with automatic subtotal
- Promo code input at checkout
- Order confirmation screen after checkout
- Background Poké Mart music with a spinning vinyl record - click to pause/play

# Folder Structure
website/
├── index.html
├── app.js
├── stylesheet.css
├── images/
│   ├── pokeball-logo.png
│   ├── mega-evolution-booster-box.jpg
│   ├── mega-evolution-booster-bundle.jpg
│   ├── mega-evolution-etb.png
│   ├── etc
└── audio/
    └── pokemart.mp3

# Challenges
One of the biggest challenges was getting the app to behave like a single-page application without using any frameworks like React. Instead of loading new pages, all three views (shop, cart and order confirmation) are kept in the DOM and shown or hidden using JavaScript. Getting the cart to stay in sync was also tricky as rather than storing all the product details in localStorage, I only store the product ID and quantity for each cart item and look up the full product details at render time, which keeps things clean and avoids duplicating data.

Another challenge was the promo code feature. I had to introduce a separate promoApplied variable to keep track of whether the discount was active, otherwise the 10% off would disappear every time the cart re-rendered.

The background music was harder than expected because browsers won't let audio play automatically when the page loads because they require the user to interact with the page first. To get around this I added an event listener that starts the music on the user's first click anywhere on the page, after which they can toggle it on and off using the vinyl record button in the corner.