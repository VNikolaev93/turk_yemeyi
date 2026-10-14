export function folded(value = "") {
  return value
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function parseTurkishPrice(value) {
  const number = String(value).replace(/[^0-9,.-]/g, "").replace(/\./g, "").replace(",", ".");
  const result = Number(number);
  return Number.isFinite(result) ? result : null;
}

export function regularPrice(currentPrice, discountPrice) {
  const current = Number(currentPrice);
  const regular = Number(discountPrice);
  return Number.isFinite(current) && Number.isFinite(regular) && regular > current ? regular : null;
}

export function packageInfo(productName) {
  const text = String(productName);
  const count = text.match(/\b(\d{1,3})(?:\s*adet|\s*['’]?\s*(?:li|lu|lü|lı))\b/i);
  const grams = text.match(/\b(\d+(?:[.,]\d+)?)\s*(kg|g|gr|ml|l)\b/i);
  if (count) return { packageText: `${count[1]} adet`, quantity: Number(count[1]), unit: "adet" };
  if (!grams) return { packageText: null, quantity: null, unit: null };
  const quantity = Number(grams[1].replace(",", "."));
  const rawUnit = grams[2].toLowerCase();
  if (rawUnit === "kg" || rawUnit === "l") return { packageText: `${quantity} ${rawUnit.toUpperCase()}`, quantity, unit: rawUnit };
  return { packageText: `${quantity} ${rawUnit}`, quantity: quantity / 1000, unit: rawUnit === "ml" ? "l" : "kg" };
}

export function unitPrice(price, productName) {
  const info = packageInfo(productName);
  if (!price || !info.quantity || !info.unit) return { ...info, value: null };
  return { ...info, value: price / info.quantity };
}

