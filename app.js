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
const DATA_REVISION = "2026-10-15-31";
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
      { id: "dairy-cheese", label: "Peynir", icon: "🧀", products: [] },
      { id: "dairy-milk", label: "Süt", icon: "🥛", products: [] },
      { id: "dairy-yogurt", label: "Yoğurt", icon: "🥣", products: [] },
      { id: "dairy-fats", label: "Tereyağı ve Margarin", icon: "🧈", products: [] },
      { id: "other-dairy", label: "Diğer Süt Ürünleri", icon: "🥛", products: [] },
      { id: "dairy-eggs", label: "Yumurta", icon: "🥚", products: [] }
    ]
  },
  breakfast: {
    title: "Kahvaltılık",
    subcategories: [
      { id: "breakfast-cereals-bars-granola", label: "Kahvaltılık Gevrek Bar ve Granola", icon: "🥣", products: [] },
      { id: "honey-jam", label: "Bal ve Reçel", icon: "🍯", products: [] },
      { id: "spreads-breakfast-sauces", label: "Sürülebilir Ürünler ve Kahvaltılık Soslar", icon: "🥄", products: [] },
      { id: "halva-tahini-molasses", label: "Helva Tahin ve Pekmez", icon: "🍬", products: [] },
      { id: "olives", label: "Zeytin", icon: "🫒", products: [] }
    ]
  },
  meat: {
    title: "Et, Tavuk ve Balık",
    subcategories: [
      { id: "deli", label: "Şarküteri", icon: "🥓", products: [] },
      { id: "white-meat", label: "Beyaz Et", icon: "🍗", products: [] },
      { id: "seafood", label: "Deniz Ürünleri", icon: "🐟", products: [] },
      { id: "red-meat", label: "Kırmızı Et", icon: "🥩", products: [] },
      { id: "offal", label: "Sakatat", icon: "🥘", products: [] },
      { id: "fresh-seafood", label: "Taze Deniz Ürünleri", icon: "🦐", products: [] }
    ]
  },
  drinks: {
    title: "İçecek",
    subcategories: [
      { id: "sparkling-drinks", label: "Gazlı İçecekler", icon: "🥤", products: [] },
      { id: "coffee", label: "Kahve", icon: "☕", products: [] },
      { id: "still-drinks", label: "Gazsız İçecekler", icon: "🧃", products: [] },
      { id: "tea-herbal", label: "Çay ve Bitki Çayları", icon: "🍵", products: [] },
      { id: "juice", label: "Meyve Suyu", icon: "🧃", products: [] },
      { id: "mineral-water", label: "Maden Suyu", icon: "🫧", products: [] },
      { id: "ayran-kefir", label: "Ayran ve Kefir", icon: "🥛", products: [] },
      { id: "water", label: "Su", icon: "💧", products: [] }
    ]
  },
  staples: {
    title: "Temel Gıda",
    subcategories: [
      { id: "prepared-meals", label: "Hazır Yemekler", icon: "🍲", products: [] },
      { id: "sauces-vinegars", label: "Sos ve Sirkeler", icon: "🍶", products: [] },
      { id: "spices-mixes", label: "Baharat ve Harçlar", icon: "🧂", products: [] },
      { id: "legumes", label: "Bakliyat", icon: "🫘", products: [] },
      { id: "bakery", label: "Ekmek ve Unlu Mamüller", icon: "🥖", products: [] },
      { id: "pasta-noodles", label: "Mantı Makarna ve Erişte", icon: "🍝", products: [] },
      { id: "baking-ingredients", label: "Pasta Malzemeleri", icon: "🍰", products: [] },
      { id: "baby-food", label: "Bebek Mamaları", icon: "🍼", products: [] },
      { id: "cooking-oils", label: "Sıvı Yağlar", icon: "🫗", products: [] },
      { id: "flour-semolina", label: "Un ve İrmik", icon: "🌾", products: [] },
      { id: "prepared-food-mixes", label: "Hazır Gıda Karışımları", icon: "🥣", products: [] },
      { id: "canned-food", label: "Konserve", icon: "🥫", products: [] },
      { id: "pickles", label: "Turşu", icon: "🥒", products: [] },
      { id: "sugar-sweeteners", label: "Şeker ve Tatlandırıcılar", icon: "🍬", products: [] },
      { id: "tomato-paste", label: "Salça", icon: "🍅", products: [] }
    ]
  },
  snacks: {
    title: "Atıştırmalık",
    subcategories: [
      { id: "biscuits-crackers", label: "Bisküvi ve Kraker", icon: "🍪", products: [] },
      { id: "chocolate", label: "Çikolata", icon: "🍫", products: [] },
      { id: "gum-candy", label: "Sakız ve Şekerleme", icon: "🍬", products: [] },
      { id: "nuts-dried-fruit", label: "Kuruyemiş ve Kuru Meyve", icon: "🥜", products: [] },
      { id: "ice-cream", label: "Dondurmalar", icon: "🍨", products: [] },
      { id: "chips", label: "Cips", icon: "🥔", products: [] },
      { id: "cake", label: "Kek", icon: "🍰", products: [] },
      { id: "wafers", label: "Gofret", icon: "🧇", products: [] },
      { id: "desserts", label: "Tatlılar", icon: "🍮", products: [] }
    ]
  },
  cleaning: {
    title: "Temizlik Ürünleri",
    subcategories: [
      { id: "laundry-cleaning", label: "Çamaşır Temizlik Ürünleri", icon: "🧺", products: [] },
      { id: "general-cleaning", label: "Genel Temizlik Ürünleri", icon: "🧽", products: [] },
      { id: "dish-cleaning", label: "Bulaşık Temizlik Ürünleri", icon: "🫧", products: [] },
      { id: "kitchen-consumables", label: "Mutfak Sarf Malzemeleri", icon: "🧻", products: [] },
      { id: "other-cleaning", label: "Diğer Temizlik", icon: "🧹", products: [] },
      { id: "tissues-napkins", label: "Kağıt Peçete ve Mendiller", icon: "🤧", products: [] },
      { id: "paper-towels", label: "Kağıt Havlu", icon: "🧻", products: [] },
      { id: "toilet-paper", label: "Tuvalet Kağıtları", icon: "🧻", products: [] },
      { id: "wet-wipes", label: "Islak Mendiller", icon: "🧼", products: [] },
      { id: "health-medical", label: "Sağlık ve Medikal", icon: "🩹", products: [] }
    ]
  },
  personalCare: {
    title: "Kişisel Bakım",
    subcategories: [
      { id: "hair-care", label: "Saç Bakım", icon: "💇", products: [] },
      { id: "shower-bath-soap", label: "Duş Banyo ve Sabun", icon: "🧼", products: [] },
      { id: "perfume-deodorant", label: "Parfüm ve Deodorant", icon: "🌸", products: [] },
      { id: "oral-care", label: "Ağız Bakım", icon: "🦷", products: [] },
      { id: "skin-care", label: "Cilt Bakımı", icon: "🧴", products: [] },
      { id: "sanitary-pads", label: "Hijyenik Ped", icon: "🌷", products: [] },
      { id: "shaving", label: "Tıraş Ürünleri", icon: "🪒", products: [] },
      { id: "makeup", label: "Makyaj", icon: "💄", products: [] },
      { id: "patient-care", label: "Hasta Bakım Ürünleri", icon: "🩹", products: [] },
      { id: "waxing-epilation", label: "Ağda ve Epilasyon", icon: "✨", products: [] }
    ]
  },
  otherProducts: {
    title: "Diğer Ürünler",
    subcategories: [
      { id: "baby-supplies", label: "Bebek Gereçleri", icon: "👶", products: [] },
      { id: "supplements", label: "Gıda Takviyeleri", icon: "💊", products: [] },
      { id: "pet-shop", label: "Pet Shop", icon: "🐾", products: [] }
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

