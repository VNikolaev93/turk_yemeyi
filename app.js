const storeStyle = {
  "A101": { logo: "A-101", className: "a101" },
  "BİM": { logo: "BİM", className: "bim" },
  "Migros": { logo: "M", className: "migros" },
  "Şok": { logo: "ŞOK", className: "sok" },
  "Carrefour": { logo: "CF", className: "carrefour" },
  "Koop Market": { logo: "KOOP", className: "koop" }
};

const form = document.querySelector("#search-form");
const input = document.querySelector("#search-input");
const suggestions = document.querySelector("#search-suggestions");
const list = document.querySelector("#results-list");
const empty = document.querySelector("#empty-state");
const title = document.querySelector("#result-title");
const updateNote = document.querySelector("#update-note");
const filters = document.querySelectorAll(".filter");
const catalogCategories = Array.from(document.querySelectorAll("[data-category]"));
const categoryGrid = document.querySelector("#category-grid");
const categorySubcategoriesPanel = document.querySelector("#category-subcategories");
const categorySubcategoriesTitle = document.querySelector("#category-subcategories-title");
const categorySubcategoriesList = document.querySelector("#category-subcategories-list");
const categoryProductsPanel = document.querySelector("#category-products");
const categoryProductsTitle = document.querySelector("#category-products-title");
const categoryProductsList = document.querySelector("#category-products-list");
const showCategoriesButton = document.querySelector("#show-categories");
const showSubcategoriesButton = document.querySelector("#show-subcategories");
let activeFilter = "all";
let activeProductId = null;
let activeCategory = null;
let activeSubcategory = null;
let offers = [];
let unavailableStores = [];
const DATA_REVISION = "2026-10-15-04";
const categories = {
  produce: {
    title: "Meyve ve Sebze",
    subcategories: [
      { id: "produce-fruit", label: "Meyve", icon: "🍌", products: [{ id: "banana-1kg", query: "muz 1 kg", label: "Muz", detail: "1 kg", icon: "🍌" }, { id: "lemon-1kg", query: "limon 1 kg", label: "Limon", detail: "1 kg", icon: "🍋" }] },
      { id: "produce-vegetables", label: "Sebze", icon: "🥕", products: [{ id: "carrot-1kg", query: "havuç 1 kg", label: "Havuç", detail: "1 kg", icon: "🥕" }, { id: "mushrooms", query: "mantar", label: "Mantar", detail: "300–400 g", icon: "🍄" }] }
    ]
  },
  dairy: {
    title: "Süt Ürünleri",
    subcategories: [
      { id: "dairy-milk", label: "Süt", icon: "🥛", products: [{ id: "milk-1l", query: "süt 1l", label: "Süt", detail: "1 L", icon: "🥛" }, { id: "milkten-milkino-cocuk-sutu-200ml", query: "milkten milkino çocuk sütü 200 ml", label: "Milkten Milkino Çocuk Sütü", detail: "200 ml", icon: "🥛" }] },
      { id: "dairy-eggs", label: "Yumurta", icon: "🥚", products: [{ id: "eggs-30", query: "yumurta 30 adet", label: "Yumurta", detail: "30 adet", icon: "🥚" }, { id: "eggs-15", query: "yumurta 15 adet", label: "Yumurta", detail: "15 adet", icon: "🥚" }] },
      { id: "dairy-fats", label: "Tereyağı ve Margarin", icon: "🧈", products: [{ id: "becel-margarin-250g", query: "becel kase margarin 250 gr", label: "Becel Kase Margarin", detail: "250 g", icon: "🧈" }, { id: "mis-tereyagi-1kg", query: "mis tereyağı 1 kg", label: "Mis Tereyağı", detail: "1 kg", icon: "🧈" }, { id: "milkten-tereyagi-250g", query: "milkten tereyağı 250 gr", label: "Milkten Tereyağı", detail: "250 g", icon: "🧈" }] },
      { id: "dairy-yogurt", label: "Yoğurt", icon: "🥣", products: [{ id: "icim-yogurt-750g", query: "içim yoğurt 750 gr", label: "İçim Yoğurt", detail: "750 g", icon: "🥣" }, { id: "sek-yarim-yagli-yogurt-750g", query: "sek yarım yağlı yoğurt 750 gr", label: "Sek Yarım Yağlı Yoğurt", detail: "750 g", icon: "🥣" }, { id: "mis-tam-yagli-homojenize-yogurt-750g", query: "mis tam yağlı homojenize yoğurt 750 gr", label: "Mis Tam Yağlı Homojenize Yoğurt", detail: "750 g", icon: "🥣" }, { id: "mis-meyveli-yogurt-cilek-500g", query: "mis meyveli yoğurt çilek 500 gr", label: "Mis Meyveli Yoğurt Çilek", detail: "500 g", icon: "🥣" }, { id: "mis-suzme-yogurt-900g", query: "mis süzme yoğurt 900 gr", label: "Mis Süzme Yoğurt", detail: "900 g", icon: "🥣" }] },
      { id: "dairy-cheese", label: "Peynir", icon: "🧀", products: [] },
      { id: "dairy-ayran-kefir", label: "Ayran ve Kefir", icon: "🥛", products: [] }
    ]
  },
  meat: {
    title: "Et, Tavuk ve Balık",
    subcategories: []
  },
  drinks: {
    title: "İçecek",
    subcategories: [
      { id: "water", label: "Su", icon: "💧", products: [] },
      { id: "sparkling-drinks", label: "Gazlı İçecekler", icon: "🥤", products: [{ id: "coca-cola-light-1-5l", query: "coca cola light 1.5 l", label: "Coca-Cola Light", detail: "1,5 L", icon: "🥤" }, { id: "coca-cola-1l", query: "coca cola 1 l", label: "Coca-Cola", detail: "1 L", icon: "🥤" }] },
      { id: "still-drinks", label: "Gazsız İçecekler", icon: "🧃", products: [{ id: "doganay-limonata-1l", query: "doğanay limonata 1 l", label: "Doğanay Limonata", detail: "1 L", icon: "🧃" }] },
      { id: "juice", label: "Meyve Suyu", icon: "🧃", products: [{ id: "dimes-visne-nektari-200ml", query: "dimes vişne nektarı 200 ml", label: "Dimes Vişne Nektarı", detail: "200 ml", icon: "🧃" }, { id: "cappy-karisik-nektari-200ml", query: "cappy karışık nektarı 200 ml", label: "Cappy Karışık Nektarı", detail: "200 ml", icon: "🧃" }] }
    ]
  },
  staples: {
    title: "Temel Gıda",
    subcategories: [
      { id: "bakery", label: "Ekmek ve Unlu Mamüller", icon: "🥖", products: [{ id: "superfresh-milfoy-hamuru-1kg", query: "superfresh milföy hamuru 1 kg", label: "Superfresh Milföy Hamuru", detail: "1 kg", icon: "🥖" }] },
      { id: "sauce", label: "Sos", icon: "🍅", products: [{ id: "calve-mayonez-540g", query: "calve mayonez 540 gr", label: "Calve Mayonez", detail: "540 g", icon: "🍅" }, { id: "calve-cheddar-sos-240g", query: "calve cheddar sos 240 gr", label: "Calve Cheddar Sos", detail: "240 g", icon: "🍅" }] }
    ]
  },
  snacks: {
    title: "Atıştırmalık",
    subcategories: [
      { id: "chips", label: "Cips", icon: "🥔", products: [{ id: "lays-baharatli-125g", query: "lays baharatlı 125 gr", label: "Lay's Baharatlı", detail: "125 g", icon: "🥔" }, { id: "lays-baharatli-160g", query: "lays baharatlı 160 gr", label: "Lay's Baharatlı", detail: "160 g", icon: "🥔" }] },
      { id: "ice-cream", label: "Dondurma", icon: "🍨", products: [] },
      { id: "chocolate", label: "Çikolata", icon: "🍫", products: [] }
    ]
  }
};
let catalogSubcategories = [];
let catalogProducts = [];

function rebuildCatalog(data = {}) {
  const additions = data.catalog ?? {};
  Object.entries(additions).forEach(([subcategoryId, products]) => {
    const subcategory = Object.values(categories).flatMap(category => category.subcategories).find(item => item.id === subcategoryId);
    if (!subcategory || !Array.isArray(products)) return;
    const knownIds = new Set(subcategory.products.map(product => product.id));
    subcategory.products.push(...products.filter(product => product?.id && !knownIds.has(product.id)));
  });
  catalogSubcategories = Object.values(categories).flatMap(category => category.subcategories);
  catalogProducts = catalogSubcategories.flatMap(subcategory => subcategory.products);
}

rebuildCatalog();

const money = (number) => new Intl.NumberFormat("tr-TR", { minimumFractionDigits: number % 1 ? 2 : 0, maximumFractionDigits: 2 }).format(number) + " TL";
const escapeHTML = (value) => String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", "\"": "&quot;" })[char]);
const fold = (value) => String(value).toLocaleLowerCase("tr-TR").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ı/g, "i").replace(/\b(\d{1,3})\s*['’]?\s*(?:li|lu|lü|lı)\b/gi, "$1 adet").replace(/(\d)(lt|l|ml|kg|gr|g)\b/g, "$1 $2").replace(/\blt\b/g, "l").replace(/\bgr\b/g, "g");

function offerDetails(offer) {
  const count = offer.name.match(/\b(\d{1,3})(?:\s*adet|\s*['’]?\s*(?:li|lu|lü|lı))\b/i);
  if (count) {
    const quantity = Number(count[1]);
    return { packageText: `${quantity} adet`, unit: `${money(offer.price / quantity)} / adet` };
  }

  const multipack = offer.name.match(/\b(\d+)\s*[x×]\s*(\d+(?:[.,]\d+)?)\s*(lt|l|ml|kg|gr|g)\b/i);
  if (multipack) {
    const packCount = Number(multipack[1]);
    const itemQuantity = Number(multipack[2].replace(",", "."));
    const unit = multipack[3].toLocaleLowerCase("tr-TR");
    const totalQuantity = packCount * itemQuantity;
    if (unit === "lt" || unit === "l") return { packageText: `${packCount} × ${itemQuantity} L`, unit: `${money(offer.price / totalQuantity)} / L` };
    if (unit === "ml") return { packageText: `${packCount} × ${itemQuantity} ml`, unit: `${money(offer.price / (totalQuantity / 1000))} / L` };
    if (unit === "kg") return { packageText: `${packCount} × ${itemQuantity} kg`, unit: `${money(offer.price / totalQuantity)} / kg` };
    return { packageText: `${packCount} × ${itemQuantity} g`, unit: `${money(offer.price / (totalQuantity / 1000))} / kg` };
  }

  const measure = offer.name.match(/\b(\d+(?:[.,]\d+)?)\s*(lt|l|ml|kg|gr|g)\b/i);
  if (!measure) return { packageText: "Paket bilgisi yok", unit: "Birim fiyat yok" };

  const quantity = Number(measure[1].replace(",", "."));
  const unit = measure[2].toLocaleLowerCase("tr-TR");
  if (unit === "lt" || unit === "l") {
    return { packageText: `${quantity} L`, unit: `${money(offer.price / quantity)} / L` };
  }
  if (unit === "ml") {
    return { packageText: `${quantity} ml`, unit: `${money(offer.price / (quantity / 1000))} / L` };
  }
  if (unit === "kg") {
    return { packageText: `${quantity} kg`, unit: `${money(offer.price / quantity)} / kg` };
  }
  return { packageText: `${quantity} g`, unit: `${money(offer.price / (quantity / 1000))} / kg` };
}

function formatCheckedAt(value) {
  return new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}

function regularPrice(offer) {
  const price = Number(offer.price);
  const candidate = Number(offer.discountPrice ?? offer.discount_price ?? offer.oldPrice);
  return Number.isFinite(price) && Number.isFinite(candidate) && candidate > price ? candidate : null;
}

function offerCard(offer) {
  const style = storeStyle[offer.store] ?? { logo: offer.store.slice(0, 4), className: "carrefour" };
  const details = offerDetails(offer);
  const oldPrice = regularPrice(offer);
  return `
    <article class="offer">
      <div class="store-mark ${style.className}">${escapeHTML(style.logo)}</div>
      <div>
        <p class="product-name">${escapeHTML(offer.name)}</p>
        <p class="product-detail">${details.packageText} · ${escapeHTML(offer.store)}</p>
      </div>
      <div class="price-block"><div class="price">${money(offer.price)}</div>${oldPrice ? `<div class="old-price">${money(oldPrice)}</div><span class="discount-tag">İNDİRİMLİ</span>` : ""}<div class="unit-price">${details.unit}</div></div>
    </article>`;
}

function unavailableCard(store) {
  return `<aside class="unavailable"><strong>${escapeHTML(store.store)}</strong><span>${escapeHTML(store.reason)}</span></aside>`;
}

function hideSuggestions() {
  suggestions.hidden = true;
}

function showSuggestions() {
  const terms = fold(input.value).split(/[^a-z0-9]+/).filter(Boolean);
  const matches = terms.length ? catalogProducts.filter((product) => {
    const tokens = fold(`${product.label} ${product.query}`).split(/[^a-z0-9]+/).filter(Boolean);
    return terms.every(term => tokens.some(token => token.startsWith(term)));
  }) : [];
  suggestions.innerHTML = matches.map((product) => `<button class="search-suggestion" type="button" role="option" data-suggestion-id="${escapeHTML(product.id)}"><span class="search-suggestion-name">${escapeHTML(product.label)}</span><span class="search-suggestion-detail">${escapeHTML(product.detail)}</span></button>`).join("");
  suggestions.hidden = matches.length === 0;
}

function selectProduct(product) {
  input.value = product.query;
  activeProductId = product.id;
  activeCategory = null;
  activeSubcategory = null;
  activeFilter = "all";
  filters.forEach(filter => filter.classList.toggle("active", filter.dataset.filter === "all"));
  hideSuggestions();
  draw();
  document.querySelector(".results")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function showCategoryGrid() {
  activeCategory = null;
  activeSubcategory = null;
  activeProductId = null;
  categoryGrid.hidden = false;
  categorySubcategoriesPanel.hidden = true;
  categoryProductsPanel.hidden = true;
  catalogCategories.forEach(card => card.classList.remove("active"));
}

function selectCategory(category) {
  const selectedCategory = categories[category];
  if (!selectedCategory) return;
  activeCategory = category;
  activeSubcategory = null;
  activeProductId = null;
  input.value = "";
  activeFilter = "all";
  filters.forEach(filter => filter.classList.toggle("active", filter.dataset.filter === "all"));
  catalogCategories.forEach(card => card.classList.toggle("active", card.dataset.category === category));
  categoryGrid.hidden = true;
  categorySubcategoriesPanel.hidden = false;
  categoryProductsPanel.hidden = true;
  categorySubcategoriesTitle.textContent = selectedCategory.title;
  categorySubcategoriesList.innerHTML = selectedCategory.subcategories.map((subcategory) => `
    <button class="category-product-card" type="button" data-subcategory-id="${escapeHTML(subcategory.id)}">
      <span class="category-product-icon" aria-hidden="true">${subcategory.icon}</span>
      <span class="category-product-name">${escapeHTML(subcategory.label)}</span>
      <span class="category-product-meta">${subcategory.products.length ? `${subcategory.products.length} ürün · Seç →` : "Yakında"}</span>
    </button>`).join("");
  hideSuggestions();
  categorySubcategoriesPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function selectSubcategory(subcategoryId) {
  const selectedCategory = categories[activeCategory];
  const subcategory = selectedCategory?.subcategories.find(item => item.id === subcategoryId);
  if (!subcategory) return;
  activeSubcategory = subcategory.id;
  activeProductId = null;
  categorySubcategoriesPanel.hidden = true;
  categoryProductsPanel.hidden = false;
  categoryProductsTitle.textContent = subcategory.label;
  categoryProductsList.innerHTML = subcategory.products.length ? subcategory.products.map((product) => `
    <button class="category-product-card" type="button" data-category-product-id="${escapeHTML(product.id)}">
      <span class="category-product-icon" aria-hidden="true">${product.icon}</span>
      <span class="category-product-name">${escapeHTML(product.label)}</span>
      <span class="category-product-meta">${escapeHTML(product.detail)}</span>
    </button>`).join("") : `<p class="category-products-empty">Bu alt kategoride henüz fiyatı bulunan ürün yok.</p>`;
  hideSuggestions();
  draw();
  categoryProductsPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function showSubcategories() {
  activeSubcategory = null;
  activeProductId = null;
  categorySubcategoriesPanel.hidden = false;
  categoryProductsPanel.hidden = true;
  draw();
  categorySubcategoriesPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function draw() {
  const rawQuery = input.value.trim();
  const query = fold(rawQuery);
  const queryTerms = query.split(/[^a-z0-9]+/).filter(Boolean);
  const subcategory = catalogSubcategories.find(item => item.id === activeSubcategory);
  title.textContent = activeProductId ? rawQuery.charAt(0).toLocaleUpperCase("tr-TR") + rawQuery.slice(1) : subcategory ? subcategory.label : activeCategory ? categories[activeCategory]?.title : rawQuery ? rawQuery.charAt(0).toLocaleUpperCase("tr-TR") + rawQuery.slice(1) : "Tüm ürünler";
  let selected = offers.filter((offer) => {
    if (activeProductId) return offer.productId === activeProductId;
    if (subcategory) return subcategory.products.some(product => product.id === offer.productId);
    if (activeCategory) return categories[activeCategory]?.subcategories.some(item => item.products.some(product => product.id === offer.productId));
    const tokens = fold(`${offer.name} ${offer.store}`).split(/[^a-z0-9]+/).filter(Boolean);
    return !queryTerms.length || queryTerms.every(term => tokens.some(token => token === term || token.startsWith(term)));
  });
  if (activeFilter === "sale") selected = selected.filter(offer => regularPrice(offer));
  if (activeFilter !== "all" && activeFilter !== "sale") selected = selected.filter(offer => offer.store === activeFilter);
  selected.sort((a, b) => a.price - b.price);
  list.innerHTML = selected.map(offerCard).join("") + (query === "yumurta" && activeFilter === "all" ? unavailableStores.map(unavailableCard).join("") : "");
  empty.hidden = Boolean(selected.length || (query === "yumurta" && activeFilter === "all" && unavailableStores.length));
}

async function loadOffers() {
  try {
    const response = await fetch(`data/latest.json?revision=${DATA_REVISION}`, { cache: "no-store" });
    if (!response.ok) throw new Error("data unavailable");
    const data = await response.json();
    rebuildCatalog(data);
    offers = Array.isArray(data.offers) ? data.offers : [];
    unavailableStores = Array.isArray(data.storesWithoutCurrentData) ? data.storesWithoutCurrentData : [];
    updateNote.textContent = data.generatedAt ? `Veri kaydı: ${formatCheckedAt(data.generatedAt)}` : "Fiyatlar güncel";
  } catch {
    updateNote.textContent = "Veri yüklenemedi";
  }
  draw();
}

form.addEventListener("submit", event => { event.preventDefault(); showCategoryGrid(); hideSuggestions(); draw(); });
input.addEventListener("focus", showSuggestions);
input.addEventListener("blur", () => window.setTimeout(hideSuggestions, 120));
input.addEventListener("input", () => { activeProductId = null; showCategoryGrid(); draw(); showSuggestions(); });
suggestions.addEventListener("mousedown", event => event.preventDefault());
suggestions.addEventListener("click", (event) => {
  const id = event.target.closest("[data-suggestion-id]")?.dataset.suggestionId;
  const product = catalogProducts.find(item => item.id === id);
  if (product) selectProduct(product);
});
document.querySelectorAll("[data-query]").forEach(button => button.addEventListener("click", () => {
  const product = catalogProducts.find(item => item.id === button.dataset.productId);
  if (product) selectProduct(product);
  else {
    input.value = button.dataset.query;
    activeProductId = null;
    activeFilter = "all";
    filters.forEach(filter => filter.classList.toggle("active", filter.dataset.filter === "all"));
    hideSuggestions();
    draw();
  }
}));
catalogCategories.forEach(card => card.addEventListener("click", () => selectCategory(card.dataset.category)));
categorySubcategoriesList.addEventListener("click", (event) => {
  const id = event.target.closest("[data-subcategory-id]")?.dataset.subcategoryId;
  if (id) selectSubcategory(id);
});
categoryProductsList.addEventListener("click", (event) => {
  const id = event.target.closest("[data-category-product-id]")?.dataset.categoryProductId;
  const product = catalogProducts.find(item => item.id === id);
  if (product) selectProduct(product);
});
showCategoriesButton.addEventListener("click", showCategoryGrid);
showSubcategoriesButton.addEventListener("click", showSubcategories);
filters.forEach(filter => filter.addEventListener("click", () => { activeFilter = filter.dataset.filter; filters.forEach(item => item.classList.toggle("active", item === filter)); draw(); }));
loadOffers();

