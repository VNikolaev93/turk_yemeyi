# Price collectors

`source-registry.json` records the official public catalog route available for each target retailer. The application must never invent a price if a source has not returned one.

## Import contract

The scheduled importer should save verified offers to `dist/data/latest.json` using this shape:

```json
{
  "store": "Şok",
  "name": "Anadolu Çiftliği M Yumurta 30'lu (53-63 g)",
  "price": 169,
  "discountPrice": 199,
  "checkedAt": "2026-10-05T12:00:00+03:00"
}
```

For `Market;Title;Brand;Price;discount_price` input, retain `discountPrice` only if it is greater than `price`. If the values are equal, save `discountPrice` as `null`; the site will not mark that offer as discounted. Use the functions in `lib/normalise.mjs` to normalize Turkish spelling, parse TL values, determine the regular price, and calculate comparable unit prices. Surface unavailable stores instead of substituting an estimate.

For A101, collect only ordinary-store prices; never merge A101 Kapıda or A101 Ekstra listings. A temporary public lookup context can be used to read a Migros store offer but must never be stored, displayed or used for delivery calculations.

