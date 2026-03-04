// ── Data ──────────────────────────────────────────
const products = [
  { id: 1, name: 'Structured Leather Bag',  category: 'Accessories', price: '₹1,45,000', priceNum: 145000, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80' },
  { id: 2, name: 'Tailored Wool Jacket',    category: 'Men',         price: '₹98,000',   priceNum: 98000,  image: 'https://images.unsplash.com/photo-1598522325074-042db73aa4e6?w=600&q=80' },
  { id: 3, name: 'Minimal Leather Loafers', category: 'Men',         price: '₹72,000',   priceNum: 72000,  image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&q=80' },
  { id: 4, name: 'Silk Evening Dress',      category: 'Women',       price: '₹1,20,000', priceNum: 120000, image: 'https://images.unsplash.com/photo-1542060748-10c28b62716f?w=600&q=80' },
  { id: 5, name: 'Cashmere Turtleneck',     category: 'Women',       price: '₹88,000',   priceNum: 88000,  image: 'https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?w=600&q=80' },
  { id: 6, name: 'Slim Tailored Trousers',  category: 'Men',         price: '₹65,000',   priceNum: 65000,  image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80' },
  { id: 7, name: 'Suede Crossbody Bag',     category: 'Accessories', price: '₹95,000',   priceNum: 95000,  image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80' },
  { id: 8, name: 'Draped Linen Coat',       category: 'Women',       price: '₹1,35,000', priceNum: 135000, image: 'https://images.unsplash.com/photo-1545291730-faff8ca1d4b0?w=600&q=80' },
];

// ── Cart state ─────────────────────────────────────
let cart = [];

function formatPrice(num) {
  return '₹' + num.toLocaleString('en-IN');
}

// ── Add to cart ────────────────────────────────────
function addToCart(productId, e) {
  e.stopPropagation();
  const product = products.find(p => p.id === productId);
  if (!product) return;
  const existing = cart.find(item => item.id === productId);
  if (existing) existing.qty += 1;
  else cart.push({ ...product, qty: 1 });
  updateCartCount();
  renderCartDrawer();
  flashCartIcon();
  openCart();
}

// ── Remove from cart ───────────────────────────────
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartCount();
  renderCartDrawer();
}

// ── Change quantity ────────────────────────────────
function changeQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(productId);
  else { updateCartCount(); renderCartDrawer(); }
}

// ── Cart count badge ───────────────────────────────
function updateCartCount() {
  const total = cart.reduce((sum, i) => sum + i.qty, 0);
  const badge = document.getElementById('cart-count');
  badge.textContent = total;
  badge.classList.toggle('hidden', total === 0);
}

// ── Flash cart icon ────────────────────────────────
function flashCartIcon() {
  const icon = document.querySelector('.cart-icon');
  icon.classList.add('bump');
  setTimeout(() => icon.classList.remove('bump'), 400);
}

// ── Render cart drawer contents ────────────────────
function renderCartDrawer() {
  const container = document.getElementById('cart-items');
  const footer    = document.getElementById('cart-footer');

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
        </svg>
        <p>Your bag is empty</p>
        <span>Add items from the collection</span>
      </div>`;
    footer.innerHTML = '';
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" />
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p class="cart-item-price">${item.price}</p>
        <div class="cart-item-qty">
          <button onclick="changeQty(${item.id}, -1)">−</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${item.id}, 1)">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.id})" aria-label="Remove">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>`).join('');

  const total = cart.reduce((sum, i) => sum + i.priceNum * i.qty, 0);
  footer.innerHTML = `
    <div class="cart-total">
      <span>Total</span>
      <span>${formatPrice(total)}</span>
    </div>
    <button class="btn-checkout">Proceed to Checkout</button>
    <button class="btn-continue" onclick="closeCart()">Continue Shopping</button>`;
}

// ── Open / close drawer ────────────────────────────
function openCart() {
  document.getElementById('cart-drawer').classList.add('open');
  document.getElementById('cart-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cart-drawer').classList.remove('open');
  document.getElementById('cart-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ── Render product cards ───────────────────────────
function renderCards(container, items) {
  container.innerHTML = '';
  items.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = `product-card reveal delay-${(i % 4) + 1}`;
    card.innerHTML = `
      <div class="img-wrap">
        <img src="${p.image}" alt="${p.name}" loading="lazy" />
        <button class="add-to-bag" onclick="addToCart(${p.id}, event)">Add to Bag</button>
      </div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <p>${p.price}</p>
      </div>`;
    container.appendChild(card);
  });
  observeReveals();
}

// ── Filter products ────────────────────────────────
function filterProducts(btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const cat = btn.dataset.cat;
  const filtered = cat === 'All' ? products : products.filter(p => p.category === cat);
  renderCards(document.getElementById('collection-grid'), filtered);
}

// ── Page routing ───────────────────────────────────
function goTo(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  window.scrollTo(0, 0);
  updateNav(page);
  history.pushState(null, '', '#' + page);
  closeCart();
  if (page === 'collection') {
    renderCards(document.getElementById('collection-grid'), products);
  }
}

function updateNav(page) {
  const nav = document.getElementById('navbar');
  if (page === 'home') {
    nav.classList.add('over-hero');
    handleScroll();
  } else {
    nav.classList.remove('over-hero');
    nav.classList.add('scrolled');
  }
}

// ── Scroll: navbar transparency ────────────────────
function handleScroll() {
  const nav = document.getElementById('navbar');
  const activePage = document.querySelector('.page.active');
  if (activePage && activePage.id === 'page-home') {
    nav.classList.add('over-hero');
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }
}

window.addEventListener('scroll', handleScroll);

// ── Scroll-reveal via IntersectionObserver ─────────
function observeReveals() {
  const items = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach(el => io.observe(el));
}

// ── Init ───────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderCards(document.getElementById('market-grid-home'), products.slice(0, 4));
  observeReveals();
  updateCartCount();

  const hash = window.location.hash.replace('#', '');
  if (hash && ['home', 'collection', 'campaign'].includes(hash)) {
    goTo(hash);
  }
});

window.addEventListener('popstate', () => {
  const hash = window.location.hash.replace('#', '') || 'home';
  goTo(hash);
});