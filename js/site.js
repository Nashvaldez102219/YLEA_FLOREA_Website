/* YLÉA FLORÉA storefront: pure client-side HTML/CSS/JS.
   Cart and welcome email are kept on this browser; checkout only creates a local summary. */
(() => {
  'use strict';

  const products = window.YLEA_PRODUCTS || [];
  const byId = Object.fromEntries(products.map(product => [product.id, product]));
  const page = document.body.dataset.page || 'home';
  const SHOP_EMAIL = 'ylea.florea@gmail.com';
  const STORAGE = {cart: 'ylea:cart:v1', wishlist: 'ylea:wishlist:v1', promo: 'ylea:promo:v1', popup: 'ylea:popup-seen:v1', gardenEmail: 'ylea:garden-email:v1'};
  const read = (key, fallback) => {
    try { const raw = localStorage.getItem(key); return raw === null ? fallback : JSON.parse(raw); }
    catch { return fallback; }
  };
  const write = (key, value) => { try {localStorage.setItem(key, JSON.stringify(value));} catch { /* Browsers may disable storage. */ } };
  const state = {
    cart: read(STORAGE.cart, []),
    wishlist: read(STORAGE.wishlist, []),
    promo: read(STORAGE.promo, ''),
    filter: new URLSearchParams(location.search).get('favorites') === '1' ? 'favorites' : 'all',
    sort: 'featured',
    search: '',
    activeProduct: null,
    shadeIndex: 0,
    detailQty: 1,
    checkoutItems: [],
    checkoutSource: 'cart',
    checkoutDraft: {},
    orderText: '',
    lastReceipt: null,
    lastFocus: null
  };
  if (!Array.isArray(state.cart)) state.cart = [];
  if (!Array.isArray(state.wishlist)) state.wishlist = [];
  state.cart = state.cart.filter(item => byId[item.id] && Number.isInteger(item.qty) && item.qty > 0 && item.qty <= 99 && typeof item.shade === 'string' && (byId[item.id].isPalette ? [(byId[item.id].id === 'petal-highlight-contour' ? 'Golden Bloom (duo)' : 'Complete palette')].includes(item.shade) : byId[item.id].shades.some(s => s.name === item.shade)));
  state.wishlist = state.wishlist.filter(id => !!byId[id]);

  const icon = (name) => {
    const base = 'viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
    const paths = {
      heart: '<path d="M20.8 4.9a5.5 5.5 0 0 0-7.8 0L12 6l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.3a5.5 5.5 0 0 0 0-7.8Z"/>',
      bag: '<path d="M5.5 8h13l1.5 12h-16l1.5-12Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/>',
      menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
      close: '<path d="M5 5l14 14M19 5L5 19"/>',
      arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>',
      minus: '<path d="M5 12h14"/>',
      plus: '<path d="M12 5v14M5 12h14"/>',
      check: '<path d="m4 12 5 5L20 6"/>'
    };
    return `<svg ${base}>${paths[name] || ''}</svg>`;
  };
  const peso = value => '₱' + value.toLocaleString('en-PH', {minimumFractionDigits: Number.isInteger(value) ? 0 : 2, maximumFractionDigits: 2});
  const safe = value => String(value).replace(/[&<>"']/g, chr => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[chr]));
  const variant = (product, shadeIndex = 0) => {
    if (product.isPalette) return product.id === 'petal-highlight-contour' ? 'Golden Bloom (duo)' : 'Complete palette';
    return product.shades[shadeIndex]?.name || product.shades[0]?.name || 'Standard';
  };

  function renderShell() {
    const h = document.getElementById('site-header');
    const f = document.getElementById('site-footer');
    const o = document.getElementById('site-overlays');
    if (h) {
      const nav = (name, title, href) => `<a class="nav-link ${page === name ? 'active' : ''}" href="${href}" ${page === name ? 'aria-current="page"' : ''}>${title}</a>`;
      h.innerHTML = `
      <a class="skip-link" href="#main">Skip to content</a>
      <div class="announcement-bar">✧ &nbsp; THE GARDEN COLLECTION BLOOMS NOVEMBER 11, 2026 &nbsp; ✧</div>
      <header class="site-header">
        <div class="container header-inner">
          <a class="brand-mark" href="home.html" aria-label="YLÉA FLORÉA home">
            <img src="assets/brand/ylea-florea-logo.webp" alt="" width="49" height="49" />
            <span><strong>YLÉA FLORÉA</strong><small>WHERE THE IMPOSSIBLE BLOOMS</small></span>
          </a>
          <nav class="desktop-nav" aria-label="Main navigation">${nav('home','Home','home.html')}${nav('products','Shop','products.html')}${nav('about','Our Story','about.html')}${nav('contact','Contact','contact.html')}</nav>
          <div class="header-actions">
            <button class="icon-button join-button" data-open-signup type="button" aria-label="Join the garden" title="Join the garden"><span class="join-label">Join the garden</span><span aria-hidden="true">✧</span></button>
            <a class="icon-button" href="products.html?favorites=1" aria-label="View saved products" title="Saved products">${icon('heart')}<span class="icon-counter" data-wishlist-count hidden>0</span></a>
            <button class="icon-button" data-open-cart type="button" aria-label="Open shopping bag" title="Shopping bag">${icon('bag')}<span class="icon-counter" data-cart-count hidden>0</span></button>
            <button class="icon-button mobile-menu-button" data-menu-toggle type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-nav">${icon('menu')}</button>
          </div>
        </div>
        <nav class="mobile-nav" id="mobile-nav" aria-label="Mobile navigation" hidden>${nav('home','Home','home.html')}${nav('products','Shop the Collection','products.html')}${nav('about','Our Story','about.html')}${nav('contact','Contact Us','contact.html')}<button type="button" data-open-signup>Join the Garden ✧</button></nav>
      </header>`;
    }
    if (f) f.innerHTML = `<footer class="site-footer">
      <div class="container footer-main">
        <div class="footer-brand"><a href="home.html"><img src="assets/brand/ylea-florea-logo.webp" alt="YLÉA FLORÉA flower and fairy logo" loading="lazy" width="115" height="115" /></a><p>Where the Impossible Blooms</p><small>A garden of beauty, wonder &amp; self-expression.</small></div>
        <div class="footer-column"><h2>Explore</h2><a href="home.html">Home</a><a href="products.html">Shop all makeup</a><a href="about.html">Our story</a><a href="contact.html">Contact us</a></div>
        <div class="footer-column"><h2>The Garden</h2><span>Pasay City, Philippines</span><a href="mailto:ylea.florea@gmail.com">ylea.florea@gmail.com</a><a href="tel:+639216216389">0921 - 621 - 6389</a><span>Instagram: @ylea.florea</span></div>
        <div class="footer-column footer-invitation"><span class="eyebrow">A LITTLE GIFT FROM US</span><h2>Good things <em>grow here.</em></h2><p>Discover your 15% first-order welcome code.</p><button type="button" class="btn btn-light" data-open-signup>Join the Garden <span aria-hidden="true">↗</span></button></div>
      </div>
      <div class="container footer-bottom"><span>© 2026 YLÉA FLORÉA. Made with a little magic.</span><span>Where beauty meets a little garden magic</span><a href="index.html">Back to the garden gate ↗</a></div>
    </footer>`;
    if (o) o.innerHTML = `
      <div class="site-overlay" id="details-overlay" aria-hidden="true"><div class="overlay-shade" data-close-overlay="details-overlay"></div><section class="detail-dialog" role="dialog" aria-modal="true" aria-label="Product details"><button class="overlay-close" type="button" data-close-overlay="details-overlay" aria-label="Close product details">${icon('close')}</button><div id="detail-content"></div></section></div>
      <div class="site-overlay" id="cart-overlay" aria-hidden="true"><div class="overlay-shade" data-close-overlay="cart-overlay"></div><section class="cart-drawer" role="dialog" aria-modal="true" aria-label="Your shopping bag"><div class="drawer-head"><div><span class="eyebrow">YOUR LITTLE TREASURES</span><h2>Your <em>garden bag.</em></h2></div><button class="overlay-close" type="button" data-close-overlay="cart-overlay" aria-label="Close shopping bag">${icon('close')}</button></div><div id="cart-content" class="drawer-body"></div></section></div>
      <div class="site-overlay" id="signup-overlay" aria-hidden="true"><div class="overlay-shade" data-close-overlay="signup-overlay"></div><section class="signup-dialog" role="dialog" aria-modal="true" aria-label="Join the garden"><button class="overlay-close" type="button" data-close-overlay="signup-overlay" aria-label="Close welcome invitation">${icon('close')}</button><div class="signup-image"><img src="assets/places/makeup-stilllife.webp" alt="Pink floral makeup still life" /><span>✦ YLÉA FLORÉA ✦</span></div><div class="signup-content"><span class="eyebrow">A GIFT FOR YOU</span><h2>Welcome to <em>the garden.</em></h2><strong>15% off your first order</strong><p>Join our little world of beauty, blooming shades, and magical surprises.</p><form id="signup-form"><label class="sr-only" for="signup-email">Email address</label><input id="signup-email" type="email" name="email" autocomplete="email" placeholder="Your email address" required /><button class="btn btn-primary btn-full" type="submit">Unlock My Gift <span aria-hidden="true">↗</span></button></form><div id="signup-result" class="signup-result" aria-live="polite" hidden></div><small>Your email is saved only in this browser to prefill checkout. It is not sent to the shop or used for mailing.</small></div></section></div>
      <div class="site-overlay" id="checkout-overlay" aria-hidden="true"><div class="overlay-shade" data-close-overlay="checkout-overlay"></div><section class="checkout-dialog" role="dialog" aria-modal="true" aria-label="Checkout"><button class="overlay-close" type="button" data-close-overlay="checkout-overlay" aria-label="Close checkout">${icon('close')}</button><div id="checkout-content"></div></section></div>
      <div class="toast" id="site-toast" role="status" aria-live="polite" aria-atomic="true"></div>`;
    updateCounts();
  }

  function updateCounts() {
    const count = state.cart.reduce((sum, item) => sum + item.qty, 0);
    document.querySelectorAll('[data-cart-count]').forEach(el => { el.textContent = count; el.hidden = !count; });
    document.querySelectorAll('[data-wishlist-count]').forEach(el => { el.textContent = state.wishlist.length; el.hidden = !state.wishlist.length; });
  }
  let toastTimer;
  function toast(message) {
    const el = document.getElementById('site-toast'); if (!el) return;
    el.textContent = message; el.classList.add('shown');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('shown'), 3400);
  }
  function productCard(product) {
    const favorite = state.wishlist.includes(product.id);
    const showPalette = !!product.isPalette;
    const shadesLabel = showPalette ? `${product.shades.length} shades included` : product.shades.length === 1 ? '1 shade' : `${product.shades.length} shades`;
    return `<article class="product-card">
      <div class="product-picture">
        <span class="product-tag">${safe(product.tag)}</span>
        <button type="button" class="favorite-button ${favorite ? 'is-favorite' : ''}" data-toggle-fav="${product.id}" aria-label="${favorite ? 'Remove' : 'Add'} ${safe(product.name)} ${favorite ? 'from' : 'to'} wishlist" aria-pressed="${favorite}">${icon('heart')}</button>
        <button class="product-image-button" type="button" data-open-view="${product.id}" aria-label="View ${safe(product.name)} details"><img src="${product.image}" alt="${safe(product.name)} product packaging" loading="lazy" decoding="async" width="1400" height="1600" /></button>
        <button type="button" class="quick-view" data-open-view="${product.id}">Quick view <span aria-hidden="true">↗</span></button>
      </div>
      <div class="product-copy">
        <span class="product-type">${safe(product.type)} · ${shadesLabel}</span>
        <button type="button" class="product-title" data-open-view="${product.id}">${safe(product.name)}</button>
        <div class="product-bottom"><span class="product-price">${peso(product.price)}</span><button type="button" class="product-card-add" data-card-add="${product.id}" aria-label="${product.shades.length > 1 && !product.isPalette ? 'Choose shade for' : 'Add'} ${safe(product.name)}">${product.shades.length > 1 && !product.isPalette ? 'Choose shade' : 'Add to bag'} <span aria-hidden="true">↗</span></button></div>
        <button type="button" class="product-buy" data-card-buy="${product.id}">Buy now <span aria-hidden="true">↗</span></button>
      </div>
    </article>`;
  }
  function renderFeatured() {
    const el = document.getElementById('featured-products');
    if (!el) return;
    el.innerHTML = ['bloomveil-foundation','rosy-dew-blush','enchanted-bloom-eyeshadow','whispering-petal-lip-nectar'].map(id => productCard(byId[id])).join('');
  }
  function renderProducts() {
    const el = document.getElementById('all-products'); if (!el) return;
    let result = products.filter(product => {
      const categoryMatch = state.filter === 'all' || (state.filter === 'favorites' ? state.wishlist.includes(product.id) : product.category === state.filter);
      const searchMatch = !state.search || (product.name + ' ' + product.type + ' ' + product.shades.map(s => s.name).join(' ')).toLowerCase().includes(state.search);
      return categoryMatch && searchMatch;
    });
    if (state.sort === 'price-asc') result.sort((a,b) => a.price - b.price);
    if (state.sort === 'price-desc') result.sort((a,b) => b.price - a.price);
    if (state.sort === 'name') result.sort((a,b) => a.name.localeCompare(b.name));
    el.innerHTML = result.map(productCard).join('');
    const count = document.getElementById('product-count'); if (count) count.textContent = `${result.length} lovely find${result.length === 1 ? '' : 's'}`;
    const empty = document.getElementById('product-empty'); if (empty) empty.hidden = result.length > 0;
    document.querySelectorAll('.filter-chip').forEach(chip => {const active = chip.dataset.category === state.filter; chip.classList.toggle('is-active',active); chip.setAttribute('aria-pressed',String(active));});
  }
  function toggleFavorite(id) {
    if (!byId[id]) return;
    if (state.wishlist.includes(id)) state.wishlist = state.wishlist.filter(x => x !== id);
    else state.wishlist.push(id);
    write(STORAGE.wishlist, state.wishlist);
    updateCounts(); renderFeatured(); renderProducts();
    const btn = document.querySelector('#detail-content [data-detail-fav]');
    if (btn && state.activeProduct === id) {const active = state.wishlist.includes(id); btn.classList.toggle('is-favorite',active); btn.setAttribute('aria-pressed',String(active)); btn.setAttribute('aria-label', active ? 'Remove from wishlist' : 'Save to wishlist'); }
    toast(state.wishlist.includes(id) ? 'Saved to your wishlist ♡' : 'Removed from your wishlist');
  }

  function openOverlay(id) {
    const target = document.getElementById(id); if (!target) return;
    state.lastFocus = document.activeElement;
    document.querySelectorAll('.site-overlay').forEach(overlay => {overlay.classList.remove('is-open');overlay.setAttribute('aria-hidden','true');});
    target.classList.add('is-open'); target.setAttribute('aria-hidden','false');
    document.body.classList.add('overlay-open');
    const focus = target.querySelector('.overlay-close, input, button');
    if (focus) requestAnimationFrame(() => focus.focus({preventScroll: true}));
  }
  function closeOverlays() {
    document.querySelectorAll('.site-overlay').forEach(overlay => {overlay.classList.remove('is-open');overlay.setAttribute('aria-hidden','true');});
    document.body.classList.remove('overlay-open');
    if (state.lastFocus && typeof state.lastFocus.focus === 'function' && state.lastFocus.isConnected) state.lastFocus.focus({preventScroll:true});
  }

  function shadeMarkup(product) {
    if (product.isPalette) return `<div class="shade-palette-list">${product.shades.map(shade => `<div class="palette-shade"><span style="background:${shade.hex}" aria-hidden="true"></span><small>${safe(shade.name)}</small></div>`).join('')}</div>`;
    return `<div class="shade-selection">${product.shades.map((shade, index) => `<button type="button" class="shade-option ${index === state.shadeIndex ? 'selected' : ''}" data-detail-shade="${index}" aria-pressed="${index === state.shadeIndex}"><span class="swatch" style="background:${shade.hex}" aria-hidden="true"></span><span class="shade-name">${safe(shade.name)}</span></button>`).join('')}</div>`;
  }
  function openDetails(id) {
    const product = byId[id]; if (!product) return;
    state.activeProduct = id; state.shadeIndex = 0; state.detailQty = 1;
    const isFav = state.wishlist.includes(id);
    document.getElementById('detail-content').innerHTML = `
      <div class="detail-layout">
        <div class="detail-image-panel"><img src="${product.image}" alt="${safe(product.name)} package" width="1400" height="1600" /><span>✧ THE GARDEN COLLECTION</span></div>
        <div class="detail-information"><span class="eyebrow">${safe(product.type)} · YLÉA FLORÉA</span><h2>${safe(product.name)}</h2><div class="detail-rating">✦ &nbsp; WHERE THE IMPOSSIBLE BLOOMS</div><strong class="detail-price">${peso(product.price)}</strong><p class="detail-description">${safe(product.description)}</p>
          <div class="detail-shades-head"><h3>${product.isPalette ? 'Shades in this palette' : 'Select your shade'}</h3><span>${product.shades.length} ${product.shades.length === 1 ? 'shade' : 'shades'}</span></div>
          ${shadeMarkup(product)}
          <div class="selected-shade" id="selected-shade-label">${product.isPalette ? 'All listed shades are included in one palette.' : `Selected: ${safe(variant(product, 0))}`}</div>
          <div class="detail-purchase"><div class="qty-control" aria-label="Quantity"><button type="button" data-detail-qty="-1" aria-label="Decrease quantity">${icon('minus')}</button><span id="detail-qty" aria-live="polite">1</span><button type="button" data-detail-qty="1" aria-label="Increase quantity">${icon('plus')}</button></div><button class="btn btn-primary" type="button" data-detail-add>Add to Bag <span aria-hidden="true">↗</span></button><button class="detail-save ${isFav ? 'is-favorite' : ''}" type="button" data-detail-fav="${product.id}" aria-label="${isFav ? 'Remove from wishlist' : 'Save to wishlist'}" aria-pressed="${isFav}">${icon('heart')}</button></div>
          <button type="button" class="buy-now" data-detail-buy>Buy now ${icon('arrow')}</button>
          <p class="detail-note">Choose your shade and quantity, then create a printable order summary at checkout. Nothing is sent or paid for online.</p>
        </div>
      </div>`;
    openOverlay('details-overlay');
  }
  function chooseShade(index) {
    const product = byId[state.activeProduct]; if (!product || product.isPalette || !product.shades[index]) return;
    state.shadeIndex = index;
    document.querySelectorAll('[data-detail-shade]').forEach(el => {const selected = Number(el.dataset.detailShade) === index; el.classList.toggle('selected',selected); el.setAttribute('aria-pressed',String(selected));});
    const text = document.getElementById('selected-shade-label'); if (text) text.textContent = 'Selected: ' + product.shades[index].name;
  }
  function addToCart(id, shadeIndex = 0, qty = 1) {
    const product = byId[id]; if (!product) return;
    const name = variant(product, shadeIndex);
    const existing = state.cart.find(item => item.id === id && item.shade === name);
    if (existing) existing.qty = Math.min(99,existing.qty + qty);
    else state.cart.push({id, shade: name, qty: Math.min(99,qty)});
    write(STORAGE.cart,state.cart); updateCounts(); toast(`${product.name} added to your bag ✿`);
  }
  const cartSubtotal = () => state.cart.reduce((amount,item) => amount + byId[item.id].price * item.qty,0);
  const cartDiscount = () => state.promo === 'BLOOM15' ? Math.round(cartSubtotal() * 0.15 * 100) / 100 : 0;
  function renderCart() {
    const holder = document.getElementById('cart-content'); if (!holder) return;
    if (!state.cart.length) {
      holder.innerHTML = `<div class="cart-empty"><span aria-hidden="true">❀</span><h3>Your bag is waiting <em>to bloom.</em></h3><p>Add something lovely from the garden collection.</p><button class="btn btn-primary" type="button" data-keep-shopping>Explore the Collection <span aria-hidden="true">↗</span></button></div>`;return;
    }
    const items = state.cart.map((item, i) => {const product = byId[item.id]; return `<div class="cart-item"><img src="${product.image}" alt="${safe(product.name)}" loading="lazy" width="1400" height="1600" /><div class="cart-item-copy"><span class="product-type">${safe(product.type)}</span><h3>${safe(product.name)}</h3><p>${safe(item.shade)}</p><strong>${peso(product.price * item.qty)}</strong><div class="cart-item-controls"><div class="mini-qty"><button type="button" data-cart-qty="-1" data-index="${i}" aria-label="Decrease ${safe(product.name)} quantity">−</button><span>${item.qty}</span><button type="button" data-cart-qty="1" data-index="${i}" aria-label="Increase ${safe(product.name)} quantity">+</button></div><button class="remove-cart" type="button" data-cart-remove="${i}">Remove</button></div></div></div>`;}).join('');
    const discount = cartDiscount();
    holder.innerHTML = `<div class="cart-items">${items}</div><div class="bag-summary"><label class="promo-label" for="promo-input">Have a welcome code?</label><div class="promo-row"><input id="promo-input" type="text" placeholder="Enter promo code" maxlength="20" autocomplete="off" value="${safe(state.promo)}" /><button type="button" data-apply-code>Apply</button></div><p class="promo-status" id="promo-status" aria-live="polite">${state.promo ? 'Welcome code BLOOM15 applied ✓' : 'Have BLOOM15? Enter it here.'}</p><div class="sum-row"><span>Subtotal</span><strong>${peso(cartSubtotal())}</strong></div>${discount ? `<div class="sum-row discount-row"><span>Welcome discount (15%)</span><strong>− ${peso(discount)}</strong></div>` : ''}<div class="sum-row sum-total"><span>Subtotal after discount</span><strong>${peso(cartSubtotal() - discount)}</strong></div><small>Shipping fees and available payment methods will be confirmed by the shop.</small><button type="button" class="btn btn-primary btn-full" data-open-checkout>Proceed to Checkout <span aria-hidden="true">↗</span></button><button type="button" class="bag-keep-shopping" data-keep-shopping>Continue Shopping <span aria-hidden="true">↗</span></button><p class="bag-order-note">✧ Checkout creates a printable summary on your device. No email is sent or payment collected.</p></div>`;
  }
  function openCart() {renderCart();openOverlay('cart-overlay');}
  function updateCartQty(index,delta) {
    const item = state.cart[index]; if (!item) return;
    item.qty = Math.min(99,item.qty + delta);
    if (item.qty <= 0) state.cart.splice(index,1);
    write(STORAGE.cart,state.cart);updateCounts();renderCart();
  }
  function applyPromo() {
    const input = document.getElementById('promo-input'); if (!input) return;
    const code = input.value.trim().toUpperCase();
    if (code === 'BLOOM15') {state.promo=code;write(STORAGE.promo,code);renderCart();toast('Welcome code applied ✿');}
    else if (code === '') {state.promo='';write(STORAGE.promo,'');renderCart();toast('Promo code removed');}
    else {const msg=document.getElementById('promo-status'); if(msg){msg.textContent='That code isn’t valid. Check the spelling and try again.';msg.classList.add('error-text');}}
  }

  function openSignup() {
    const form = document.getElementById('signup-form'); const result = document.getElementById('signup-result');
    if (form) form.hidden=false;
    const input=document.getElementById('signup-email');
    if (input) input.value=read(STORAGE.gardenEmail,'');
    if (result) {result.hidden=true;result.textContent='';}
    openOverlay('signup-overlay');
  }
  function signupSubmit(event) {
    event.preventDefault();
    const input = document.getElementById('signup-email');
    if (!input || !input.reportValidity()) return;
    const email = input.value.trim().toLowerCase();
    write(STORAGE.gardenEmail,email);
    write(STORAGE.popup,true);
    const result = document.getElementById('signup-result');
    const form = document.getElementById('signup-form');
    if (form) form.hidden = true;
    if (result) {
      result.hidden = false;
      result.innerHTML = `<span class="signup-celebrate">✦ YOUR WELCOME GIFT ✦</span><strong>BLOOM15</strong><p>We saved <strong class="saved-garden-email">${safe(email)}</strong> in this browser for checkout. No emails are sent.</p><button type="button" class="btn btn-outline btn-full" data-copy-promo>Copy Welcome Code</button><small>You can change this email on your checkout summary.</small>`;
    }
  }

  function makeMailto(subject, body) {
    return `mailto:${SHOP_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function checkoutSubtotal(items) {
    return items.reduce((total,item) => total + (byId[item.id]?.price || 0) * item.qty, 0);
  }
  function checkoutDiscount(items) {
    return state.promo === 'BLOOM15' ? Math.round(checkoutSubtotal(items) * .15 * 100) / 100 : 0;
  }
  function checkoutSummary(items) {
    const subtotal=checkoutSubtotal(items), discount=checkoutDiscount(items);
    return `<div class="checkout-summary"><h3>Your garden picks</h3>
      ${items.map(item => `<div class="checkout-line"><span>${safe(byId[item.id].name)}<small>${safe(item.shade)} × ${item.qty}</small></span><strong>${peso(byId[item.id].price * item.qty)}</strong></div>`).join('')}
      <div class="checkout-line"><span>Items subtotal</span><strong>${peso(subtotal)}</strong></div>
      ${discount ? `<div class="checkout-line discount-row"><span>Welcome code BLOOM15 (15%)</span><strong>− ${peso(discount)}</strong></div>` : ''}
      <div class="checkout-line total-line"><span>Items total</span><strong>${peso(subtotal-discount)}</strong></div>
      <div class="checkout-cost-note"><span>Shipping</span><strong>To be confirmed</strong></div>
      <p>Prices are estimated. Shipping, stock and payment are not confirmed; no order is transmitted to YLÉA FLORÉA.</p>
    </div>`;
  }

  function createDraftReference() {
    const stamp=new Date().toISOString().slice(0,10).replace(/-/g,'');
    const suffix=Math.random().toString(36).slice(2,7).toUpperCase();
    return `YL-DRAFT-${stamp}-${suffix}`;
  }
  function buySelected(id, shadeIndex=0, qty=1) {
    const product=byId[id]; if (!product) return;
    state.checkoutItems=[{id,shade:variant(product,shadeIndex),qty}];
    state.checkoutSource='buy-now';
    openCheckout(state.checkoutItems,'buy-now');
  }

  function openCheckout(items=state.cart, source='cart') {
    const valid=items.filter(item=>byId[item.id] && item.qty > 0).map(item=>({...item}));
    if (!valid.length) {toast('Add something lovely to your bag first.'); return;}
    state.checkoutItems=valid;
    state.checkoutSource=source;
    const holder=document.getElementById('checkout-content'); if (!holder) return;
    const d=state.checkoutDraft;
    const preferredEmail=d.email || read(STORAGE.gardenEmail,'');
    holder.innerHTML=`<div class="checkout-head"><span class="eyebrow">YOUR ORDER, ALL IN ONE PLACE</span><h2>Ready to <em>bloom?</em></h2><p>Choose your makeup and prepare your checkout details. You can download, copy, or print a local order summary; nothing is sent to the shop.</p></div>
      <div class="checkout-grid">
        <form id="checkout-form">
          <h3>Delivery details</h3>
          <label>Full name <span aria-hidden="true">*</span><input name="customer" type="text" placeholder="Your full name" value="${safe(d.customer||'')}" autocomplete="name" required maxlength="80" /></label>
          <div class="checkout-field-pair">
            <label>Email address <span aria-hidden="true">*</span><input name="email" type="email" placeholder="you@gmail.com" value="${safe(preferredEmail)}" autocomplete="email" required maxlength="150" /><span class="receipt-email-hint">${read(STORAGE.gardenEmail,'')?'Prefilled from Join the Garden.':'Add a contact email to your summary.'} This email is never sent by the website.</span></label>
            <label>Mobile number <span aria-hidden="true">*</span><input name="phone" type="tel" placeholder="09XX XXX XXXX" value="${safe(d.phone||'')}" autocomplete="tel" inputmode="tel" pattern="[0-9+() .-]{8,22}" title="Enter an 8–22 character contact number" required maxlength="22" /></label>
          </div>
          <label>House no., street, barangay <span aria-hidden="true">*</span><textarea name="address" rows="2" placeholder="House/unit, street and barangay" autocomplete="street-address" required maxlength="250">${safe(d.address||'')}</textarea></label>
          <div class="checkout-field-pair">
            <label>City / Municipality <span aria-hidden="true">*</span><input name="city" type="text" placeholder="City or municipality" value="${safe(d.city||'')}" required maxlength="80" /></label>
            <label>Province / NCR <span aria-hidden="true">*</span><input name="province" type="text" placeholder="Province or Metro Manila" value="${safe(d.province||'')}" required maxlength="80" /></label>
          </div>
          <div class="checkout-field-pair">
            <label>Area <span aria-hidden="true">*</span><select name="region" required><option value="" disabled ${!d.region?'selected':''}>Choose area</option>${['Metro Manila','Rest of Luzon','Visayas','Mindanao'].map(region=>`<option ${d.region===region?'selected':''}>${region}</option>`).join('')}</select></label>
            <label>ZIP code <span class="optional">(optional)</span><input name="postal" type="text" placeholder="e.g. 1300" value="${safe(d.postal||'')}" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" title="Enter a 4-digit Philippine ZIP code" /></label>
          </div>
          <label>Order notes <span class="optional">(optional)</span><textarea name="notes" rows="2" maxlength="400" placeholder="Delivery instructions or questions">${safe(d.notes||'')}</textarea></label>
          <div class="checkout-payment-note"><strong>Payment arrangement</strong><span>This is a local checkout preview. It does not submit an order to the shop or collect payment. You may save or print your summary for reference.</span></div>
          <div class="order-submit-error" id="checkout-error" role="alert" hidden></div>
          <input name="website" type="text" class="order-honeypot" autocomplete="off" tabindex="-1" aria-hidden="true" />
          <button class="btn btn-primary btn-full" type="submit">Create My Order Summary <span aria-hidden="true">↗</span></button>
        </form>
        ${checkoutSummary(valid)}
      </div>`;
    openOverlay('checkout-overlay');
  }

  function buildOrderMessage(details, items, reference) {
    const subtotal=checkoutSubtotal(items), discount=checkoutDiscount(items);
    return [
      'YLÉA FLORÉA — PERSONAL ORDER SUMMARY (NOT SUBMITTED)',
      `Local reference: ${reference}`,
      `Created: ${new Date().toLocaleString('en-PH')}`,
      '',
      'CONTACT & DELIVERY',
      `Name: ${details.customer}`,
      `Email: ${details.email}`,
      `Mobile: ${details.phone}`,
      `Address: ${details.address}`,
      `City: ${details.city}`,
      `Province: ${details.province}`,
      `Region: ${details.region}`,
      `ZIP: ${details.postal || 'Not provided'}`,
      `Notes: ${details.notes || 'None'}`,
      '',
      'SELECTED PRODUCTS',
      ...items.map(item => `${byId[item.id].name} | ${item.shade} | ${item.qty} x ${peso(byId[item.id].price)} = ${peso(byId[item.id].price * item.qty)}`),
      '',
      `Items subtotal: ${peso(subtotal)}`,
      `Welcome discount: -${peso(discount)}`,
      `Items total: ${peso(subtotal - discount)}`,
      'Shipping: Not calculated',
      '',
      'This is a locally created shopping summary, not a placed order or proof of payment.',
      'Nothing was transmitted to the shop. Contact YLÉA FLORÉA separately if you wish to order.'
    ].join('\n');
  }

  function submitCheckout(event) {
    event.preventDefault();
    const form=event.target;
    if (!form.reportValidity()) return;
    const details=Object.fromEntries(new FormData(form).entries());
    Object.keys(details).forEach(key=>details[key]=String(details[key]).trim());
    state.checkoutDraft=details;
    const subtotal=checkoutSubtotal(state.checkoutItems);
    const discount=checkoutDiscount(state.checkoutItems);
    const order={
      orderId:createDraftReference(),
      createdAt:new Date().toISOString(),
      customer:details,
      items:state.checkoutItems.map(item=>({name:byId[item.id].name,shade:item.shade,qty:item.qty,lineTotal:byId[item.id].price*item.qty})),
      subtotal, discount, itemsTotal:subtotal-discount
    };
    state.orderText=buildOrderMessage(details,state.checkoutItems,order.orderId);
    state.lastReceipt=order;
    // No network calls, email delivery, payment capture, or local cart clearing.
    showReceipt(order);
  }

  function showReceipt(result) {
    const holder=document.getElementById('checkout-content');
    if (!holder) return;
    const time=new Date(result.createdAt).toLocaleString('en-PH',{dateStyle:'medium',timeStyle:'short'});
    const lines=result.items.map(item=>`<div class="receipt-item"><div><strong>${safe(item.name)}</strong><span>${safe(item.shade)} · Qty ${item.qty}</span></div><strong>${peso(item.lineTotal)}</strong></div>`).join('');
    holder.innerHTML=`<div class="checkout-finished">
      <span class="finished-mark" aria-hidden="true">${icon('check')}</span>
      <span class="eyebrow">YOUR PERSONAL SHOPPING SUMMARY</span>
      <h2 tabindex="-1">Your garden picks <em>are ready.</em></h2>
      <p>Your summary is ready on this device. <strong>No order or email has been sent, and no payment was made.</strong> Your items remain in your shopping bag.</p>
      <div class="receipt-card" id="receipt-card">
        <span class="receipt-mark">✧ YLÉA FLORÉA ✧</span>
        <h3>Shopping summary</h3>
        <p class="receipt-reference">${safe(result.orderId)}</p>
        <p class="receipt-date">${safe(time)}</p>
        <div class="receipt-status">Local summary only · Not submitted · Unpaid</div>
        <div class="receipt-products">${lines}</div>
        <div class="receipt-total"><span>Items subtotal</span><strong>${peso(result.subtotal)}</strong></div>
        ${result.discount?`<div class="receipt-total"><span>Welcome discount</span><strong>− ${peso(result.discount)}</strong></div>`:''}
        <div class="receipt-total receipt-grand"><span>Items total</span><strong>${peso(result.itemsTotal)}</strong></div>
        <div class="receipt-total"><span>Shipping</span><strong>Not included</strong></div>
        <div class="receipt-delivery"><strong>Prepared for</strong><span>${safe(result.customer.customer)}</span><span>${safe(result.customer.email)}</span><span>${safe(result.customer.phone)}</span><span>${safe([result.customer.address,result.customer.city,result.customer.province,result.customer.postal].filter(Boolean).join(', '))}</span></div>
        <p class="receipt-note">This is a personal shopping summary. It is not a confirmed order, payment receipt, or proof of purchase. The shop has not received this information.</p>
      </div>
      <div class="order-request-actions">
        <button type="button" class="btn btn-primary" data-download-summary>Download Summary (.txt)</button>
        <button type="button" class="btn btn-outline" data-print-summary>Print / Save as PDF</button>
        <button type="button" class="btn btn-outline" data-copy-order>Copy Details</button>
      </div>
      <label class="order-copy-label" for="order-copy-text">Your order details (you can also select and copy)</label>
      <textarea id="order-copy-text" class="order-copy-text" rows="6" readonly>${safe(state.orderText)}</textarea>
      <div class="order-next-actions"><button type="button" data-edit-checkout>Edit my details</button><button type="button" data-shop-again>Continue shopping</button></div>
      <p class="order-privacy-note">Need help? You can contact the shop yourself at <a href="mailto:${SHOP_EMAIL}">${SHOP_EMAIL}</a>.</p>
    </div>`;
    holder.querySelector('h2')?.focus?.({preventScroll:true});
  }

  async function copyText(value) {
    try {
      if (navigator.clipboard?.writeText) {await navigator.clipboard.writeText(value);return true;}
    } catch {/* Clipboard unavailable in some local browser contexts. */}
    const field=document.getElementById('order-copy-text');
    if(field) {
      field.focus();field.select();
      try {return !!document.execCommand('copy');} catch {return false;}
    }
    return false;
  }

  function downloadSummary() {
    if(!state.orderText || !state.lastReceipt) return;
    const file=new Blob([state.orderText],{type:'text/plain;charset=utf-8'});
    const url=URL.createObjectURL(file);
    const a=document.createElement('a');
    a.href=url;a.download=`${state.lastReceipt.orderId}.txt`;
    document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }

  function initEvents() {
    document.addEventListener('click', event => {
      const target = event.target.closest('button, a, .overlay-shade'); if (!target) return;
      if (target.hasAttribute('data-close-overlay')) {closeOverlays();return;}
      if (target.hasAttribute('data-open-cart')) {openCart();return;}
      if (target.hasAttribute('data-open-signup')) {openSignup();return;}
      if (target.hasAttribute('data-menu-toggle')) {
        const menu=document.getElementById('mobile-nav'); const expanded=target.getAttribute('aria-expanded')==='true';
        target.setAttribute('aria-expanded',String(!expanded));target.setAttribute('aria-label',expanded?'Open menu':'Close menu');
        target.innerHTML=icon(expanded?'menu':'close');if(menu)menu.hidden=expanded;return;
      }
      if (target.hasAttribute('data-open-view')) {openDetails(target.dataset.openView);return;}
      if (target.hasAttribute('data-toggle-fav')) {toggleFavorite(target.dataset.toggleFav);return;}
      if (target.hasAttribute('data-detail-fav')) {toggleFavorite(target.dataset.detailFav);return;}
      if (target.hasAttribute('data-card-add')) {
        const product=byId[target.dataset.cardAdd];if(!product)return;
        if(product.shades.length>1 && !product.isPalette) openDetails(product.id);
        else {addToCart(product.id);openCart();}
        return;
      }
      if (target.hasAttribute('data-card-buy')) {const p=byId[target.dataset.cardBuy]; if (!p) return; if (p.shades.length>1 && !p.isPalette) {openDetails(p.id);} else buySelected(p.id);return;}
      if (target.hasAttribute('data-detail-shade')) {chooseShade(Number(target.dataset.detailShade));return;}
      if (target.hasAttribute('data-detail-qty')) {
        state.detailQty=Math.max(1,Math.min(99,state.detailQty + Number(target.dataset.detailQty)));
        const el=document.getElementById('detail-qty');if(el)el.textContent=state.detailQty;return;
      }
      if (target.hasAttribute('data-detail-add')) {addToCart(state.activeProduct,state.shadeIndex,state.detailQty);openCart();return;}
      if (target.hasAttribute('data-detail-buy')) {buySelected(state.activeProduct,state.shadeIndex,state.detailQty);return;}
      if (target.hasAttribute('data-cart-qty')) {updateCartQty(Number(target.dataset.index),Number(target.dataset.cartQty));return;}
      if (target.hasAttribute('data-cart-remove')) {state.cart.splice(Number(target.dataset.cartRemove),1);write(STORAGE.cart,state.cart);updateCounts();renderCart();toast('Item removed from your bag');return;}
      if (target.hasAttribute('data-apply-code')) {applyPromo();return;}
      if (target.hasAttribute('data-open-checkout')) {openCheckout(state.cart,'cart');return;}
      if (target.hasAttribute('data-keep-shopping')) {closeOverlays();location.href='products.html';return;}
      if (target.hasAttribute('data-copy-order')) {copyText(state.orderText).then(ok=>toast(ok?'Summary details copied!':'Select and copy the summary text below.'));return;}
      if (target.hasAttribute('data-download-summary')) {downloadSummary();return;}
      if (target.hasAttribute('data-print-summary')) {window.print();return;}
      if (target.hasAttribute('data-edit-checkout')) {openCheckout(state.checkoutItems,state.checkoutSource);return;}
      if (target.hasAttribute('data-shop-again')) {closeOverlays();location.href='products.html';return;}
      if (target.hasAttribute('data-copy-promo')) {
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText('BLOOM15').then(()=>toast('Welcome code copied!')).catch(()=>toast('Your code is BLOOM15'));
        else toast('Your welcome code is BLOOM15');return;
      }
      if (target.classList.contains('filter-chip')) {state.filter=target.dataset.category;renderProducts();return;}
      if (target.id==='clear-filters') {state.search='';state.filter='all';const input=document.getElementById('product-search');if(input)input.value='';renderProducts();return;}
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {closeOverlays();return;}
      if (event.key === 'Enter' && document.activeElement?.id === 'promo-input') {event.preventDefault();applyPromo();return;}
      if (event.key !== 'Tab') return;
      const active=document.querySelector('.site-overlay.is-open');if(!active)return;
      const elements=Array.from(active.querySelectorAll('button:not([disabled]):not([hidden]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),a[href]')).filter(el=>el.getClientRects().length);
      if(!elements.length)return;
      const first=elements[0],last=elements[elements.length-1];
      if(event.shiftKey && document.activeElement===first){event.preventDefault();last.focus();}
      else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first.focus();}
    });
    const search=document.getElementById('product-search');if(search)search.addEventListener('input',e=>{state.search=e.target.value.trim().toLowerCase();renderProducts();});
    const sort=document.getElementById('product-sort');if(sort)sort.addEventListener('change',e=>{state.sort=e.target.value;renderProducts();});
    const signup=document.getElementById('signup-form');if(signup)signup.addEventListener('submit',signupSubmit);
    const inquiry=document.getElementById('inquiry-form');
    if (inquiry) inquiry.addEventListener('submit',event=>{
      event.preventDefault();
      if (!inquiry.reportValidity())return;
      const data=Object.fromEntries(new FormData(inquiry).entries());
      const body=`YLÉA FLORÉA — INQUIRY\n\nName: ${data.name}\nEmail: ${data.email}\nInquiry type: ${data.type}\nSubject: ${data.subject}\n\n${data.message}`;
      const href=makeMailto(`YLÉA FLORÉA Inquiry: ${data.subject}`,body);
      const success=document.getElementById('inquiry-success');
      if (success) {
        success.hidden=false;
        success.innerHTML=`<strong>Thank you for reaching out to YLÉA FLORÉA. We appreciate your interest and look forward to hearing from you.</strong><span>Click below to open your email app, then press Send to deliver your message.</span><a class="inquiry-email-button" href="${safe(href)}">Open Email to Send Inquiry ↗</a>`;
        success.scrollIntoView({behavior:'smooth',block:'nearest'});
      }
    });
    const overlayArea=document.getElementById('site-overlays');if(overlayArea)overlayArea.addEventListener('submit',event=>{if(event.target.id==='checkout-form')submitCheckout(event);});
    if (page==='products' && state.filter==='favorites') renderProducts();
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderShell();renderFeatured();renderProducts();initEvents();
    if (page==='home' && !read(STORAGE.popup,false)) {
      window.setTimeout(() => {
        if (!document.querySelector('.site-overlay.is-open')) openSignup();
        write(STORAGE.popup,true);
      },1500);
    }
  });
})();
