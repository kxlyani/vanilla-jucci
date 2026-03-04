// ── Data ──────────────────────────────────────────
const products = [
  { id: 1, name: 'Structured Leather Bag',  category: 'Accessories', price: '₹1,45,000', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80' },
  { id: 2, name: 'Tailored Wool Jacket',    category: 'Men',         price: '₹98,000',   image: 'https://images.unsplash.com/photo-1598522325074-042db73aa4e6?w=600&q=80' },
  { id: 3, name: 'Minimal Leather Loafers', category: 'Men',         price: '₹72,000',   image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&q=80' },
  { id: 4, name: 'Silk Evening Dress',      category: 'Women',       price: '₹1,20,000', image: 'https://images.unsplash.com/photo-1542060748-10c28b62716f?w=600&q=80' },
  { id: 5, name: 'Cashmere Turtleneck',     category: 'Women',       price: '₹88,000',   image: 'https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?w=600&q=80' },
  { id: 6, name: 'Slim Tailored Trousers',  category: 'Men',         price: '₹65,000',   image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80' },
  { id: 7, name: 'Suede Crossbody Bag',     category: 'Accessories', price: '₹95,000',   image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80' },
  { id: 8, name: 'Draped Linen Coat',       category: 'Women',       price: '₹1,35,000', image: 'https://images.unsplash.com/photo-1545291730-faff8ca1d4b0?w=600&q=80' },
];

// ── Render product cards ───────────────────────────
function renderCards(container, items) {
  container.innerHTML = '';
  items.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = `product-card reveal delay-${(i % 4) + 1}`;
    card.innerHTML = `
      <div class="img-wrap">
        <img src="${p.image}" alt="${p.name}" loading="lazy" />
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

  const hash = window.location.hash.replace('#', '');
  if (hash && ['home', 'collection', 'campaign'].includes(hash)) {
    goTo(hash);
  }
});

window.addEventListener('popstate', () => {
  const hash = window.location.hash.replace('#', '') || 'home';
  goTo(hash);
});
