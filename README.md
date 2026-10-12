# Fiyat Bul

Mobile-first Turkish grocery price-comparison MVP. The application interface accepts Turkish search terms and compares offers from Şok, Migros, A101, BİM and Koop Market.

## Current state

The published site is a static MVP: it has Turkish-language product search, store filters, sale and regular price display, a calculated unit price, a source link, and the date each record was checked. The current seed data is deliberately date-labelled so that an older price is never presented as fresh.

## Price updates

The displayed records live in `data/latest.json` on the public site. Update that file when new verified prices are available. Each record should follow this shape:

```json
{
  "store": "A101",
  "productName": "M Yumurta",
  "packageText": "30 adet",
  "salePrice": 99,
  "regularPrice": 159,
  "unitPrice": 3.3,
  "unit": "adet",
  "checkedAt": "2026-10-05T00:00:00+03:00",
  "sourceUrl": "https://example.com/product"
}
```

The collector notes in `collectors/` describe the intended retailer sources. Each update must preserve the original source URL and `checkedAt`, so visitors can verify a price and see when it was checked.

