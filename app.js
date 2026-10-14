const storeStyle = {
  "A101": { logo: "A-101", className: "a101" },
  "BİM": { logo: "BİM", className: "bim" },
  "Migros": { logo: "M", className: "migros" },
  "Şok": { logo: "ŞOK", className: "sok" },
  "Koop Market": { logo: "KOOP", className: "koop" }
};

const form = document.querySelector("#search-form");
const input = document.querySelector("#search-input");
const clearButton = document.querySelector("#clear-search");
const list = document.querySelector("#results-list");
const empty = document.querySelector("#empty-state");
const title = document.querySelector("#result-title");
const updateNote = document.querySelector("#update-note");
const filters = document.querySelectorAll(".filter");
let activeFilter = "all";
let activeProductId = null;
let offers = [];
let unavailableStores = [];
const DATA_REVISION = "2026-10-14-4";

const money = (number) => new Intl.NumberFormat("tr-TR", { minimumFractionDigits: number % 1 ? 2 : 0, maximumFractionDigits: 2 }).format(number) + " TL";
const escapeHTML = (value) => String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", "\"": "&quot;" })[char]);
const fold = (value) => String(value).toLocaleLowerCase("tr-TR").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ı/g, "i").replace(/\b(\d{1,3})\s*['’]?\s*(?:li|lu|lü|lı)\b/gi, "$1 adet").replace(/(\d)(lt|l|ml|kg|gr|g)\b/g, "$1 $2").replace(/\blt\b/g, "l").replace(/\bgr\b/g, "g");

function offerDetails(offer) {
  const count = offer.name.match(/\b(\d{1,3})(?:\s*adet|\s*['’]?\s*(?:li|lu|lü|lı))\b/i);
  if (count) {
    const quantity = Number(count[1]);
    return { packageText: `${quantity} adet`, unit: `${money(offer.price / quantity)} / adet` };
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

function sourceCard(offer) {
  const style = storeStyle[offer.store] ?? { logo: offer.store.slice(0, 4), className: "koop" };
  const details = offerDetails(offer);
  return `
    <article class="offer">
      <div class="store-mark ${style.className}">${escapeHTML(style.logo)}</div>
      <div>
        <p class="product-name">${escapeHTML(offer.name)}</p>
        <p class="product-detail">${details.packageText} · ${escapeHTML(offer.store)}</p>
        <a class="source-link" href="${encodeURI(offer.sourceUrl)}" target="_blank" rel="noreferrer">Kaynağı aç · ${formatCheckedAt(offer.checkedAt)}</a>
      </div>
      <div class="price-block"><div class="price">${money(offer.price)}</div>${offer.oldPrice ? `<div class="old-price">${money(offer.oldPrice)}</div><span class="discount-tag">İNDİRİMLİ</span>` : ""}<div class="unit-price">${details.unit}</div></div>
    </article>`;
}

function unavailableCard(store) {
  return `<aside class="unavailable"><strong>${escapeHTML(store.store)}</strong><span>${escapeHTML(store.reason)}</span></aside>`;
}

function draw() {
  const rawQuery = input.value.trim();
  const query = fold(rawQuery);
  const queryTerms = query.split(/[^a-z0-9]+/).filter(Boolean);
  title.textContent = rawQuery ? rawQuery.charAt(0).toLocaleUpperCase("tr-TR") + rawQuery.slice(1) : "Tüm ürünler";
  let selected = offers.filter((offer) => {
    if (activeProductId) return offer.productId === activeProductId;
    const tokens = fold(`${offer.name} ${offer.store}`).split(/[^a-z0-9]+/).filter(Boolean);
    return !queryTerms.length || queryTerms.every(term => tokens.some(token => token === term || token.startsWith(term)));
  });
  if (activeFilter === "sale") selected = selected.filter(offer => offer.oldPrice && offer.oldPrice > offer.price);
  if (activeFilter !== "all" && activeFilter !== "sale") selected = selected.filter(offer => offer.store === activeFilter);
  selected.sort((a, b) => a.price - b.price);
  list.innerHTML = selected.map(sourceCard).join("") + (query === "yumurta" && activeFilter === "all" ? unavailableStores.map(unavailableCard).join("") : "");
  empty.hidden = Boolean(selected.length || (query === "yumurta" && activeFilter === "all" && unavailableStores.length));
}

async function loadOffers() {
  try {
    const response = await fetch(`data/latest.json?revision=${DATA_REVISION}`, { cache: "no-store" });
    if (!response.ok) throw new Error("data unavailable");
    const data = await response.json();
    offers = Array.isArray(data.offers) ? data.offers : [];
    unavailableStores = Array.isArray(data.storesWithoutCurrentData) ? data.storesWithoutCurrentData : [];
    updateNote.textContent = data.generatedAt ? `Veri kaydı: ${formatCheckedAt(data.generatedAt)}` : "Kaynaklı veri";
  } catch {
    updateNote.textContent = "Veri yüklenemedi";
  }
  draw();
}

form.addEventListener("submit", event => { event.preventDefault(); activeProductId = null; draw(); });
input.addEventListener("input", () => { activeProductId = null; draw(); });
clearButton.addEventListener("click", () => { input.value = ""; activeProductId = null; input.focus(); draw(); });
document.querySelectorAll("[data-query]").forEach(button => button.addEventListener("click", () => { input.value = button.dataset.query; activeProductId = button.dataset.productId ?? null; activeFilter = "all"; filters.forEach(filter => filter.classList.toggle("active", filter.dataset.filter === "all")); draw(); }));
filters.forEach(filter => filter.addEventListener("click", () => { activeFilter = filter.dataset.filter; filters.forEach(item => item.classList.toggle("active", item === filter)); draw(); }));
loadOffers();

