// ===== DATA =====

/* 7 coffee / café menu items — images are relative to the HTML file */
const coffeeItems = [
  { id: "c1", name: "Mocha",           price: 220, img: "mocha.jpeg" },
  { id: "c2", name: "Caramel Latte",   price: 240, img: "Caramel%20latte.jpeg" },
  { id: "c3", name: "Cheesecake",      price: 280, img: "Cheesecake.jpeg" },
  { id: "c4", name: "Vanilla Paw",     price: 200, img: "vanilla.jpeg" },
  { id: "c5", name: "Espresso",        price: 160, img: "Espresso.jpeg" },
  { id: "c6", name: "Cappuccino",      price: 190, img: "cappuccino.jpeg" },
  { id: "c7", name: "Pan Cake",        price: 260, img: "pan%20cake.jpeg" },
];

/* Books by category — real covers where provided, OpenLibrary for kids */
const bookData = {
  mystery: [
    { id: "m2", name: "The Guest List",        price: 380, img: "The%20guest%20list.jpeg" },
    { id: "m3", name: "The Silent Patient",    price: 370, img: "The%20silent%20patient.jpeg" },
  ],
  romance: [
    { id: "r1", name: "Twisted Series",        price: 399, img: "Twisted%20series.jpeg" },
  ],
  selfhelp: [
    { id: "s1", name: "Ikigai",            price: 399, img: "Ikigai.jpeg" },
    { id: "s2", name: "Atomic Habits",     price: 450, img: "Atomic%20habits.jpeg" },
    { id: "s3", name: "Rich Dad Poor Dad", price: 380, img: "Rich%20dad%20poor%20dad.jpeg" },
    { id: "s4", name: "The Power of Now",  price: 370, img: "The%20power%20of%20now.jpeg" },
  ],
  kids: [
    { id: "k1", name: "Harry Potter & the Sorcerer's Stone", price: 450, img: "https://covers.openlibrary.org/b/isbn/9780439708180-L.jpg" },
    { id: "k2", name: "The Very Hungry Caterpillar",         price: 250, img: "https://covers.openlibrary.org/b/isbn/9780399226908-L.jpg" },
    { id: "k3", name: "Charlotte's Web",                     price: 280, img: "https://covers.openlibrary.org/b/isbn/9780064400558-L.jpg" },
    { id: "k4", name: "Matilda",                             price: 299, img: "https://covers.openlibrary.org/b/isbn/9780142410370-L.jpg" },
    { id: "k5", name: "Where the Wild Things Are",           price: 260, img: "https://covers.openlibrary.org/b/isbn/9780060254926-L.jpg" },
    { id: "k6", name: "The Lion, the Witch & the Wardrobe", price: 320, img: "https://covers.openlibrary.org/b/isbn/9780064404990-L.jpg" },
    { id: "k7", name: "Winnie-the-Pooh",                    price: 270, img: "https://covers.openlibrary.org/b/isbn/9780525444473-L.jpg" },
  ],
};

// ===== CART STATE =====
let cart = JSON.parse(localStorage.getItem("brewedshelf-cart") || "{}");
const selectedQty = {}; /* per-card qty before adding */

// ===== UTILITIES =====

function saveCart() { localStorage.setItem("brewedshelf-cart", JSON.stringify(cart)); }

function totalCartItems() { return Object.values(cart).reduce((s, i) => s + i.qty, 0); }

function updateCartBadge() { document.getElementById("cart-count").textContent = totalCartItems(); }

function flash(msg) {
  const el = document.createElement("div");
  el.textContent = msg;
  Object.assign(el.style, {
    position: "fixed", bottom: "24px", right: "24px", background: "#7b4f2e",
    color: "#fff", padding: "10px 18px", borderRadius: "8px", zIndex: 9999,
    fontFamily: "sans-serif", fontSize: "14px", boxShadow: "0 4px 12px rgba(0,0,0,.2)"
  });
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2000);
}

// ===== RENDER HELPERS =====

function createCard(item, qtyKey) {
  if (!selectedQty[qtyKey]) selectedQty[qtyKey] = 1;
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <img src="${item.img}" alt="${item.name}" loading="lazy" />
    <div class="card-body">
      <div class="card-title">${item.name}</div>
      <div class="card-price">₹${item.price}</div>
      <div class="qty-row">
        <button class="qty-btn" data-action="minus" data-key="${qtyKey}">−</button>
        <span class="qty-display" id="qty-${qtyKey}">${selectedQty[qtyKey]}</span>
        <button class="qty-btn" data-action="plus" data-key="${qtyKey}">+</button>
      </div>
      <button class="add-btn" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}" data-key="${qtyKey}">
        Add to Cart
      </button>
    </div>
  `;
  return card;
}

// ===== RENDER SECTIONS =====

function renderCoffee() {
  const grid = document.getElementById("coffee-grid");
  grid.innerHTML = "";
  coffeeItems.forEach(item => grid.appendChild(createCard(item, item.id)));
}

function renderBooks(category) {
  const grid = document.getElementById("books-grid");
  grid.innerHTML = "";
  bookData[category].forEach(item => grid.appendChild(createCard(item, item.id)));
}

function renderCart() {
  const container = document.getElementById("cart-items");
  const totalBox  = document.getElementById("cart-total");
  const orderBtn  = document.getElementById("place-order-btn");
  container.innerHTML = "";

  const entries = Object.entries(cart);

  if (entries.length === 0) {
    container.innerHTML = `<p class="empty-cart">Your cart is empty. Add something delightful!</p>`;
    totalBox.style.display  = "none";
    orderBtn.style.display  = "none";
    return;
  }

  let grand = 0;
  entries.forEach(([id, item]) => {
    grand += item.price * item.qty;
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <span class="cart-item-name">${item.name}</span>
      <button class="qty-btn" data-cart-action="minus" data-id="${id}">−</button>
      <span class="qty-display">${item.qty}</span>
      <button class="qty-btn" data-cart-action="plus" data-id="${id}">+</button>
      <span class="cart-item-price">₹${item.price * item.qty}</span>
      <button class="remove-btn" data-cart-action="remove" data-id="${id}" title="Remove">✕</button>
    `;
    container.appendChild(row);
  });

  document.getElementById("grand-total").textContent = `₹${grand}`;
  totalBox.style.display = "flex";
  orderBtn.style.display = "block";
}

// ===== DELIVERY FORM =====

/* Show the delivery form when "Place Order" is clicked */
function showDeliveryForm() {
  document.getElementById("delivery-form").style.display = "block";
  document.getElementById("delivery-form").scrollIntoView({ behavior: "smooth", block: "start" });
}

/* Input guards — only allow characters appropriate for each field */
document.addEventListener("input", (e) => {
  if (e.target.id === "f-name") {
    /* Name: letters, spaces, dots, hyphens only */
    e.target.value = e.target.value.replace(/[^A-Za-z\s.\-]/g, "");
  }
  if (e.target.id === "f-phone") {
    /* Phone: digits only */
    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
  }
  if (e.target.id === "f-addr") {
    /* Address: letters, digits, spaces, commas, hyphens, #, /, dots */
    e.target.value = e.target.value.replace(/[^A-Za-z0-9\s,.\-#/]/g, "");
  }
});

/* Form validation and submission */
document.getElementById("dform").addEventListener("submit", (e) => {
  e.preventDefault();
  let valid = true;

  const name  = document.getElementById("f-name");
  const phone = document.getElementById("f-phone");
  const addr  = document.getElementById("f-addr");
  const slot  = document.getElementById("f-slot");

  /* Clear previous errors */
  ["name","phone","addr","slot"].forEach(k => {
    document.getElementById(`err-${k}`).textContent = "";
    document.getElementById(`f-${k}`).classList.remove("invalid");
  });

  /* Validate name */
  if (name.value.trim().length < 2) {
    document.getElementById("err-name").textContent = "Please enter your full name (letters only).";
    name.classList.add("invalid"); valid = false;
  }

  /* Validate phone: exactly 10 digits */
  if (!/^\d{10}$/.test(phone.value.trim())) {
    document.getElementById("err-phone").textContent = "Enter a valid 10-digit mobile number.";
    phone.classList.add("invalid"); valid = false;
  }

  /* Validate address */
  if (addr.value.trim().length < 10) {
    document.getElementById("err-addr").textContent = "Please enter a complete delivery address.";
    addr.classList.add("invalid"); valid = false;
  }

  /* Validate time slot */
  if (!slot.value) {
    document.getElementById("err-slot").textContent = "Please select a delivery time slot.";
    slot.classList.add("invalid"); valid = false;
  }

  if (!valid) return;

  /* All valid — show success */
  const grand = Object.values(cart).reduce((s, i) => s + i.price * i.qty, 0);
  document.getElementById("success-msg").textContent =
    `Thank you, ${name.value.trim()}! Your order of ₹${grand} will arrive between ${slot.value}. We'll reach you on ${phone.value.trim()}.`;

  document.getElementById("delivery-form").style.display = "none";
  document.getElementById("place-order-btn").style.display = "none";
  document.getElementById("cart-total").style.display = "none";
  document.getElementById("cart-items").style.display = "none";
  document.getElementById("order-success").style.display = "block";

  /* Clear cart */
  cart = {};
  saveCart();
  updateCartBadge();
});

/* Continue shopping — reset cart section to initial state */
function resetOrder() {
  document.getElementById("order-success").style.display = "none";
  document.getElementById("cart-items").style.display = "block";
  document.getElementById("delivery-form").style.display = "none";
  document.getElementById("dform").reset();
  renderCart();
  document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
}

// ===== EVENT DELEGATION =====

document.addEventListener("click", (e) => {
  /* Card qty buttons */
  if (e.target.matches(".qty-btn[data-action]")) {
    const { action, key } = e.target.dataset;
    if (action === "plus")  selectedQty[key] = (selectedQty[key] || 1) + 1;
    if (action === "minus") selectedQty[key] = Math.max(1, (selectedQty[key] || 1) - 1);
    document.getElementById(`qty-${key}`).textContent = selectedQty[key];
    return;
  }

  /* Add to cart */
  if (e.target.matches(".add-btn") && e.target.dataset.id) {
    const { id, name, price, key } = e.target.dataset;
    const qty = selectedQty[key] || 1;
    if (cart[id]) { cart[id].qty += qty; }
    else { cart[id] = { name, price: Number(price), qty }; }
    saveCart(); updateCartBadge(); renderCart();
    flash(`✓ Added ${qty}× ${name}`);
    return;
  }

  /* Cart controls */
  if (e.target.matches(".qty-btn[data-cart-action]")) {
    const { cartAction: action, id } = e.target.dataset;
    if (!cart[id]) return;
    if (action === "plus")  cart[id].qty += 1;
    if (action === "minus") { cart[id].qty -= 1; if (cart[id].qty <= 0) delete cart[id]; }
    if (action === "remove") delete cart[id];
    saveCart(); updateCartBadge(); renderCart();
    return;
  }

  /* Category tabs */
  if (e.target.matches(".tab")) {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    e.target.classList.add("active");
    renderBooks(e.target.dataset.cat);
  }
});

// ===== INIT =====
renderCoffee();
renderBooks("mystery");
renderCart();
updateCartBadge();
