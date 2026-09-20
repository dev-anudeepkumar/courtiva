// ============================================================
// COURTIVA — site interactions
// ============================================================

// ---------- Element references (grabbed once, used everywhere below) ----------
const header = document.getElementById('siteHeader');
const heroCarousel = document.getElementById('heroCarousel');
const heroSlides = document.querySelectorAll('.hero-slide');
const heroDots = document.querySelectorAll('.hero-dot');
const heroPrevBtn = document.getElementById('heroPrev');
const heroNextBtn = document.getElementById('heroNext');
const pageContent = document.getElementById('pageContent');
const shopContent = document.getElementById('shopContent');
const productContent = document.getElementById('productContent');
const wishlistContent = document.getElementById('wishlistContent');
const homeContent = document.getElementById('homeContent');
const pageTitle = document.getElementById('pageTitle');
const pageEyebrow = document.getElementById('pageEyebrow');
const pageBody = document.getElementById('pageBody');
const backHomeLink = document.querySelector('.back-home');
// .navlink-home and .navlink-shop each appear more than once on the page
// (header nav, footer, breadcrumb) so these are ALL matching elements,
// not just one — hence "Links" (plural) and querySelectorAll.
const homeNavLinks = document.querySelectorAll('.navlink-home');
const shopNavLinks = document.querySelectorAll('.navlink-shop');
const tabs = document.querySelectorAll('.tab');
const signupForm = document.querySelector('.signup');
const cartButton = document.getElementById('cartButton');
const cartCountEl = document.getElementById('cartCount');
const wishlistButton = document.getElementById('wishlistButton');
const wishlistCountEl = document.getElementById('wishlistCount');
const wishlistEmpty = document.getElementById('wishlistEmpty');
const wishlistTable = document.getElementById('wishlistTable');
const wishlistRows = document.getElementById('wishlistRows');
const wishlistShare = document.getElementById('wishlistShare');
const wishlistShareUrl = document.getElementById('wishlistShareUrl');
const wishlistShareBtn = document.getElementById('wishlistShareBtn');
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const cartItemsEl = document.getElementById('cartItems');
const cartEmptyEl = document.getElementById('cartEmpty');
const cartSubtotalEl = document.getElementById('cartSubtotal');
const closeCartBtn = document.getElementById('closeCart');
const checkoutFallbackBtn = document.getElementById('checkoutFallbackBtn');
const checkoutStatus = document.getElementById('checkoutStatus');
const legacyCheckoutBtn = document.getElementById('checkoutBtn'); // older/simpler cart markup, if present instead of the PayPal version below
const quickViewOverlay = document.getElementById('quickViewOverlay');
const quickViewModal = document.getElementById('quickViewModal');
const quickViewClose = document.getElementById('quickViewClose');
const quickViewImage = document.getElementById('quickViewImage');
const quickViewBadge = document.getElementById('quickViewBadge');
const quickViewBrand = document.getElementById('quickViewBrand');
const quickViewTitle = document.getElementById('quickViewTitle');
const quickViewPrice = document.getElementById('quickViewPrice');
const quickViewDesc = document.getElementById('quickViewDesc');
const quickViewQtyValue = document.getElementById('quickViewQtyValue');
const quickViewQtyMinus = document.getElementById('quickViewQtyMinus');
const quickViewQtyPlus = document.getElementById('quickViewQtyPlus');
const quickViewAddToCart = document.getElementById('quickViewAddToCart');
const quickViewWishlist = document.getElementById('quickViewWishlist');
const quickViewWishlistLabel = document.getElementById('quickViewWishlistLabel');
const quickViewShare = document.getElementById('quickViewShare');
const quickViewShareLabel = document.getElementById('quickViewShareLabel');
const productContentTitle = document.getElementById('productBreadcrumbTitle');
const productBreadcrumbCategoryWrap = document.getElementById('productBreadcrumbCategoryWrap');
const productBreadcrumbCategory = document.getElementById('productBreadcrumbCategory');
const productBadge = document.getElementById('productBadge');
const productImage = document.getElementById('productImage');
const productThumbnails = document.getElementById('productThumbnails');
const productBrand = document.getElementById('productBrand');
const productTitle = document.getElementById('productTitle');
const productRatingRow = document.getElementById('productRatingRow');
const productPrice = document.getElementById('productPrice');
const productDesc = document.getElementById('productDesc');
const productQtyValue = document.getElementById('productQtyValue');
const productQtyMinus = document.getElementById('productQtyMinus');
const productQtyPlus = document.getElementById('productQtyPlus');
const productAddToCart = document.getElementById('productAddToCart');
const productWishlist = document.getElementById('productWishlist');
const productWishlistLabel = document.getElementById('productWishlistLabel');
const productShare = document.getElementById('productShare');
const productShareLabel = document.getElementById('productShareLabel');
const productSku = document.getElementById('productSku');
const productCategoryEl = document.getElementById('productCategory');
const productTag = document.getElementById('productTag');
const productStory = document.getElementById('productStory');
const accordionReviewsLabel = document.getElementById('accordionReviewsLabel');
const relatedGrid = document.getElementById('relatedGrid');
const recentlyViewedSection = document.getElementById('recentlyViewedSection');
const recentlyViewedGrid = document.getElementById('recentlyViewedGrid');


// ---------- 1) Header text color ----------
// The header needs dark text once you scroll past the hero image, OR
// whenever a "Pages" sub-page (About Us, FAQ, etc.) or the Shop page is
// open — because those have a plain white background, not the dark
// hero photo, so white header text would be invisible on them.
function onScroll() {
  const subPageOpen = !pageContent.hidden || !shopContent.hidden || !productContent.hidden || !wishlistContent.hidden;
  header.classList.toggle('scrolled', subPageOpen || window.scrollY > 40);
}

window.addEventListener('scroll', onScroll);
onScroll(); // run once on load in case the page opens mid-scroll


// ---------- 2) Mobile nav menu ----------
// Below 980px wide, the header hides the normal nav links and shows this
// burger button instead (see style.css, ".navlinks{display:none}" and
// ".burger{display:block}" inside the 980px breakpoint) — this is what
// makes tapping it actually open a menu with those same links, which it
// previously didn't do at all.
const burgerButton = document.getElementById('burgerButton');
const mobileNav = document.getElementById('mobileNav');
const mobileNavOverlay = document.getElementById('mobileNavOverlay');

function closeMobileNav() {
  mobileNav.classList.remove('open');
  mobileNavOverlay.classList.remove('open');
  burgerButton.setAttribute('aria-expanded', 'false');
}

function toggleMobileNav() {
  const isOpen = mobileNav.classList.toggle('open');
  mobileNavOverlay.classList.toggle('open', isOpen);
  burgerButton.setAttribute('aria-expanded', String(isOpen));
}

if (burgerButton) {
  burgerButton.addEventListener('click', toggleMobileNav);
  mobileNavOverlay.addEventListener('click', closeMobileNav);
  // Closes the menu after tapping any link inside it — otherwise it
  // would stay open, covering the page you just navigated to.
  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMobileNav);
  });
}


// ---------- 3) Hero banner carousel ----------
// Auto-advances every 6 seconds, pauses while the visitor's mouse is over
// the hero, and can be controlled manually with the dots or the arrow
// buttons (either of which also resets the auto-advance timer, so it
// doesn't jump to another slide right after someone picks one).
let heroIndex = 0;
let heroTimer = null;
const HERO_INTERVAL = 6000;

function goToHeroSlide(index) {
  if (heroSlides.length === 0) return;
  heroIndex = (index + heroSlides.length) % heroSlides.length; // wraps around both directions

  heroSlides.forEach((slide, i) => slide.classList.toggle('active', i === heroIndex));
  heroDots.forEach((dot, i) => dot.classList.toggle('active', i === heroIndex));
}

function nextHeroSlide() {
  goToHeroSlide(heroIndex + 1);
}

function prevHeroSlide() {
  goToHeroSlide(heroIndex - 1);
}

function startHeroAutoplay() {
  stopHeroAutoplay(); // avoid stacking up multiple timers
  heroTimer = setInterval(nextHeroSlide, HERO_INTERVAL);
}

function stopHeroAutoplay() {
  if (heroTimer) clearInterval(heroTimer);
}

if (heroCarousel && heroSlides.length > 1) {
  startHeroAutoplay();
  heroCarousel.addEventListener('mouseenter', stopHeroAutoplay);
  heroCarousel.addEventListener('mouseleave', startHeroAutoplay);

  heroDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      goToHeroSlide(Number(dot.dataset.slide));
      startHeroAutoplay(); // reset the timer so it doesn't advance again too soon
    });
  });

  if (heroNextBtn) {
    heroNextBtn.addEventListener('click', () => {
      nextHeroSlide();
      startHeroAutoplay();
    });
  }
  if (heroPrevBtn) {
    heroPrevBtn.addEventListener('click', () => {
      prevHeroSlide();
      startHeroAutoplay();
    });
  }
}


// ---------- 4) "Featured / New / Top Rated" product tabs ----------
tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');
    // NOTE: this only switches the visual "active" tab for now.
    // To actually filter products, you'd swap which .product-card
    // elements are shown based on tab.dataset.tab (e.g. "new", "top").
  });
});


// ---------- 5) Loading each page's text from the #pageSources block ----------
// The wording for each "Pages" dropdown entry is written directly in
// index.html inside <div id="pageSources" hidden> — one <div data-page="...">
// per page, holding its <p> paragraphs. Reading it here is just copying
// that block's HTML into #pageBody, so it works instantly with no network
// request at all (this replaced an earlier fetch()-based version, which
// only worked when the site was served from a real web server — opening
// index.html directly by double-clicking it made those requests fail).
const pageSources = document.getElementById('pageSources');

function loadPageText(pageName) {
  const source = pageSources.querySelector(`[data-page="${pageName}"]`);
  if (!source) {
    console.warn(`No content found in #pageSources for "${pageName}".`);
    return '<p>Content coming soon.</p>';
  }
  return source.innerHTML;
}


// ---------- 6) Scroll-reveal animation (used on the About Us page) ----------
// Any element marked data-reveal fades/slides into place once it scrolls
// into view, rather than just appearing instantly. This is written to work
// on whichever page is currently showing, not just About Us specifically —
// so it's reusable if data-reveal gets added to other pages later.
//
// Because #pageBody's content is replaced with fresh HTML every time
// showPage() runs (see loadPageText() above), any previous observer needs
// to be thrown away and a new one set up each time — otherwise it would
// still be watching old, now-detached elements instead of the new ones.
let revealObserver = null;

function initScrollReveal() {
  if (revealObserver) revealObserver.disconnect();

  const targets = pageBody.querySelectorAll('[data-reveal]');
  if (targets.length === 0) return;

  targets.forEach((el) => el.classList.remove('in-view')); // reset, in case this page was visited before

  revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target); // each element only needs to reveal once
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => revealObserver.observe(el));
}


// ---------- 7) Switching between the homepage, a "Pages" sub-page, and the Shop page ----------
// All three sections are siblings that get shown/hidden together, so this
// one helper is the single place that decides which one is visible.
function setActiveSection(section) {
  homeContent.hidden = section !== 'home';
  pageContent.hidden = section !== 'page';
  shopContent.hidden = section !== 'shop';
  productContent.hidden = section !== 'product';
  wishlistContent.hidden = section !== 'wishlist';
  onScroll(); // header text color depends on which section is showing
  // Explicit behavior:'instant' here overrides the site's global
  // scroll-behavior:smooth (see style.css, html{}) — that CSS rule is
  // great for anchor links like the hero's "Shop Now" button, but an
  // animated scroll taking time to finish was exactly what confused the
  // scroll-reveal system on the About Us page: it was measuring what's
  // "in view" before the animated scroll had actually finished landing
  // back at the top of the new page.
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
}

function showPage(pageName) {
  pageEyebrow.textContent = 'Pages';
  pageTitle.textContent = pageName;
  pageBody.innerHTML = loadPageText(pageName);

  // Adds a class like "page-about-us" (built from the page's name) so a
  // specific sub-page can be styled differently in style.css if needed —
  // e.g. .page-about-us .page-content-inner{max-width:...}. Every other
  // page keeps sharing the same default look unless it gets a similar rule.
  const slug = 'page-' + pageName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  pageContent.className = 'page-content ' + slug;

  setActiveSection('page');
  initScrollReveal();
}

function showHome() {
  setActiveSection('home');
}

function showShop() {
  setActiveSection('shop');
}

// Targets any <a data-page="..."> link, not just ones inside a dropdown —
// this is what the header's "About Us" link uses now that "Pages" isn't
// a dropdown anymore. Using the "a" tag here (rather than a bare
// "[data-page]") is what keeps this from also matching the Shop page's
// pagination buttons, which are <button> elements that happen to reuse
// the same data-page attribute name for an unrelated purpose (page
// number, not page name).
document.querySelectorAll('a[data-page]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    showPage(link.dataset.page);
  });
});

if (backHomeLink) {
  backHomeLink.addEventListener('click', (event) => {
    event.preventDefault();
    showHome();
  });
}

// .navlink-home and .navlink-shop each appear more than once on the page
// (header nav, footer, shop breadcrumb), so every matching link needs its
// own click listener — that's why these loop over querySelectorAll results.
homeNavLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    showHome();
  });
});

shopNavLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    showShop();
  });
});


// ---------- 8) Shop page: category filter + sorting ----------
// Products are plain HTML (<article class="product-card">) rather than
// data pulled from JS, which keeps things simple — filtering/sorting just
// hides cards or reorders the existing elements in the page, it doesn't
// generate any new HTML.
const categoryTiles = document.querySelectorAll('.category-tile');
const shopGrid = document.getElementById('shopGrid');
const featuredGrid = document.getElementById('featuredGrid');
const shopEmpty = document.getElementById('shopEmpty');
const shopResultsCount = document.getElementById('shopResultsCount');
const sortSelect = document.getElementById('sortSelect');

function applyShopFilter() {
  if (!shopGrid) return;

  const activeTile = document.querySelector('.category-tile.active');
  const category = activeTile ? activeTile.dataset.category : 'all';
  const cards = Array.from(shopGrid.querySelectorAll('.product-card'));

  let visibleCount = 0;
  cards.forEach((card) => {
    const matches = category === 'all' || card.dataset.category === category;
    card.hidden = !matches;
    if (matches) visibleCount += 1;
  });

  if (shopResultsCount) {
    shopResultsCount.textContent = `Showing ${visibleCount} of ${cards.length} results`;
  }
  if (shopEmpty) {
    shopEmpty.hidden = visibleCount !== 0;
  }
}

categoryTiles.forEach((tile) => {
  tile.addEventListener('click', () => {
    categoryTiles.forEach((t) => t.classList.remove('active'));
    tile.classList.add('active');
    applyShopFilter();
  });
});

if (sortSelect && shopGrid) {
  sortSelect.addEventListener('change', () => {
    const mode = sortSelect.value;
    const cards = Array.from(shopGrid.querySelectorAll('.product-card'));

    if (mode === 'price-asc') {
      cards.sort((a, b) => parseFloat(a.dataset.price) - parseFloat(b.dataset.price));
    } else if (mode === 'price-desc') {
      cards.sort((a, b) => parseFloat(b.dataset.price) - parseFloat(a.dataset.price));
    } else if (mode === 'name-asc') {
      cards.sort((a, b) => a.dataset.name.localeCompare(b.dataset.name));
    }
    // "default" falls through and leaves the original HTML order as-is

    // re-appending an element that's already in the DOM MOVES it rather
    // than duplicating it — that's what actually reorders the grid
    cards.forEach((card) => shopGrid.appendChild(card));
  });
}

// run once on load so the results count is correct from the start
applyShopFilter();


// Formats a number as US currency with a thousands separator, e.g.
// formatPrice(2400) -> "$2,400.00". Used anywhere a price is displayed
// (cart, Quick View, Product Page) so they all look consistent.
function formatPrice(amount) {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}


// ---------- 9) Shopping cart ----------
// Cart items are saved to localStorage, so the cart survives a page
// refresh (but is specific to this browser — there's no server involved).
const CART_STORAGE_KEY = 'courtiva-cart';

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('Could not read saved cart, starting with an empty one.', err);
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (err) {
    console.warn('Could not save cart to localStorage.', err);
  }
}

// cart is an array of { name, price, qty } objects
let cart = loadCart();

function cartTotalQty() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function cartSubtotal() {
  return cart.reduce((sum, item) => sum + item.qty * item.price, 0);
}

// Updates the little number badge on the header cart icon.
// Shows nothing at all when the cart is empty, per the design.
function renderCartBadge() {
  const qty = cartTotalQty();
  if (qty > 0) {
    cartCountEl.textContent = String(qty);
    cartCountEl.hidden = false;
  } else {
    cartCountEl.textContent = '';
    cartCountEl.hidden = true;
  }
}

// Rebuilds the list of items shown inside the cart drawer.
function renderCartDrawer() {
  cartItemsEl.innerHTML = '';

  if (cart.length === 0) {
    cartEmptyEl.hidden = false;
  } else {
    cartEmptyEl.hidden = true;

    cart.forEach((item, index) => {
      const row = document.createElement('div');
      row.className = 'cart-item';
      row.innerHTML = `
        <div class="cart-item-info">
          <p class="cart-item-name">${item.name}</p>
          <p class="cart-item-price">${formatPrice(item.price)}</p>
        </div>
        <div class="cart-item-qty">
          <button type="button" class="qty-btn" data-action="decrease" data-index="${index}" aria-label="Decrease quantity">&minus;</button>
          <span>${item.qty}</span>
          <button type="button" class="qty-btn" data-action="increase" data-index="${index}" aria-label="Increase quantity">+</button>
        </div>
        <button type="button" class="cart-item-remove" data-action="remove" data-index="${index}" aria-label="Remove ${item.name} from cart">&times;</button>
      `;
      cartItemsEl.appendChild(row);
    });
  }

  cartSubtotalEl.textContent = formatPrice(cartSubtotal());
}

// Call this any time `cart` changes, so the badge, the drawer, and
// localStorage all stay in sync with each other.
function updateCartUI() {
  renderCartBadge();
  renderCartDrawer();
  saveCart();
}

function openCart() {
  cartDrawer.classList.add('open');
  cartOverlay.classList.add('open');
}

function closeCart() {
  cartDrawer.classList.remove('open');
  cartOverlay.classList.remove('open');
}

function addToCart(id, name, price, qty = 1) {
  // Matched by id, not name — a few products (Aurelia, Sena, Viora) share
  // a display name across two genuinely different items (one in the Shop,
  // one in Featured Products), so name alone isn't a safe way to tell
  // cart line items apart. Falls back to matching by name for any cart
  // already saved in a visitor's browser from before this existed.
  const existing = cart.find((item) => (item.id && id ? item.id === id : item.name === name));
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id, name, price, qty });
  }
  updateCartUI();
  openCart(); // show the drawer so the user gets visual confirmation
}

function changeQty(index, delta) {
  const item = cart[index];
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart.splice(index, 1); // remove it once qty hits 0
  updateCartUI();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

// "Add to Cart" buttons on each product card. Delegated on document
// (rather than looping over buttons that exist right now) so this also
// works for product cards added to the page later — e.g. the Related
// Products and Recently Viewed rows on the product overview page, which
// are built dynamically with JavaScript.
document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-add-to-cart]');
  if (!button) return;
  event.preventDefault();
  const card = button.closest('.product-card');
  if (!card) return;
  addToCart(card.dataset.productId, card.dataset.name, parseFloat(card.dataset.price));
});

// Header cart icon opens the drawer; overlay/× button close it
if (cartButton) cartButton.addEventListener('click', openCart);
if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

// +/- and remove buttons inside the drawer (added via one shared
// "event delegation" listener, since the rows are re-created each time)
if (cartItemsEl) {
  cartItemsEl.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const index = Number(button.dataset.index);
    if (button.dataset.action === 'increase') changeQty(index, 1);
    if (button.dataset.action === 'decrease') changeQty(index, -1);
    if (button.dataset.action === 'remove') removeFromCart(index);
  });
}

// ---------- PayPal Checkout ----------
// If window.PAYPAL_CLIENT_ID (set in index.html) hasn't been filled in
// yet, we keep the old placeholder "Checkout" button and its demo alert
// exactly as before — nothing breaks for anyone who hasn't set PayPal up.
// Once a real Client ID is added, this renders PayPal's own Buy/Checkout
// buttons instead, wired up to the create-order/capture-order functions
// in /netlify/functions/. See GOING-LIVE.md and SETUP.md for the full
// walkthrough of getting a Client ID and deploying those functions.
function showCheckoutStatus(message, isError) {
  if (!checkoutStatus) return; // guards against the older/simpler cart markup, which doesn't have this element
  checkoutStatus.textContent = message;
  checkoutStatus.hidden = false;
  checkoutStatus.classList.toggle('error', !!isError);
}

function loadPayPalSdk(clientId, currency) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=${encodeURIComponent(currency)}`;
    script.onload = resolve;
    script.onerror = () => reject(new Error('Could not load the PayPal SDK.'));
    document.head.appendChild(script);
  });
}

async function initPayPalCheckout() {
  // This cart markup can currently be in one of two states depending on
  // what's in index.html: the newer PayPal version (a #paypal-button-
  // container + a hidden #checkoutFallbackBtn), or the older, simpler
  // version (just a plain #checkoutBtn with no PayPal markup at all).
  // Handling both here means this file won't silently break — or throw
  // console errors — no matter which one index.html currently has.
  if (!checkoutFallbackBtn && !document.getElementById('paypal-button-container')) {
    // Old/simple cart markup: just wire up the demo alert, same as this
    // project did before PayPal was ever added, and stop here.
    if (legacyCheckoutBtn) {
      legacyCheckoutBtn.addEventListener('click', () => {
        alert('This is a demo store, so checkout isn\u2019t connected to a payment processor yet. See GOING-LIVE.md to set up real PayPal payments.');
      });
    }
    return;
  }

  if (!window.PAYPAL_CLIENT_ID) {
    // Not configured yet — keep the old demo placeholder behavior.
    checkoutFallbackBtn.hidden = false;
    checkoutFallbackBtn.addEventListener('click', () => {
      alert('This is a demo store, so checkout isn\u2019t connected to a payment processor yet. See GOING-LIVE.md to set up real PayPal payments.');
    });
    return;
  }

  try {
    await loadPayPalSdk(window.PAYPAL_CLIENT_ID, window.PAYPAL_CURRENCY || 'USD');

    window.paypal.Buttons({
      // Called when the customer clicks a PayPal button. We only ever
      // send product NAMES and QUANTITIES — never prices — because the
      // server (netlify/functions/create-order.js) looks up the real
      // price itself. This is what stops someone from tampering with
      // prices in the browser before checkout.
      createOrder: async () => {
        showCheckoutStatus('Starting checkout…', false);
        const response = await fetch('/api/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: cart.map((item) => ({ id: item.id, qty: item.qty })),
          }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Could not start checkout.');
        return data.id;
      },

      onApprove: async (data) => {
        showCheckoutStatus('Finishing up…', false);
        const response = await fetch('/api/capture-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderID: data.orderID }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Payment could not be completed.');

        cart = [];
        updateCartUI();
        showCheckoutStatus('Thank you! Your payment was successful.', false);
      },

      onCancel: () => {
        showCheckoutStatus('Checkout cancelled.', false);
      },

      onError: (err) => {
        console.error('PayPal checkout error:', err);
        showCheckoutStatus('Something went wrong with checkout. Please try again.', true);
      },
    }).render('#paypal-button-container');
  } catch (err) {
    console.error('Could not set up PayPal Checkout:', err);
    // Fall back to the placeholder button so checkout isn't just broken
    checkoutFallbackBtn.hidden = false;
    checkoutFallbackBtn.addEventListener('click', () => {
      alert('Checkout is temporarily unavailable. Please try again later.');
    });
  }
}

initPayPalCheckout();

// reflect any cart saved from a previous visit as soon as the page loads
updateCartUI();


// ---------- 10) Reading a product card's details ----------
// Both Quick View and the Product Overview page need the same
// information out of whichever <article class="product-card"> was
// clicked, so it's pulled together here once instead of twice.
function getProductDataFromCard(card) {
  const title = card.querySelector('.product-name')?.textContent.trim() || '';
  const brand = card.querySelector('.product-brand')?.textContent.trim() || card.dataset.brand || 'Courtiva';
  const price = parseFloat(card.dataset.price);
  const desc = card.dataset.desc || card.querySelector('.product-desc')?.textContent.trim() || '';
  const imgSrc = card.querySelector('img')?.getAttribute('src') || '';
  const imgAlt = card.querySelector('img')?.getAttribute('alt') || title;
  const badgeHTML = card.querySelector('.badge')?.innerHTML || null;
  const rating = card.querySelector('.product-rating') ? true : false;
  const category = card.dataset.category || null;

  // The card itself only ever has ONE <img> (its cover photo) — the full
  // gallery for the Product Page comes from the catalog data this card
  // was originally rendered from, found via its data-product-id.
  const catalogEntry = productCatalogById[card.dataset.productId];
  const images = catalogEntry
    ? getProductImages(catalogEntry).map((file) => `${PRODUCTS_BASE}/${card.dataset.productId}/${file}`)
    : [imgSrc];

  return { id: card.dataset.productId, name: card.dataset.name, title, brand, price, desc, imgSrc, imgAlt, badgeHTML, rating, category, images };
}


// ---------- 11) Quick View modal ----------
// Clicking "Quick View" on a product card reads that card's details
// (via getProductDataFromCard above) and fills in the modal, rather
// than needing a separate page or a second copy of each product's
// details anywhere.
let quickViewProduct = null; // { id, name, price } of whatever's currently open
let quickViewQty = 1;

function openQuickView(card) {
  const data = getProductDataFromCard(card);

  quickViewProduct = { id: data.id, name: data.name, price: data.price };
  quickViewQty = 1;

  quickViewBrand.textContent = data.brand;
  quickViewTitle.textContent = data.title;
  quickViewPrice.textContent = formatPrice(data.price);
  quickViewDesc.textContent = data.desc;
  quickViewImage.src = data.imgSrc;
  quickViewImage.alt = data.imgAlt;
  quickViewBadge.hidden = !data.badgeHTML;
  if (data.badgeHTML) quickViewBadge.innerHTML = data.badgeHTML;
  quickViewQtyValue.textContent = quickViewQty;

  // reflect this product's real wishlist state (rather than always
  // resetting to "not wishlisted") — syncWishlistIcons() also does this,
  // but quickViewProduct isn't set until the line above runs, so it's
  // done directly here too for the very first paint of the modal
  const isWishlistedAlready = isWishlisted(data.name);
  quickViewWishlist.classList.toggle('active', isWishlistedAlready);
  quickViewWishlistLabel.textContent = isWishlistedAlready ? 'Added to Wishlist' : 'Add to Wishlist';

  quickViewOverlay.classList.add('open');
  quickViewModal.classList.add('open');
}

function closeQuickView() {
  quickViewOverlay.classList.remove('open');
  quickViewModal.classList.remove('open');
}

// Same reasoning as the "Add to Cart" listener above: delegated so it
// also works for dynamically-added product cards.
document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-quick-view]');
  if (!button) return;
  event.preventDefault();
  const card = button.closest('.product-card');
  if (card) openQuickView(card);
});

quickViewClose.addEventListener('click', closeQuickView);
quickViewOverlay.addEventListener('click', closeQuickView);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && quickViewModal.classList.contains('open')) {
    closeQuickView();
  }
});

quickViewQtyMinus.addEventListener('click', () => {
  quickViewQty = Math.max(1, quickViewQty - 1);
  quickViewQtyValue.textContent = quickViewQty;
});

quickViewQtyPlus.addEventListener('click', () => {
  quickViewQty += 1;
  quickViewQtyValue.textContent = quickViewQty;
});

quickViewAddToCart.addEventListener('click', () => {
  if (!quickViewProduct) return;
  addToCart(quickViewProduct.id, quickViewProduct.name, quickViewProduct.price, quickViewQty);
  closeQuickView(); // addToCart() already opens the cart drawer to confirm
});

// Wishlist here is visual-only (not saved anywhere) — a real wishlist
// would need its own storage, similar to how the cart uses localStorage.
// Wishlist here calls the shared toggleWishlist() (see the "Wishlist"
// section further down) which also updates this button's own look —
// that's what keeps it in sync with the product's heart icon elsewhere
// on the site (its card, the Product Page, etc.).
quickViewWishlist.addEventListener('click', () => {
  if (quickViewProduct) toggleWishlist(quickViewProduct.name);
});

quickViewShare.addEventListener('click', async () => {
  const title = quickViewTitle.textContent;
  const shareData = { title: `Courtiva — ${title}`, text: `Check out ${title} on Courtiva`, url: window.location.href };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (err) {
      // ignore — most often just means the visitor cancelled the share sheet
    }
    return;
  }

  // fallback for browsers without the native Share API: copy a link instead
  try {
    await navigator.clipboard.writeText(shareData.url);
    quickViewShareLabel.textContent = 'Link Copied';
    setTimeout(() => { quickViewShareLabel.textContent = 'Share'; }, 2000);
  } catch (err) {
    console.warn('Could not copy link to clipboard.', err);
  }
});


// ---------- 12) Product Overview Page ----------
// One page template, filled in with whichever product was clicked —
// see getProductDataFromCard() above for where the details come from.
// Clicking a product's photo or name (anywhere: Shop page, Featured
// Products, Related Products, Recently Viewed) opens this via event
// delegation, the same pattern used for Add to Cart and Quick View.
let productPageProduct = null; // { id, name, price } of whatever's currently open
let productPageQty = 1;

// Turns a product name into a short, deterministic, decorative SKU —
// this is NOT a real inventory code, just something to fill that field
// with rather than leaving it blank or inventing an unrelated one each
// visit. E.g. "Crossback Halter Dress" + $2,400 -> "CRO-2400".
function makeFakeSku(title, price) {
  const initials = title
    .replace(/[^a-zA-Z ]/g, '')
    .split(' ')
    .filter(Boolean)[0]
    ?.slice(0, 3)
    .toUpperCase() || 'CRT';
  return `${initials}-${Math.round(price)}`;
}

function renderMiniProductGrid(container, cards) {
  container.innerHTML = cards.map((card) => card.outerHTML).join('');
}

// Related Products: other items from the same category (data-category),
// pulled from the Shop page's product set since that's the fullest
// catalog on the site. Pads with other shop products if a category has
// fewer than 4 other items in it.
function renderRelatedProducts(currentCard) {
  const category = currentCard.dataset.category;
  const allShopCards = Array.from(document.querySelectorAll('#shopGrid .product-card'))
    .filter((card) => card.dataset.name !== currentCard.dataset.name);

  let related = category ? allShopCards.filter((card) => card.dataset.category === category) : [];
  if (related.length < 4) {
    const fillers = allShopCards.filter((card) => !related.includes(card));
    related = related.concat(fillers.slice(0, 4 - related.length));
  }
  related = related.slice(0, 4);

  relatedGrid.hidden = related.length === 0;
  document.getElementById('relatedSection').hidden = related.length === 0;
  renderMiniProductGrid(relatedGrid, related);
}

// Recently Viewed: a small list of product names kept in localStorage,
// most-recent first, capped at 4, excluding whatever's open right now.
const RECENTLY_VIEWED_KEY = 'courtiva-recently-viewed';

function getRecentlyViewed() {
  try {
    const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

function addToRecentlyViewed(name) {
  let list = getRecentlyViewed().filter((n) => n !== name);
  list.unshift(name);
  list = list.slice(0, 4);
  try {
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(list));
  } catch (err) {
    console.warn('Could not save recently-viewed list.', err);
  }
}

function renderRecentlyViewed(currentName) {
  const names = getRecentlyViewed().filter((n) => n !== currentName);
  const allCards = Array.from(document.querySelectorAll('.product-card'));
  const cards = names
    .map((name) => allCards.find((card) => card.dataset.name === name))
    .filter(Boolean)
    .slice(0, 4);

  recentlyViewedSection.hidden = cards.length === 0;
  renderMiniProductGrid(recentlyViewedGrid, cards);
}

// Sets the Product Page's main photo, and builds the thumbnail strip
// underneath it — but only when there's more than one photo to choose
// from. A product with just one image looks exactly like it always did,
// no empty thumbnail row left behind.
function renderProductGallery(images, alt) {
  const list = images && images.length ? images : [''];

  productImage.src = list[0];
  productImage.alt = alt;

  if (list.length < 2) {
    productThumbnails.innerHTML = '';
    return;
  }

  productThumbnails.innerHTML = list
    .map(
      (src, i) => `
        <button type="button" class="product-thumbnail${i === 0 ? ' active' : ''}" data-thumb-src="${escapeAttr(src)}" aria-label="Show photo ${i + 1}">
          <img src="${escapeAttr(src)}" alt="">
        </button>
      `
    )
    .join('');
}

// Delegated so it keeps working no matter how many times the thumbnail
// strip gets rebuilt (a fresh set of buttons each time a product opens).
productThumbnails.addEventListener('click', (event) => {
  const button = event.target.closest('.product-thumbnail');
  if (!button) return;

  productImage.src = button.dataset.thumbSrc;
  productThumbnails.querySelectorAll('.product-thumbnail').forEach((btn) => {
    btn.classList.toggle('active', btn === button);
  });
});

function openProductPage(card) {
  const data = getProductDataFromCard(card);

  productPageProduct = { id: data.id, name: data.name, price: data.price };
  productPageQty = 1;

  productBrand.textContent = data.brand;
  productTitle.textContent = data.title;
  productPrice.textContent = formatPrice(data.price);
  productDesc.textContent = data.desc;
  renderProductGallery(data.images, data.imgAlt);
  productBadge.hidden = !data.badgeHTML;
  if (data.badgeHTML) productBadge.innerHTML = data.badgeHTML;
  productQtyValue.textContent = productPageQty;

  productRatingRow.hidden = !data.rating;

  productContentTitle.textContent = data.title;
  if (data.category) {
    productBreadcrumbCategoryWrap.hidden = false;
    productBreadcrumbCategory.textContent = data.category.charAt(0).toUpperCase() + data.category.slice(1);
  } else {
    productBreadcrumbCategoryWrap.hidden = true;
  }

  productSku.textContent = makeFakeSku(data.title, data.price);
  productCategoryEl.textContent = data.category
    ? data.category.charAt(0).toUpperCase() + data.category.slice(1)
    : 'Apparel';
  productTag.textContent = productCategoryEl.textContent;

  // The little brand-story paragraph only makes sense for Courtiva's own
  // products — we can vouch for what we say about our own brand, but
  // shouldn't invent history/backstory for real outside brands used
  // elsewhere on the Shop page (Prada, Burberry, etc.).
  if (data.brand === 'Courtiva') {
    productStory.hidden = false;
    productStory.textContent = 'Courtiva is designed in-house, piece by piece, with a focus on fabrics and fits that hold up to real movement — on the court and off it.';
  } else {
    productStory.hidden = true;
  }

  const isWishlistedAlready = isWishlisted(data.name);
  productWishlist.classList.toggle('active', isWishlistedAlready);
  productWishlistLabel.textContent = isWishlistedAlready ? 'Added to Wishlist' : 'Add to Wishlist';

  // Description accordion open by default, the other two collapsed —
  // reset that state each time a (possibly different) product opens.
  document.querySelectorAll('.product-accordions .accordion').forEach((acc) => {
    acc.classList.toggle('open', acc.id === 'accordionDescription');
  });
  accordionReviewsLabel.textContent = 'Reviews (0)';

  renderRelatedProducts(card);
  renderRecentlyViewed(data.name);
  addToRecentlyViewed(data.name);

  setActiveSection('product');
}

// Clicking a product's photo or name opens its Product Page — but not
// when the click was actually on the Add to Cart / Quick View / Wishlist
// buttons that sit inside that same image area.
document.addEventListener('click', (event) => {
  if (event.target.closest('[data-add-to-cart], [data-quick-view], [data-wishlist-toggle], .qty-btn')) return;

  const card = event.target.closest('.product-card');
  if (!card) return;

  const clickedImage = event.target.closest('.product-img');
  const clickedName = event.target.closest('.product-name');
  if (clickedImage || clickedName) {
    event.preventDefault();
    openProductPage(card);
  }
});

// Accordion open/close (Description / Additional Information / Reviews)
document.querySelectorAll('.accordion-header').forEach((header) => {
  header.addEventListener('click', () => {
    header.closest('.accordion').classList.toggle('open');
  });
});

productQtyMinus.addEventListener('click', () => {
  productPageQty = Math.max(1, productPageQty - 1);
  productQtyValue.textContent = productPageQty;
});

productQtyPlus.addEventListener('click', () => {
  productPageQty += 1;
  productQtyValue.textContent = productPageQty;
});

productAddToCart.addEventListener('click', () => {
  if (!productPageProduct) return;
  addToCart(productPageProduct.id, productPageProduct.name, productPageProduct.price, productPageQty);
});

// Same reasoning as the Quick View wishlist button above.
productWishlist.addEventListener('click', () => {
  if (productPageProduct) toggleWishlist(productPageProduct.name);
});

productShare.addEventListener('click', async () => {
  const title = productTitle.textContent;
  const shareData = { title: `Courtiva — ${title}`, text: `Check out ${title} on Courtiva`, url: window.location.href };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (err) {
      // ignore — most often just means the visitor cancelled the share sheet
    }
    return;
  }

  try {
    await navigator.clipboard.writeText(shareData.url);
    productShareLabel.textContent = 'Link Copied';
    setTimeout(() => { productShareLabel.textContent = 'Share'; }, 2000);
  } catch (err) {
    console.warn('Could not copy link to clipboard.', err);
  }
});


// ---------- 13) Wishlist ----------
// A single shared wishlist (an array of product names) drives the heart
// icon on every product card, the header count badge, and the Wishlist
// page's table — they all read/write the same localStorage-backed
// state via toggleWishlist()/isWishlisted(), so adding a product from
// ANY of those places (a card's heart icon, Quick View, the Product
// Page) keeps everything else in sync automatically.
const WISHLIST_STORAGE_KEY = 'courtiva-wishlist';

function loadWishlist() {
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('Could not read saved wishlist, starting with an empty one.', err);
    return [];
  }
}

function saveWishlist() {
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
  } catch (err) {
    console.warn('Could not save wishlist to localStorage.', err);
  }
}

let wishlist = loadWishlist(); // array of product names (card.dataset.name)

function isWishlisted(name) {
  return wishlist.includes(name);
}

function findCardByName(name) {
  return Array.from(document.querySelectorAll('.product-card')).find((card) => card.dataset.name === name);
}

// Updates every heart icon on the page (there may be several copies of
// the same product — e.g. it could appear in both Featured Products and
// Related Products at once) to reflect the current wishlist state.
function syncWishlistIcons() {
  document.querySelectorAll('.product-card').forEach((card) => {
    const btn = card.querySelector('[data-wishlist-toggle]');
    if (btn) btn.classList.toggle('active', isWishlisted(card.dataset.name));
  });

  // Quick View and the Product Page each have their own single wishlist
  // button (not tied to a specific card in the DOM), so those are kept
  // in sync separately, based on whichever product is currently open.
  if (quickViewProduct) {
    const active = isWishlisted(quickViewProduct.name);
    quickViewWishlist.classList.toggle('active', active);
    quickViewWishlistLabel.textContent = active ? 'Added to Wishlist' : 'Add to Wishlist';
  }
  if (productPageProduct) {
    const active = isWishlisted(productPageProduct.name);
    productWishlist.classList.toggle('active', active);
    productWishlistLabel.textContent = active ? 'Added to Wishlist' : 'Add to Wishlist';
  }
}

function updateWishlistBadge() {
  const count = wishlist.length;
  if (count > 0) {
    wishlistCountEl.textContent = String(count);
    wishlistCountEl.hidden = false;
  } else {
    wishlistCountEl.textContent = '';
    wishlistCountEl.hidden = true;
  }
}

function updateWishlistUI() {
  saveWishlist();
  updateWishlistBadge();
  syncWishlistIcons();
  if (!wishlistContent.hidden) renderWishlistPage();
}

function toggleWishlist(name) {
  if (isWishlisted(name)) {
    wishlist = wishlist.filter((n) => n !== name);
  } else {
    wishlist.push(name);
  }
  updateWishlistUI();
}

// Heart icon on every product card (delegated — see the Add to Cart /
// Quick View listeners above for why delegation is used everywhere here)
document.addEventListener('click', (event) => {
  const btn = event.target.closest('[data-wishlist-toggle]');
  if (!btn) return;
  event.preventDefault();
  const card = btn.closest('.product-card');
  if (card) toggleWishlist(card.dataset.name);
});

function renderWishlistRow(name) {
  const card = findCardByName(name);
  if (!card) return ''; // product no longer exists on the page for some reason

  const data = getProductDataFromCard(card);
  const priceHTML = card.querySelector('.product-price')?.innerHTML
    || formatPrice(data.price); // reuse the card's own price markup so ranges ($X–$Y) still show correctly

  return `
    <tr data-name="${data.name.replace(/"/g, '&quot;')}">
      <td class="wishlist-remove-cell">
        <button type="button" class="wishlist-remove-btn" data-wishlist-remove aria-label="Remove ${data.title} from wishlist">&times;</button>
      </td>
      <td>
        <div class="wishlist-product-cell">
          <img src="${data.imgSrc}" alt="${data.imgAlt}">
          <a href="#" class="wishlist-product-name" data-wishlist-view>${data.title}</a>
        </div>
      </td>
      <td class="wishlist-col-price">${priceHTML}</td>
      <td class="wishlist-col-stock"><span class="wishlist-stock-badge">In Stock</span></td>
      <td class="wishlist-col-action">
        <button type="button" class="wishlist-add-btn" data-wishlist-add-to-cart>+ Add to Cart</button>
      </td>
    </tr>
  `;
}

function renderWishlistPage() {
  const validNames = wishlist.filter((name) => findCardByName(name));

  if (validNames.length === 0) {
    wishlistEmpty.hidden = false;
    wishlistTable.hidden = true;
    wishlistShare.hidden = true;
    return;
  }

  wishlistEmpty.hidden = true;
  wishlistTable.hidden = false;
  wishlistShare.hidden = false;

  wishlistRows.innerHTML = validNames.map(renderWishlistRow).join('');

  // Encodes the current wishlist into a shareable link (?wishlist=...),
  // so someone opening this link gets these items ADDED to their own
  // wishlist automatically — see the restoreWishlistFromUrl() call near
  // the end of this file for the other half of this.
  const url = new URL(window.location.href);
  url.search = '';
  url.searchParams.set('wishlist', validNames.join('|'));
  wishlistShareUrl.textContent = url.toString();
}

function showWishlist() {
  renderWishlistPage();
  setActiveSection('wishlist');
}

if (wishlistButton) wishlistButton.addEventListener('click', showWishlist);

// Remove (×) and "Add to Cart" buttons inside the wishlist table (event
// delegation again, since rows are re-created every time the list changes)
wishlistRows.addEventListener('click', (event) => {
  const row = event.target.closest('tr[data-name]');
  if (!row) return;
  const name = row.dataset.name;

  if (event.target.closest('[data-wishlist-remove]')) {
    toggleWishlist(name);
  } else if (event.target.closest('[data-wishlist-add-to-cart]')) {
    const card = findCardByName(name);
    if (card) addToCart(card.dataset.productId, name, parseFloat(card.dataset.price));
  } else if (event.target.closest('[data-wishlist-view]')) {
    event.preventDefault();
    const card = findCardByName(name);
    if (card) openProductPage(card);
  }
});

if (wishlistShareUrl) {
  wishlistShareUrl.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(wishlistShareUrl.textContent);
      const original = wishlistShareUrl.textContent;
      wishlistShareUrl.textContent = 'Link copied!';
      setTimeout(() => { wishlistShareUrl.textContent = original; }, 1500);
    } catch (err) {
      console.warn('Could not copy wishlist link to clipboard.', err);
    }
  });
  wishlistShareUrl.style.cursor = 'pointer';
}

if (wishlistShareBtn) {
  wishlistShareBtn.addEventListener('click', async () => {
    const shareData = {
      title: 'My Courtiva Wishlist',
      text: 'Take a look at my Courtiva wishlist',
      url: wishlistShareUrl.textContent,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // ignore — most often just means the visitor cancelled the share sheet
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(shareData.url);
      wishlistShareBtn.title = 'Link copied!';
    } catch (err) {
      console.warn('Could not copy wishlist link to clipboard.', err);
    }
  });
}

// If this page was opened via a shared wishlist link (?wishlist=a|b|c),
// merge those products into this browser's own wishlist, then clean the
// URL up so it doesn't stay in the address bar / browser history.
function restoreWishlistFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const shared = params.get('wishlist');
  if (!shared) return;

  const names = shared.split('|').filter(Boolean);
  let changed = false;
  names.forEach((name) => {
    if (!wishlist.includes(name)) {
      wishlist.push(name);
      changed = true;
    }
  });
  if (changed) saveWishlist();

  const url = new URL(window.location.href);
  url.searchParams.delete('wishlist');
  window.history.replaceState({}, '', url.toString());
}

restoreWishlistFromUrl();
updateWishlistBadge();
syncWishlistIcons();


// ---------- 14) Product catalog: loaded from media/products/ ----------
// This is what makes adding/removing/editing products "plug and play" —
// every product card on the site (Shop page AND Featured Products) is
// built from data read out of media/products/manifest.json and each
// product's own data.json + image, rather than being typed directly
// into index.html. See README.txt for the full "how to add a product"
// walkthrough.
//
// IMPORTANT: this uses fetch() to read those JSON files, which browsers
// only allow when the site is served over http:// — e.g. via Live
// Server, `python -m http.server`, or once deployed to Netlify. Opening
// index.html directly by double-clicking it (address bar shows
// "file://") will NOT work, and both product grids will show an error
// message explaining this instead of products. See README.txt, "HOW TO
// RUN IT LOCALLY".
const PRODUCTS_BASE = 'media/products';

// Filled in once loadProductCatalog() finishes (see below), keyed by each
// product's folder id (e.g. "aurelia-sportswear") — this is what lets
// openProductPage() look up a product's FULL list of photos later, since
// a rendered card on the page only ever shows one (the cover) image, not
// the whole gallery.
let productCatalogById = {};

// A product's photos can be listed either as data.images (an array — use
// this for anything with more than one photo) or the older data.image
// (a single filename, still supported so existing product.json files
// that only have one photo don't need to be rewritten). Always returns
// an array, with at least one entry.
function getProductImages(data) {
  if (Array.isArray(data.images) && data.images.length > 0) return data.images;
  if (data.image) return [data.image];
  return [];
}

function escapeHtml(value) {
  const div = document.createElement('div');
  div.textContent = value == null ? '' : String(value);
  return div.innerHTML;
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/"/g, '&quot;');
}

// Builds the <span> badges shown in the top-left corner of a product
// photo. The two variants use different existing CSS classes because
// that's what the Shop page and Featured Products sections were already
// using before this became data-driven — kept as-is here to avoid
// changing how either section looks.
function renderBadgesHTML(data, variant) {
  const spans = [];
  if (variant === 'shop') {
    if (data.badgeSale) spans.push(`<span class="tag-sale">${escapeHtml(data.badgeSale)}</span>`);
    if (data.badgeFeatured) spans.push('<span class="tag-featured">Featured</span>');
    if (data.badgeBestseller) spans.push('<span class="tag-bestseller">Best Seller</span>');
    if (data.badgeOutOfStock) spans.push('<span class="tag-outofstock">Out of Stock</span>');
  } else {
    if (data.badgeSale) spans.push(`<span class="sale">${escapeHtml(data.badgeSale)}</span>`);
    if (data.badgeFeatured) spans.push('<span>Featured</span>');
    if (data.badgeBestseller) spans.push('<span>Best Seller</span>');
    if (data.badgeOutOfStock) spans.push('<span>Out of Stock</span>');
  }
  return spans.length ? `<div class="badge">${spans.join('')}</div>` : '';
}

function renderShopCardHTML(id, data) {
  const imgSrc = `${PRODUCTS_BASE}/${id}/${getProductImages(data)[0]}`;
  const priceHTML = data.compareAtPrice
    ? `<span class="price-current">${formatPrice(data.price)}</span><span class="price-original">${formatPrice(data.compareAtPrice)}</span>`
    : `<span class="price-current">${formatPrice(data.price)}</span>`;
  const actionHTML = data.badgeOutOfStock
    ? '<button type="button" class="quick-add" disabled title="Currently out of stock">Out of Stock</button>'
    : '<button type="button" class="quick-add" data-add-to-cart>Add to Cart</button>';

  return `
    <article class="product-card" data-name="${escapeAttr(data.name)}" data-price="${data.price.toFixed(2)}" data-category="${escapeAttr(data.category)}" data-product-id="${escapeAttr(id)}">
      <div class="product-img">
        <button type="button" class="wishlist-icon-btn" data-wishlist-toggle aria-label="Add to Wishlist">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7.5-4.8-9.8-9.2C.7 7.4 2.3 4 5.8 4c2 0 3.4 1.1 4.2 2.4C10.8 5.1 12.2 4 14.2 4c3.5 0 5.1 3.4 3.6 6.8C15.5 15.2 12 20 12 20z"/></svg>
        </button>
        ${renderBadgesHTML(data, 'shop')}
        <img src="${escapeAttr(imgSrc)}" alt="${escapeAttr(data.name)}">
        ${actionHTML}
      </div>
      <div class="product-meta">
        <div class="product-brand">${escapeHtml(data.brand)}</div>
        <div class="product-name">${escapeHtml(data.name)}</div>
        <p class="product-desc">${escapeHtml(data.description)}</p>
        <div class="product-price">${priceHTML}</div>
      </div>
    </article>
  `;
}

function renderFeaturedCardHTML(id, data) {
  const imgSrc = `${PRODUCTS_BASE}/${id}/${getProductImages(data)[0]}`;
  const imgAlt = data.tagline || data.name;

  return `
    <article class="product-card" data-name="${escapeAttr(data.name)}" data-price="${data.price.toFixed(2)}" data-brand="${escapeAttr(data.brand)}" data-desc="${escapeAttr(data.description)}" data-product-id="${escapeAttr(id)}">
      <div class="product-img">
        <button type="button" class="wishlist-icon-btn" data-wishlist-toggle aria-label="Add to Wishlist">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7.5-4.8-9.8-9.2C.7 7.4 2.3 4 5.8 4c2 0 3.4 1.1 4.2 2.4C10.8 5.1 12.2 4 14.2 4c3.5 0 5.1 3.4 3.6 6.8C15.5 15.2 12 20 12 20z"/></svg>
        </button>
        ${renderBadgesHTML(data, 'featured')}
        <img src="${escapeAttr(imgSrc)}" alt="${escapeAttr(imgAlt)}">
        <div class="card-actions">
          <button type="button" class="card-action-btn quick-view-btn" data-quick-view>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12z"/><circle cx="12" cy="12" r="3"/></svg>
            Quick View
          </button>
          <button type="button" class="card-action-btn add-to-cart-btn" data-add-to-cart>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
            Add to Cart
          </button>
        </div>
      </div>
      <div class="product-meta">
        <div class="product-name">${escapeHtml(data.name)}</div>
        <div class="product-desc">${escapeHtml(data.tagline)}</div>
        <div class="product-price">${formatPrice(data.price)}</div>
      </div>
    </article>
  `;
}

async function fetchProductData(id) {
  const response = await fetch(`${PRODUCTS_BASE}/${id}/data.json`);
  if (!response.ok) throw new Error(`${id}/data.json responded with ${response.status}`);
  return response.json();
}

function showCatalogLoadError(container, message) {
  container.innerHTML = `<p class="catalog-error">${escapeHtml(message)}</p>`;
}

async function loadProductCatalog() {
  let manifest;
  try {
    const response = await fetch(`${PRODUCTS_BASE}/manifest.json`);
    if (!response.ok) throw new Error(`manifest.json responded with ${response.status}`);
    manifest = await response.json();
  } catch (err) {
    console.warn(
      'Could not load the product catalog. If you opened index.html directly ' +
      '(the address bar shows "file://"), browsers block this for security ' +
      'reasons — run the site through a local server instead. See ' +
      'README.txt, "HOW TO RUN IT LOCALLY".',
      err
    );
    const message = 'Products could not be loaded. This page needs to be served over a local server (not opened directly as a file) — see README.txt.';
    if (shopGrid) showCatalogLoadError(shopGrid, message);
    if (featuredGrid) showCatalogLoadError(featuredGrid, message);
    return;
  }

  // Some products (like a shared item featured on the homepage AND sold
  // in the shop) can appear in both lists — this fetches each unique one
  // only once even if it's referenced twice.
  const allIds = Array.from(new Set([...(manifest.shop || []), ...(manifest.featured || [])]));
  const dataById = {};

  await Promise.all(
    allIds.map(async (id) => {
      try {
        dataById[id] = await fetchProductData(id);
      } catch (err) {
        console.warn(`Skipping product "${id}" — could not load its data.json.`, err);
      }
    })
  );

  productCatalogById = dataById;

  if (shopGrid) {
    const shopIds = (manifest.shop || []).filter((id) => dataById[id]);
    shopGrid.innerHTML = shopIds.map((id) => renderShopCardHTML(id, dataById[id])).join('');
  }

  if (featuredGrid) {
    const featuredIds = (manifest.featured || []).filter((id) => dataById[id]);
    featuredGrid.innerHTML = featuredIds.map((id) => renderFeaturedCardHTML(id, dataById[id])).join('');
  }

  // Everything below depends on product cards actually existing in the
  // page, which — because loading them above is asynchronous — they
  // didn't yet the first time these ran further up this file. Re-running
  // them now picks up the freshly-rendered cards.
  applyShopFilter();
  syncWishlistIcons();
  updateCartUI();
}

loadProductCatalog();


// ---------- 15) Newsletter signup form (front-end only demo) ----------
if (signupForm) {
  signupForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = signupForm.querySelector('input');
    const button = signupForm.querySelector('button');
    input.value = '';
    button.textContent = 'Subscribed';
    // NOTE: this doesn't send the email anywhere yet.
    // To actually collect emails, connect this to a backend
    // or a service like Mailchimp / ConvertKit / Klaviyo.
  });
}
