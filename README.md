# YLÉA FLORÉA — Makeup Shop (HTML + CSS + JavaScript Only)

**Where the Impossible Blooms**

This is a completely static, multi-page website that opens in a browser. No Node.js, email backend, passwords, server configuration, or npm are required.

## Open the website

1. Extract the entire ZIP folder, keeping the `assets`, `css`, and `js` folders beside the HTML files.
2. Double-click **index.html**, or open it with a web browser.
3. Click **Enter the Garden** to visit the homepage, then **Shop** for the 12 products.

### Features

- Responsive landing page, homepage, shop, About and Contact pages.
- Improved versions of all the supplied website images, with clean asset names. All are stored in the assets folders and all references are updated.
- All 12 makeup products, their prices, shade selectors, and details.
- Wishlist, shopping cart, quantity changes, removal, promo code `BLOOM15`, Buy Now, and checkout form.
- **Join the Garden** remembers the entered email *only in the current browser* and prefills the checkout email field.
- **Create My Order Summary** generates a shopping summary **on the user's device only**, with download `.txt`, Copy and Print/Save as PDF options. The shopping bag remains unchanged so customers can revise their selection.
- Contact Us displays the business email and supports manually preparing an inquiry in the customer's own email app. This is not automated Gmail sending.

### Important: there is no server order submission

The static checkout **does not place an order with the shop, email a receipt, take payments, or create an official purchase confirmation**. It creates a local shopping summary; the shop does not receive the order or customer information. Shipping remains uncalculated. To accept real orders and send customer email receipts later, you will need a secure backend or suitable third-party service.

Cart, wishlist, welcome code, and Join the Garden email are saved in the local browser (`localStorage`) where supported. Clearing browser data or using another device clears that state. Contact/delivery details typed in the checkout form are not transmitted automatically.

### Folder structure

- `index.html`, `home.html`, `products.html`, `about.html`, `contact.html`
- `css/styles.css`
- `js/products.js`, `js/site.js`
- `assets/brand`, `assets/places`, `assets/products`

**Image quality note:** Images were resized and gently sharpened without redesigning the photographs or product packaging. Source images with very low original resolution still have a finite amount of real detail; resizing cannot recover details that were never present.

**Rights note:** Please make sure you have permission to publish any third-party reference or product images.
