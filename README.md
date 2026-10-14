# Fiyat Bul

Mobile-first Turkish grocery price-comparison MVP. The application interface accepts Turkish search terms and compares offers from Şok, Migros, A101, BİM and Koop Market.

## Current state

The published site is a static MVP: it has Turkish-language product search, store filters, sale and regular price display, and a calculated unit price.

## Price updates

The displayed records live in `data/latest.json` on the public site. Update that file when new verified prices are available. Each record should follow this shape:

```json
{
  "store": "A101",
  "name": "Coca-Cola Light 1.5 Lt",
  "price": 64.9,
  "discountPrice": 80
}
```

For CSV input, use `Market;Title;Brand;Price;discount_price`. `Price` is the current price. When `discount_price` is greater than `Price`, map it to `discountPrice`; otherwise use the same value or `null`. The interface shows the crossed-out regular price and the sale badge only when the two prices differ.

