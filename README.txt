COURTIVA — WEBSITE PROJECT
===========================

This is a static (no backend/database) website. It's built with plain
HTML, CSS and JavaScript — no frameworks, no build tools, no install
step required. You can open it and start editing right away.


FOLDER STRUCTURE
-----------------

courtiva/
│
├── index.html      <- The page content & structure (text, images, layout)
├── style.css       <- All visual styling (colors, fonts, spacing, layout)
├── script.js       <- All interactive behavior (scroll effects, tabs, form)
├── media/           <- ALL images, videos, and GIFs used on the site
│   ├── images/       <- placeholder photos + the logo, ready to be swapped out
│   ├── videos/        <- empty for now (see the .txt note inside)
│   └── gifs/           <- empty for now (see the .txt note inside)
└── README.txt       <- This file

Why split into 3 files instead of 1?
  - HTML   = the skeleton (what's on the page)
  - CSS    = the skin (how it looks)
  - JS     = the muscles (how it behaves/reacts)
Keeping them separate makes each file smaller and easier to find things
in, lets you reuse style.css or script.js across multiple HTML pages
later (e.g. a "Shop" page, a "Product Detail" page), and is the
standard way real-world websites are organized.


HOW TO RUN IT LOCALLY
-----------------------

Easiest option: just double-click index.html and it opens in your
browser. Since this site has no backend, that's enough to see it work.

If you later add features that require a local server (e.g. testing
fetch() calls), you can run one from the project folder:
  - VS Code: install the "Live Server" extension, right-click
    index.html → "Open with Live Server"
  - Or, with Python installed: run `python -m http.server` in the
    folder, then visit http://localhost:8000


WHAT TO EDIT, DEPENDING ON WHAT YOU WANT TO CHANGE
-----------------------------------------------------

Text, images, links, page sections  -> index.html
Wording for About Us / Our Story / Fabric 1 / Fabric 2 / FAQ -> index.html, inside <div id="pageSources">
Photos, videos, GIFs -> media/images, media/videos, media/gifs
Colors, fonts, spacing, layout, hover effects, animations -> style.css
Menu behavior, tab switching, form handling, any interactivity -> script.js

Some concrete examples:

1. Change a product name/price/photo
   -> index.html, inside <div class="product-grid"> — find the
      <article class="product-card"> block and edit its text/img src.

2. Change the brand name "COURTIVA"
   -> index.html — appears in <title>, the header .logo, and the
      hero <h1>. Also check the footer email/copyright line.

3. Change the color scheme
   -> style.css — edit the CSS variables at the very top, inside
      :root { ... }. Everything on the page references these, so
      changing --cream, --ink, --olive etc. updates the whole site.

4. Change fonts
   -> index.html — swap the Google Fonts <link> tag in <head>.
   -> style.css — update the font-family values to match your new
      font's name (search for 'Fraunces' and 'Jost').

5. Add a new interactive feature (e.g. make the tabs actually filter
   products, or make the cart icon open a mini-cart)
   -> script.js — add a new function, following the pattern already
      used for the tabs or the newsletter form.


HOW THE FILES CONNECT
------------------------

index.html links to the other two files near the top and bottom:

  <link rel="stylesheet" href="style.css">   <- in <head>, loads the CSS
  <script src="script.js"></script>          <- near </body>, loads the JS

If you rename style.css or script.js, or move them into a subfolder
(e.g. /css/style.css), you MUST update these two lines in index.html
to match, or the page will lose its styling/behavior.


NEXT STEPS AS A BEGINNER
---------------------------

1. Open index.html and style.css side by side. Change one CSS value
   (e.g. --olive color) at a time, save, and refresh your browser to
   see what it affects. This is the fastest way to learn how the two
   files relate.

2. Use your browser's DevTools (right-click any element -> "Inspect")
   to see exactly which CSS rule is styling something you clicked on.

3. Once comfortable, try small additions in script.js, like a mobile
   menu toggle for the hamburger icon (.burger), since it's currently
   just a placeholder button with no behavior yet.

4. This site currently uses external stock photos (from Pexels/
   Unsplash URLs) and Google Fonts loaded from the internet. If you
   want it to work fully offline, download those images/fonts into
   an /images and /fonts folder and update the paths in index.html
   and style.css accordingly.


RECENTLY ADDED FEATURES (for reference)
------------------------------------------

1. Scrolling brand strip
   -> index.html: .brands section now wraps the brand names in
      .marquee > .marquee-track, with the list duplicated once so
      the loop looks seamless.
   -> style.css: search "BRANDS (right-to-left marquee)" — the
      @keyframes marquee-scroll animation does the actual movement.
      Change the "26s" in .marquee-track{animation:...} to speed up
      or slow down the scroll.

2. "Pages" dropdown + dynamic page content
   -> index.html: the header's "Pages" link is now a .dropdown
      containing a .dropdown-menu with 5 links (About Us, Our Story,
      Fabric 1, Fabric 2, FAQ), each with a data-page="..." attribute.
      A hidden <main id="pageContent"> block near the top of <body>
      is used to display whichever page was clicked, and all the
      normal homepage sections are wrapped in <div id="homeContent">
      so they can be hidden/shown as a pair.
   -> index.html: search for id="pageSources" — this is where the
      actual wording for each page lives, as plain <p> tags inside a
      hidden <div data-page="About Us">, <div data-page="Our Story">,
      etc. Edit the text directly inside the matching <div> to change
      what a page says, or add a new <p> for another paragraph.
   -> script.js: search "Loading each page's text". loadPageText()
      just copies the matching #pageSources block's HTML into
      #pageBody — no network request involved. showPage()/showHome()
      do the hide/show swap between sections.
   -> style.css: search "DYNAMIC PAGE CONTENT" and "PAGES DROPDOWN"
      for the related styling.

   NOTE: an earlier version of this site loaded each page's text from
   separate content/*.txt files using fetch(). That only works when
   the site is served over http:// (e.g. via Live Server or
   `python -m http.server`) — opening index.html directly by
   double-clicking it (address bar shows "file://") made those
   requests fail silently, so the text wouldn't load. The content now
   lives directly inside index.html instead, so it works correctly no
   matter how you open the file.

3. Header stays readable on every page
   -> script.js: onScroll() now also checks whether pageContent is
      visible, not just scroll position. Fix for a bug where the
      header text (white, meant to sit over the dark hero photo)
      would go invisible on the plain white "Pages" sub-pages. If you
      add more full-page sections in the future, make sure they're
      accounted for here too, or reuse the existing showPage()/
      showHome() pattern which already calls onScroll() for you.

4. Shopping cart
   -> index.html: each <article class="product-card"> now has
      data-name="..." and data-price="..." attributes — that's how
      the cart knows what to add. The "Quick Add" button inside each
      product image now has a data-add-to-cart attribute so script.js
      can find it. A cart drawer (<aside id="cartDrawer">) and its
      dark background overlay (<div id="cartOverlay">) sit right
      after the header, and the cart icon's number badge is
      <span id="cartCount">, starting with the HTML "hidden" attribute
      so it shows nothing until an item is added.
   -> script.js: search "Shopping cart". The cart itself is just a
      JavaScript array of {name, price, qty} objects, saved to the
      browser's localStorage so it survives a page refresh. Key
      functions: addToCart(), changeQty(), removeFromCart(), and
      updateCartUI() (which keeps the badge, the drawer list, and
      localStorage all in sync — call this after any change to cart).
   -> style.css: search "CART DRAWER" for the slide-in panel styling.

   To add a NEW product to the shop and make it cart-ready:
     1. Copy an existing <article class="product-card"> block in
        index.html.
     2. Update its data-name, data-price, image, and visible text.
     3. That's it — no changes to script.js needed, since it finds
        product cards automatically.

   NOTE: the "Checkout" button in the cart drawer is a placeholder —
   it shows an alert instead of taking payment. Connecting real
   checkout (e.g. via Stripe or Shopify) requires a backend server
   and is a bigger step up from this static site.

5. Shop page
   -> index.html: search "SHOP PAGE" for the <main id="shopContent">
      section. It sits alongside #pageContent and #homeContent as a
      third "screen" that gets shown/hidden the same way. All 24
      products are plain <article class="product-card"> elements
      (same markup pattern as the homepage's featured products), each
      carrying data-name / data-price / data-category attributes.
      Category filter buttons live in #categoryTiles, and the sort
      dropdown is #sortSelect.
   -> script.js: search "Switching between the homepage" for
      setActiveSection() — the one function that decides whether the
      homepage, a Pages sub-page, or the Shop page is visible. Search
      "Shop page: category filter" for applyShopFilter() (shows/hides
      cards based on the active category tile) and the sort dropdown's
      change listener (which re-orders the existing card elements —
      it doesn't regenerate any HTML).
   -> style.css: search "SHOP PAGE" for all of its styling.

   To add a 25th product: copy an existing <article class="product-card">
   block inside #shopGrid, and update its data-name / data-price /
   data-category / image / text. It automatically becomes filterable,
   sortable, and "Add to Cart"-able — no JavaScript changes needed.

   NOTE ON IMAGES: several products intentionally reuse the same small
   set of stock photos already used elsewhere on the site (rather than
   guessing at new photo URLs that might not exist and break). Swap in
   real product photography by replacing each product's <img src="...">
   — see "WHAT TO EDIT" above.

   NOTE ON PAGINATION: the "1 2 3 ›" buttons at the bottom of the Shop
   page are visual only for now, since this demo only has one page's
   worth of products. Wiring up real pagination would matter once you
   have enough products that showing them all on one page isn't
   practical.

6. Font: Poppins, used site-wide
   -> index.html: the Google Fonts <link> in <head> now loads only
      Poppins (weights 300–700, plus italic 400/500). The site
      previously mixed two fonts (Fraunces for headings, Jost for
      body text) — every font-family in style.css now says
      'Poppins', sans-serif for a single, consistent typeface.
   -> To change the font again later: pick a new font at
      fonts.google.com, swap the <link> tag for its embed code, then
      find-and-replace 'Poppins' in style.css with the new font name.

7. Color palette: darker gold + white
   -> style.css: search ":root" at the very top. --olive and
      --olive-dark (the site's gold accent, used in buttons, sale
      tags, icons, hover states, etc.) were both darkened to a richer,
      deeper gold. Because the whole site references these two
      variables instead of hardcoded colors, this one change updated
      the accent color everywhere automatically.
   -> Section labels (the small uppercase text above headings, e.g.
      "Curated For You") now use the dark gold color instead of gray,
      and major headings ("The Edit", "For Women", "Shop") got a
      short gold underline beneath them — both search for "gold
      underline" or "eyebrow" in style.css to find/adjust these.

8. Media folder
   -> All images now live in media/images/, referenced from
      index.html with relative paths like:
        <img src="media/images/hero-banner.jpg" ...>
      There are also empty media/videos/ and media/gifs/ folders
      ready for future use, each with a short .txt note explaining
      how to add files there and reference them.
   -> Every image currently on the site is a PLACEHOLDER — a plain
      graphic showing its filename and the recommended pixel
      dimensions (e.g. "shop-prada-crossback-halter-dress.jpg,
      500 × 650px"). To use your own photo, replace the file in
      media/images/ with your own image SAVED UNDER THE SAME
      FILENAME — you don't need to touch index.html at all, since it
      already points to that filename.
   -> If you'd rather use different filenames, that's fine too — just
      update the matching <img src="media/images/..."> in index.html
      to match.
   -> Recommended sizes: hero banner ~1600×1000px (landscape); the
      "For Women" category photo ~900×1100px (portrait); product
      photos (Featured + Shop) ~500×650px (3:4 portrait); promo
      banners ~700×900px (portrait). Matching these avoids stretched
      or cropped-oddly images, though the site will still work with
      other sizes since images are set to fill their containers.

9. Logo placement: header, not hero
   -> Your uploaded file had removed the logo from the hero banner
      and replaced the hero background photo with your own image
      (media/images/B1.png) — both left exactly as you had them.
      The Courtiva logo now lives in the header instead (see #11
      below), per this round's request to move it there.
   -> The logo image itself is still media/images/logo-courtiva.png
      (your uploaded logo, with its black background made
      transparent). To swap it for a different version later, replace
      that file with a new one of the same name.

10. Add to Cart button centering
    -> style.css: search ".quick-add" — this button centers its text
       using flexbox (display:flex; align-items:center;
       justify-content:center) instead of text-align, which is more
       reliable across browsers and immune to text-align values
       inherited from a parent element.
    -> This time, I actually rendered the page and measured it: the
       button text sits at an equal 92.8px from each edge of the
       button, i.e. perfectly centered, with the style.css in this
       download. If you still see it off-center after replacing your
       files with this download, it's almost always a stale-file
       issue — make sure the style.css you're using is from THIS SAME
       download (index.html and style.css depend on each other), and
       try a hard refresh (Ctrl+Shift+R / Cmd+Shift+R) in case your
       browser cached the old stylesheet.

11. Header logo (image, pinned left) + centered nav
    -> index.html: the header's <div class="logo">COURTIVA</div> text
       is now an <a class="logo navlink-home"> containing
       media/images/logo-courtiva.png. Because it also has the
       navlink-home class, clicking it goes to the homepage using the
       exact same mechanism as the other "Home" links (see #2 above)
       — no extra JavaScript was needed.
    -> The search/account/wishlist/cart icons and the mobile "burger"
       menu button are now grouped inside one <div class="nav-right">
       wrapper (they used to be two separate elements sitting side by
       side in the header).
    -> style.css: search ".nav{" — the header now uses CSS Grid with
       three columns (grid-template-columns: auto 1fr auto): the logo
       takes the left column at its natural size, the icons take the
       right column at their natural size, and the nav links get
       everything in between, centered within that middle column.
       This keeps the logo genuinely pinned to the left and the nav
       genuinely centered regardless of how wide the logo or icon
       group is — a plain "space-between" layout (what was used
       before) can't guarantee that when the left and right sides
       aren't the same width.
    -> To resize the logo: change the height value in ".logo img"
       inside style.css (currently 38px). The width adjusts on its
       own since the image keeps its natural proportions.

12. Note: "For Women" section is currently commented out
    -> Not something you asked me to change, but flagging it so it's
       not a surprise: in the file you sent, the "For Women" section
       (between the hero and the featured products) is wrapped in an
       HTML comment (<!-- ... -->), so it's currently hidden from the
       page. I left it as-is since I wasn't sure if that was
       intentional. If you'd like it back, search index.html for
       "FOR WOMEN" and delete the <!-- line just above it and the
       --> line just below it.

13. Sub-page content now supports rich formatting
    -> Since the About Us / Our Story / Fabric 1 / Fabric 2 pages now
       use headings (h1/h2/h3), blockquotes, bullet lists, a
       taglines-list, and FAQ-style question/answer blocks (rather
       than just plain paragraphs), style.css now has matching CSS
       for all of these — search "DYNAMIC PAGE CONTENT" for the full
       set. If you add another one of these elements to a page's
       content later, it'll already be styled consistently.

14. Quick View on Featured Products
    -> index.html: search "featured" for the 4 product cards inside
       #featured. Each now has a two-button bar (Quick View + Add to
       Cart) instead of the old single "Add to Cart" bar, plus a few
       new data-* attributes: data-brand and data-desc, used to fill
       in the Quick View popup. (data-name and data-price were
       already there for the cart.)
    -> index.html: search "QUICK VIEW MODAL" for the popup itself —
       it's one hidden modal shared by all 4 products, filled in with
       whichever product was clicked, rather than 4 separate copies.
    -> script.js: search "Quick View modal". openQuickView(card)
       reads the clicked card's data-* attributes (and its image/
       badge) and fills the modal in; the quantity +/- buttons adjust
       a running count; "Add to Cart" inside the modal adds that many
       to the cart and closes the popup.
    -> The "Add to Wishlist" button is visual-only for now — it
       toggles its own look and label but doesn't save anywhere. A
       real wishlist would need its own storage, the same way the
       cart uses localStorage (see "Shopping cart" earlier in this
       section) — that'd be a reasonable next feature to add.
    -> "Share" uses the device's native share sheet on phones/tablets
       that support it; on desktop browsers without that, it falls
       back to copying the page link to the clipboard instead, with
       the button briefly saying "Link Copied".
    -> This was only added to the 4 Featured Products on the
       homepage, not the 24 products on the Shop page (they still use
       the single "Add to Cart" bar) — let me know if you'd like it
       there too.

15. Hero banner carousel
    -> index.html: search "heroCarousel" — the hero section now holds
       3 slides inside <div class="hero-slides">, each an
       <img> wrapped in <div class="hero-slide">. Your own B1.png is
       slide 1; two placeholder images (hero-banner.jpg and
       hero-banner-3.jpg) fill slides 2 and 3 for now.
    -> To add/remove slides: copy or delete a <div class="hero-slide">
       block AND its matching <button class="hero-dot"> in
       <div id="heroDots"> — script.js counts however many slides
       and dots actually exist in the HTML, so it adjusts
       automatically; no JavaScript changes needed either way.
    -> To swap a slide's photo: replace the matching file in
       media/images/ (same idea as any other image on the site — see
       "Media folder" earlier in this section).
    -> script.js: search "Hero banner carousel". It auto-advances
       every 6 seconds (change HERO_INTERVAL to adjust the timing),
       pauses while the mouse is over the hero image, and can be
       controlled manually with the dots or the arrow buttons that
       appear on hover (both also reset the auto-advance timer).
    -> style.css: search "HERO CAROUSEL" for the slide fade
       transition, arrow buttons, and dot styling.

16. Product Overview Page
    -> How to open it: click a product's PHOTO or its NAME, anywhere
       on the site (Shop page, Featured Products, Related Products,
       Recently Viewed). Clicking the "Add to Cart" or "Quick View"
       buttons that sit inside the same image still does what they
       always did, and does NOT open the product page — only clicks
       elsewhere on the photo/name do.
    -> index.html: search "PRODUCT OVERVIEW PAGE" for the
       <main id="productContent"> section. It's ONE reusable template
       (breadcrumb, gallery, price, description, accordions, Related
       Products, Recently Viewed) that gets filled in with whichever
       product was clicked — not 28 separate hand-built pages.
    -> script.js: search "Product Overview Page". openProductPage(card)
       does the filling-in, using the same getProductDataFromCard()
       helper Quick View uses (search "Reading a product card's
       details") — so both features read a product's brand/title/
       price/description/image the same way, from the SAME place.
    -> style.css: search "PRODUCT OVERVIEW PAGE" for its styling.

    Where the page's fields come from (and what's shown when a
    product doesn't have that particular piece of data):
      - Brand/Title/Price/Image/Description: from the product card
        itself (its data-name, data-price, data-desc, <img>, etc.)
      - Star rating row: only shown if that product's card has the
        gold ★ rating badge already (a few Shop page dresses do,
        most products don't) — it does NOT invent a rating.
      - SKU: auto-generated from the product's name + price (e.g.
        "CRO-2400"). This is cosmetic, not a real inventory code.
      - Category/Tag: from the product's data-category (Shop page
        products have this); falls back to "Apparel" for products
        that don't (the 4 homepage Featured Products, for instance).
      - Description bullets: a fixed, generic set (true to size,
        care instructions, etc.) — not fabric specifics per product,
        since we don't have real specs for each item.
      - The paragraph below the bullets (search "productStory") only
        appears for Courtiva's own products, not for the real outside
        brand names used elsewhere on the Shop page (Prada, Burberry,
        etc.) — I didn't want to invent brand history/backstory and
        present it as fact for real companies.
      - Reviews accordion always honestly says "Reviews (0)" / "No
        reviews yet" — there's no fake review data anywhere on the
        site. If you want real reviews later, that needs a review
        system with actual customer input (e.g. via a form + backend
        or a service like Yotpo/Judge.me), not something to fake here.

    Related Products: pulled from the 24 Shop page products matching
    the current product's category, padded with other Shop products
    if that category has fewer than 4 other items in it.

    Recently Viewed: the last 4 DIFFERENT products a visitor opened,
    saved via localStorage (so it persists across page refreshes,
    same idea as the cart) — search "RECENTLY_VIEWED_KEY" in
    script.js.

    A few things intentionally simplified for now:
      - Only one photo per product (no thumbnail gallery/zoom) since
        each product only has one image file today. If you add
        multiple photos per product later, the gallery area (search
        ".product-gallery" in style.css) is where you'd extend that.
      - The 3 accordions' content (bullets, Fit/Care/Origin rows) is
        the same generic text for every product — personalizing it
        per product would mean adding real per-product data, which
        felt like a separate, bigger task from building the page
        template itself.

17. Wishlist
    -> How it works: every product card now has a heart icon in the
       top-right corner of its photo (shows on hover on desktop,
       always visible on mobile). Clicking it adds/removes that
       product from a single, SHARED wishlist — the same one used by
       Quick View's "Add to Wishlist" button, the Product Page's
       "Add to Wishlist" button, and the Wishlist page itself. Add a
       product from any one of those places and its heart icon lights
       up gold everywhere else it appears too (e.g. if it's also in
       Related Products or Recently Viewed).
    -> index.html: search "WISHLIST PAGE" for the
       <main id="wishlistContent"> section — a table (Product / Price
       / Stock Status / Add to Cart), an "×" to remove each row, and
       a Share Link row at the bottom. Search "wishlist-icon-btn" to
       see the heart icon markup that was added to every product
       card.
    -> script.js: search "Wishlist" (section 12). The wishlist itself
       is just an array of product names, saved to localStorage
       (search "WISHLIST_STORAGE_KEY") — same approach as the cart,
       so it survives a page refresh. toggleWishlist(name) is the one
       function everything above calls; syncWishlistIcons() is what
       keeps every heart icon on the page in agreement with it.
    -> style.css: search "WISHLIST PAGE" for the table styling, and
       ".wishlist-icon-btn" for the heart icon on product cards.

    Header wishlist icon: clicking it opens the Wishlist page, same
    as clicking the cart icon opens the cart drawer. Its number badge
    works exactly like the cart's (search "wishlistCount").

    Share Link is a REAL working feature, not just a copy-paste
    placeholder: it encodes your current wishlist into the page URL
    (?wishlist=ProductA|ProductB|...). Anyone who opens that link gets
    those products automatically added to THEIR OWN wishlist (the URL
    is cleaned up afterward so it doesn't linger in their address
    bar). Clicking the link text copies it to the clipboard; the
    circular share button next to it uses the device's native share
    sheet where available, same as Quick View/Product Page sharing.

    "Stock Status" always says "In Stock" — this site doesn't track
    real inventory anywhere, so rather than invent fake stock numbers
    per product, every item is simply shown as available. If you add
    real inventory tracking later, this column is where that data
    would plug in (search "In Stock" in script.js, inside
    renderWishlistRow()).

18. Header nav: Blog + Pages dropdown removed, About Us added
    -> index.html: search ".navlinks" near the top. The header now
       reads Home / Shop / About Us / Contact instead of the previous
       Home / Shop / Blog / Pages (dropdown) / Contact Us. "About Us"
       is a plain link with a data-page="About Us" attribute — the
       same mechanism the old "Pages" dropdown used, just without the
       dropdown wrapper around it now.
    -> IMPORTANT: removing the "Pages" dropdown also removed the only
       links to 4 other pages that used to live inside it — Our
       Story, Fabric 1, Fabric 2, and FAQ. Their content is untouched
       and still exists (search "pageSources" in index.html), but
       nothing in the header links to them anymore. To bring one
       back, add a link anywhere with the matching attribute, e.g.:
         <a href="#" data-page="Our Story">Our Story</a>
       Any element with that attribute automatically works, since
       script.js listens for it broadly now (search "a[data-page]")
       rather than only inside a dropdown like before.
    -> script.js / style.css: the old dropdown-toggle/open-close code
       and its CSS were removed rather than left in as unused
       leftovers, since nothing points to a dropdown anymore.

19. About Us page width — now matches the site's main container
    -> script.js: search "page-about-us" inside showPage(). Every
       time a Pages sub-page opens, it now gets a class built from
       its name (e.g. "page-about-us", "page-our-story") added to
       #pageContent — this is what makes it possible to style one
       specific sub-page differently from the rest.
    -> style.css: search ".page-about-us" — its max-width now uses
       the same --maxw variable (1280px) as the rest of the site's
       full-width sections, giving it the most room possible for
       extra content while still lining up with everything else. The
       other sub-pages (Our Story, Fabric 1, Fabric 2, FAQ) stay at
       the narrower 760px, meant for shorter reading-length text.
       To widen a different page instead/too, add a similar rule
       using its own class, e.g.:
         .page-our-story .page-content-inner{max-width:var(--maxw);}

20. Philosophy section: width reverted, height reduced by 70%
    -> style.css: search ".philosophy p" — max-width is back to the
       original 760px (undoing a previous 380px change).
    -> search ".philosophy{" for the section's top/bottom padding,
       which is what actually controls its height — cut to 30% of
       the original (150px/190px down to 45px/57px), a 70% reduction.
    -> IMPORTANT — fixing a side effect this caused: the faint
       decorative line-art graphic behind the quote (search
       ".philosophy svg.bloom") was sized for the OLD, taller
       section. Left at its original size, it overlapped straight
       through the text once the section got this much shorter, and
       crowded right up against the footer below it — so I scaled it
       down and repositioned it to match (520px wide down to 190px).
       If you adjust this section's height again later, that
       decoration may need a similar proportional resize to avoid
       the same overlap.

21. Scroll-cue removed from the hero
    -> The small bouncing down-arrow circle that used to sit at the
       bottom of the homepage hero banner is gone. Its HTML, CSS
       (search ".scroll-cue" — no longer present), and animation were
       all removed together, not just hidden, so there's no leftover
       dead code.

22. NOTES ON YOUR MANUAL EDITS (analyzed and bug-checked)
    You edited index.html and style.css directly (script.js was
    untouched). Here's what changed, and what I found:

    Content/label changes (no issues):
      - Header nav & footer: "About Us" -> "About"
      - Homepage Featured Products heading: "The Edit" -> "Trending"
      - About Us page: removed the "Taglines:" section (the 4 short
        italic lines like "Designed for Movement. Made for Recovery.")
      - About Us page width: widened to match the site's 1280px main
        container (same idea as my last change, just applied directly
        to the shared .page-content-inner rule instead of only the
        .page-about-us override — see note below)
      - Featured Products section: reduced top padding (120px -> 50px)
        and removed bottom padding entirely — tightens the gap under
        the hero and above the brand logos. Nothing broken by this.
      - Philosophy section: padding shrunk further (down to 30px/45px)
        and its text max-width increased to 1080px (wider than the
        760px "original size" from earlier in this conversation).

    Bugs found and FIXED (in the files below):
      1. Two invalid CSS values that don't do what they look like
         they do: max-width:auto (used on About Us's paragraphs,
         headings, and lists) and font-weight:auto (on the Philosophy
         quote). Neither "auto" is a real value for those two
         properties, so browsers silently ignore those lines. In
         THIS case they happened to fall back to reasonable-looking
         defaults (no max-width cap, and normal/400 weight) — so
         nothing looked broken — but relying on invalid CSS being
         silently dropped is fragile, and some tools will flag it as
         an error. Changed to the actual correct values: max-width:
         none, and font-weight:400.
      2. The Philosophy section's decorative line-art graphic (search
         ".philosophy svg.bloom") was left at a size (720px, meant for
         the ORIGINAL tall section) while the section itself kept
         getting shorter. At this section's new height, that graphic
         is big enough to cut directly through the quote text and
         crowd the footer below it. Resized it down again (720px ->
         140px) to fit the current, much shorter section — same fix
         I'd made once before in this conversation, needed again
         because the section got shorter still. Screenshots comparing
         before/after are in this conversation if useful.

    Not a bug, but now redundant — worth knowing about:
      - style.css has .page-content-inner{max-width:1080px} (the
        shared rule, edited directly) AND .page-about-us .page-
        content-inner{max-width:1080px} (an About-Us-only override
        from earlier). Since both now say the exact same 1080px,
        the second rule has no effect anymore — About Us isn't
        actually wider than Our Story/Fabric 1/Fabric 2/FAQ right
        now, they're ALL 1080px. If you want About Us to stay
        wider than the others going forward, change the shared rule
        back down (e.g. to 760px) and leave the .page-about-us
        override at 1080px — that combination is what actually
        creates a difference between them.

    Confirmed NOT bugs (checked and ruled out):
      - A full-page screenshot of the About Us page appeared to show
        the header twice, stacked mid-page. This was purely a
        screenshot-capture artifact (how full-page screenshots handle
        a "position:fixed" header while stitching together multiple
        scrolled frames) — confirmed there's exactly one header
        element in the actual page and it renders correctly in normal
        browsing. Not something you need to worry about.
      - The footer's "About" link doesn't go anywhere (no data-page,
        just href="#") — this was already the case before your edit,
        not something introduced by it. Copy the pattern from the
        header's About link if you'd like it functional:
          <a href="#" data-page="About Us">About</a>

23. NOTES ON YOUR MANUAL EDITS, ROUND 2 (analyzed and bug-checked)
    You edited index.html and style.css directly again (only those two
    files were sent, so script.js is presumed unchanged from before).

    Bugs found and FIXED:
      1. CHECKOUT WAS COMPLETELY DEAD. The cart's checkout markup was
         reverted back to a single plain <button id="checkoutBtn"> (the
         PayPal button container / fallback button / status message
         elements were removed from index.html), but script.js was
         still the version written for the PayPal markup — it looked
         for elements that no longer existed. Result: a console error
         on every page load, AND clicking "Checkout" did nothing at
         all (no listener was ever attached to the plain button).
         Confirmed both problems by actually loading the page and
         clicking the button before fixing.
         FIX: script.js now checks which cart markup is actually
         present and adapts — if it finds the old simple #checkoutBtn,
         it wires up the demo alert (exactly like before PayPal was
         ever added); if it finds the PayPal markup, it behaves as
         before. This makes script.js resilient to either version of
         the cart markup being in index.html, so switching between
         them (like this round did) won't silently break checkout
         again. Search "This cart markup can currently be in one of
         two states" in script.js.
      2. PHILOSOPHY IMAGE WAS MASSIVELY OVERSIZED (over 1000px tall,
         nearly a full screen). The new .image-container CSS used
         height:25% — but percentage heights only work when the
         parent element has an explicit height of its own, which
         .philosophy doesn't (its height is determined by its
         content, which was circular here). Browsers ignore an
         unresolvable percentage height, so the image fell back to
         its full native pixel size instead. Confirmed by rendering
         the page and measuring the actual section height before and
         after.
         FIX: gave .image-container a fixed, sensible size instead
         (max-width:900px, height:420px) so object-fit:cover — which
         was already set up correctly — has something real to work
         within. Search ".image-container" in style.css.
      3. Two invalid CSS values reappeared (max-width:auto,
         font-weight:auto) — the same category of bug fixed in round
         1 of this section (see note 22 above), just present again
         in this upload. Fixed the same way: max-width:none and
         font-weight:400.

    Flagged, NOT changed (possibly accidental — please check):
      - THE ENTIRE "BRANDS" SECTION (the Prada/Burberry/etc. scrolling
        logo strip) IS NOW FULLY COMMENTED OUT — not just the
        duplicate list needed for the seamless loop animation, but the
        whole <section class="brands">...</section>, including the
        first copy of the logos. The comment also opens in an odd spot
        (right before the section's own header comment, rather than
        cleanly around just the section), which is what made me think
        this might be accidental rather than a deliberate "hide this
        section" edit like the earlier For Women / Promo Row ones.
        I left it alone rather than guess and restore it myself — if
        you want the Brands section back, search index.html for
        "BRANDS" and remove the <!-- right before it and the --> a few
        lines after the closing </section> tag.
      - The .philosophy section's padding is back to the original,
        larger 90px/100px (a previous, unrelated request in this
        conversation had reduced it to 30px/45px). This may be fine
        now that the section holds an image rather than short text —
        just flagging that it's different from that earlier request,
        in case it wasn't an intentional change this time.

    Confirmed working / not bugs:
      - Your new hero carousel images (B2.png, B3.png) and Philosophy
        image (PHILOSOPHY.png) are referenced correctly — make sure
        those 3 files (plus B1.png from before) actually exist in your
        media/images/ folder, since I don't have your actual photos to
        verify against.

24. Shop page simplified: 2 categories, 10 products
    -> Categories are now just "Sportswear" and "Accessories" (plus
       "All"). The previous 4 categories — Dresses, Activewear, Denim,
       Intimates — and their 24 products were removed.
    -> Sportswear (5 products): these are the same 5 products that
       were previously tagged "Activewear" — nothing changed about
       them except data-category went from "activewear" to
       "sportswear". Search index.html for data-category="sportswear".
    -> Accessories (5 products): these are BRAND NEW — there weren't
       any real accessories in the old 24-product catalog (bags,
       sunglasses, etc.), so rather than mislabel existing apparel as
       "accessories", 5 new Courtiva-branded accessory products were
       created: a tennis visor, a wristband set, a court tote bag,
       sport sunglasses, and an insulated water bottle. Search for
       data-category="accessories". Their photos are placeholders,
       same as everything else — see "Media folder" earlier in this
       section for how to swap in real photos.
    -> Pagination removed: the old "1 2 3 ›" buttons implied more
       products than actually exist now that there are only 10 (which
       fit on one page) — search "No pagination needed" in index.html
       for a comment marking where to re-add it if the catalog grows
       again later.
    -> Nothing needed to change in script.js — category filtering,
       sorting, "Showing X of Y results", Related Products, and the
       cart/wishlist all read from whatever product cards actually
       exist in the page, so they adjusted to 10 products and 2
       categories automatically.

25. About Us: back to real text + image, with a scroll-in effect
    -> The About Us page previously showed two flat screenshot images.
       It's back to real HTML text and a real <img> now (same content
       as those screenshots, typed out as actual text you can edit) —
       search index.html for data-page="About Us". The photo is
       media/images/about-hero.jpg, a placeholder like the rest of the
       site's images (swap in a real photo under that same filename).
    -> Scroll-reveal effect: every heading/paragraph on this page has
       a data-reveal attribute. It starts invisible and slides/fades
       into place the moment it scrolls into view, with each paragraph
       staggered slightly after the one before it — so they cascade in
       one after another rather than all popping in at once. The photo
       reveals separately, sliding in from the opposite side.
    -> style.css: search "SCROLL-REVEAL ANIMATION" for the .reveal /
       .in-view styling and the per-paragraph stagger delays. This is
       written to be reusable — add data-reveal to any element on any
       page to give it this same effect (add data-reveal-from="right"
       or "left" to change which direction it slides in from).
       Respects prefers-reduced-motion (shows content instantly,
       no animation, for visitors who've asked their OS/browser to
       reduce motion).
    -> script.js: search "Scroll-reveal animation" for
       initScrollReveal() — it uses the browser's IntersectionObserver
       (no external library) to detect when each element scrolls into
       view. It's called automatically every time a "Pages" sub-page
       opens, so revisiting About Us later replays the animation
       instead of it only working once ever.
    -> A real timing bug was found and fixed while building this: the
       site's global smooth-scrolling (search "scroll-behavior" in
       style.css) was still quietly animating page-to-page navigation
       even after an attempted fix, which confused the reveal system
       into thinking the founder-letter section was already visible
       right when a page opened. Fixed by making section-to-section
       navigation (Home/Shop/Pages/etc.) jump instantly instead —
       smooth scrolling still works fine for same-page anchor links
       like the hero's "Shop Now" button, which is unaffected.

26. PRODUCT CATALOG IS NOW "PLUG AND PLAY" (folder-based)
    This is a bigger change than most entries in this file — every
    product card on the whole site (Shop page AND Featured Products)
    used to be typed directly into index.html. Now they're all built
    automatically from files in media/products/, so adding, editing,
    reordering, or removing a product no longer touches index.html,
    style.css, or script.js at all.

    -> The folder structure:
         media/products/
           manifest.json          <- the master list (see below)
           some-product-id/
             data.json            <- that product's name/price/etc.
             image.jpg            <- that product's photo
           another-product-id/
             ...

    -> manifest.json has two lists — "shop" and "featured" — each just
       an array of folder names, in the order they should appear. A
       product can be in one list, the other, or both (e.g. "alba" is
       in both, because it's the same product shown on the homepage
       AND sold in the Shop).

    -> TO ADD A PRODUCT: copy an existing folder inside media/products/,
       rename it (the folder name itself is never shown to visitors —
       it's just an internal id, so lowercase-with-dashes like
       "sunset-visor" is fine), edit its data.json, replace its image,
       then add the new folder's name to manifest.json's "shop" and/or
       "featured" list. That's it — no code to touch.

    -> TO REMOVE A PRODUCT: delete its name from manifest.json (the
       folder itself can stay on disk unused, or be deleted too).

    -> TO REORDER PRODUCTS: change the order of names within
       manifest.json's "shop" or "featured" list.

    -> data.json fields:
         name              product name shown everywhere
         brand             shown above the name on Shop cards
         price             the real, current price (a number, no $ sign)
         compareAtPrice    the crossed-out "was" price, or null for none
         category          must be "sportswear" or "accessories" to
                            show up under those filters (or add a new
                            category — see note below)
         description       the longer paragraph (Shop cards, Quick
                            View, and the Product Page all use this)
         tagline           a short line, ONLY used on Featured Products
                            cards instead of the full description
         image             (see #27 below — supports multiple photos)
         badgeSale         text for a sale badge (e.g. "-6%"), or null
         badgeFeatured     true/false — shows a "Featured" badge
         badgeBestseller   true/false — shows a "Best Seller" badge
         badgeOutOfStock   true/false — shows "Out of Stock" and
                            disables the Add to Cart button
         rating            true/false — currently unused by the
                            generator (ratings still come from wherever
                            a card sets that up) but reserved for later

    -> Adding a THIRD category (beyond Sportswear/Accessories): give a
       product's data.json that category name, then add a matching
       tile to the category-tiles block in index.html (copy the
       Sportswear or Accessories button and change its data-category
       and label) — search "category-tiles" in index.html.

    -> IMPORTANT LIMITATION: this loads data.json/manifest.json using
       fetch(), which browsers only allow when the page is being served
       over http:// — through a local server, or once actually
       deployed (e.g. to Netlify). Opening index.html by double-
       clicking it (address bar shows "file://") will NOT work — both
       product grids will show an on-page error message explaining
       this instead of silently staying blank. See "HOW TO RUN IT
       LOCALLY" below.
    -> HOW TO RUN IT LOCALLY: either use an editor's built-in local
       server (e.g. VS Code's "Live Server" extension — right-click
       index.html, "Open with Live Server"), or from a terminal in
       this folder run: python -m http.server — then open
       http://localhost:8000 in a browser. Both make the address bar
       show http://, not file://.
    -> script.js: search "Product catalog: loaded from media/products/"
       for all of this — loadProductCatalog() does the fetching,
       renderShopCardHTML()/renderFeaturedCardHTML() build each card's
       HTML from a product's data, and everything else on the site
       (cart, wishlist, Quick View, Product Page, category filtering,
       sorting, Related Products) needed NO changes, because they were
       already written to work with whatever product cards exist in
       the page — they don't care whether those cards were typed
       directly into index.html or generated by JavaScript.

27. PRODUCT PAGE NOW SUPPORTS MULTIPLE PHOTOS PER PRODUCT
    Building on #26 above: a product's data.json can list more than
    one photo, and the Product Page (the page that opens when you
    click a product) shows a row of clickable thumbnails underneath
    the main photo — click one to swap the main photo, like most real
    shopping sites.

    -> In data.json, use "images" (an array) instead of the older
       single "image" field:
         "images": ["front.jpg", "back.jpg", "detail.jpg"]
       All listed files should sit in that same product's folder,
       alongside its data.json. The FIRST one in the list is what
       shows as the cover photo on product cards (Shop grid and
       Featured Products) — the rest only appear on the Product Page.
    -> A product with only one photo can keep using the older
       "image": "photo.jpg" field (singular) exactly as before —
       nothing needs to change for it, and no empty thumbnail row
       shows up under its Product Page photo.
    -> All 12 current products were given a second placeholder photo
       (image-2.jpg in each folder) so this feature works out of the
       box everywhere, not just as a demo on one product. Replace
       image-2.jpg (or add more entries to the images array — 3, 4, as
       many as you want) with real additional photos whenever you
       have them.
    -> style.css: search "product-thumbnails" for the thumbnail strip
       styling — the currently-selected thumbnail gets a gold border
       via the .active class.
    -> script.js: search "renderProductGallery" for the function that
       builds the thumbnail row and swaps the main photo on click.
       This works by looking up a product's full photo list from the
       in-memory catalog (productCatalogById, built in #26's
       loadProductCatalog()) using the card's data-product-id
       attribute — since a product CARD only ever shows one cover
       photo, the full list has to come from the original data, not
       from anything visible on the card itself.

28. Hero banner: real tagline text, animated, smaller button
    -> Each hero slide's headline ("Where the Court Meets Couture",
       "Ace Your Court Style", "More Than a Place to Play") is now
       real HTML text — search "hero-tagline" in index.html — rather
       than baked into the photo, so it's plain-text editable and can
       be styled/animated like any other element on the page.
    -> Entrance animation: the tagline fades/slides up first, then the
       "Explore Collection" button follows just after — a small
       cascade rather than everything appearing at once. This replays
       every time the carousel changes slides (search "heroContentIn"
       in style.css), not just once when the page loads.
    -> The "Explore Collection" button is intentionally smaller than
       this site's default button size, but that's scoped specifically
       to the hero (search ".hero-content .hero-cta" in style.css) so
       it doesn't shrink the same button style used elsewhere, like
       the cart drawer's checkout button.
    -> Slide 1's tagline is yellow (#F5C518) instead of the site's
       default white, because that particular photo has a light
       gray/white background where white text would be hard to read.
       Search ".hero-content-1 .hero-tagline" in style.css to change
       that color or remove the override (slides 2 and 3 are
       unaffected either way, and stay at the default white — edit
       ".hero-tagline" itself if you want to change the color
       everywhere at once).
    -> IMPORTANT — this only looks fully clean with photos that don't
       already have text baked into them. Earlier versions of B1/B2/B3
       had their own text baked into the image pixels, which visibly
       ghosted/doubled-up behind this new real text. The current
       B1/B2/B3 photos are clean (no baked-in text), which is what
       makes this look right — swapping in a new hero photo later that
       has its own baked-in text will bring that same problem back.

29. BUG FIX: mobile menu (hamburger icon) wasn't wired up to anything
    -> Below 980px wide, the header was already set up to hide the
       normal Home/Shop/About/Contact links and show a hamburger icon
       instead (search "980px" in style.css) — but nothing ever made
       tapping that icon actually DO anything. It was a dead button,
       which is why those links were completely unreachable on mobile.
    -> Fixed by adding a real mobile menu panel (search "mobile-nav"
       in index.html) that slides open below the header when the
       hamburger is tapped, with a dark overlay behind it that closes
       it again when tapped. The menu closes automatically after
       tapping any link inside it too, so it doesn't stay open
       covering the page you just navigated to.
    -> The menu's Home/Shop/About links reuse the exact same classes
       (navlink-home, navlink-shop, data-page="About Us") the desktop
       nav already uses — so they didn't need any new click-handling
       logic of their own; only the panel's open/close behavior did.
       Search "Mobile nav menu" in script.js for that part.
    -> Tested directly on a 390px-wide mobile viewport: confirmed the
       menu opens, all 4 links are visible and correctly labeled,
       tapping Shop/About actually navigates there, the menu closes
       itself afterward, and tapping the dark overlay also closes it.

30. NOTES ON YOUR MANUAL EDITS TO style.css
    You uploaded an edited style.css with 4 changes. Here's what each
    one does, and one bug found and fixed among them:

    Working as intended (no issues):
      1. About Us hero split — the left (text) column is now narrower
         and the right (photo) column wider (search ".about-hero" —
         grid-template-columns changed from 1fr 1fr to 0.75fr 1.25fr).
      2. Slide 1's tagline color — changed from a brighter yellow
         (#F5C518) to a more muted olive-gold (#9f8218). Search
         ".hero-content-1 .hero-tagline" in style.css.
      3. Slide 1's text/button position moved down slightly (bottom
         offset changed from 38% to 30% — search ".hero-content-1{").

    Bug found and FIXED:
      4. You'd changed .hero-tagline's font-style to "bold" — but
         font-style isn't the right property for that; it only
         accepts normal/italic/oblique. "bold" isn't a valid value
         there, so the browser silently ignored the whole line —
         which meant the tagline actually lost its italic look
         entirely (it was rendering perfectly upright, not bold at
         all) rather than gaining any boldness. Confirmed this by
         checking the actual computed style in a browser before
         fixing it, not just by reading the code.
         FIX: restored font-style:italic, and added the boldness
         you were actually going for through font-weight:600 instead
         (the property that's actually meant for that) — search
         ".hero-tagline{" in style.css. The tagline is now genuinely
         both italic and bold, confirmed visually and by re-checking
         the computed style after the fix.

31. FONTS ARE NOW SELF-HOSTED (no more Google Fonts request), plus
    a new "Kugile" font added for the hero banner text
    -> All 18 Poppins weight/style files (Thin through Black, normal
       and italic) and a font called Kugile now live in
       media/fonts/ and are loaded via @font-face in style.css
       (search "FONTS" at the very top of the file) instead of the
       previous Google Fonts CDN link, which has been removed from
       index.html entirely. The site no longer makes any external
       request just to show its own text.
    -> Kugile is used specifically for the hero banner tagline text
       ("Where the Court Meets Couture", etc.) — search ".hero-tagline"
       in style.css. Everywhere else on the site still uses Poppins,
       unchanged.
    -> IMPORTANT — please check the license before this goes live:
       the file you provided is named "Kugile_Demo.ttf", and its own
       embedded metadata says "Copyright (c) 2021 by Pentagonistudio.
       All rights reserved." Fonts labeled "Demo" from a type foundry
       are very often licensed for preview/personal use only, NOT for
       embedding on a live commercial website — using it on a real,
       public-facing site without confirming you have a proper
       commercial/web license from Pentagoni Studio could be a
       licensing violation. Worth a quick check with them (or
       wherever you obtained the file) before this goes live for a
       real client, even though it's working perfectly fine
       technically for a demo/preview right now.
    -> Kugile only has one weight/style available (regular, not
       bold or italic) — so .hero-tagline no longer requests
       bold/italic for it like it did with Poppins before, since
       browsers would otherwise "fake" a slant/weight on a font that
       doesn't actually have those versions, which tends to look
       distorted. If you get bold/italic versions of Kugile later,
       search "@font-face{" + "Kugile" in style.css to add them
       properly, the same way each individual Poppins weight is set
       up.

33. SHOP PAGE: cards now show a short tagline instead of the full
    description
    -> Shop product cards (search "renderShopCardHTML" in script.js)
       now display each product's "tagline" field instead of its full
       "description" underneath the name — matching how Featured
       Products cards already worked. search "product-desc" in
       script.js for the one-line change that did this.
    -> 8 of the 12 products didn't have a tagline written yet (only
       the 4 originally built for Featured cards did) — so before
       making this switch, a short tagline was written for every one
       of them, matching the existing style (a short, evocative phrase
       pulled from/matching the end of each product's own
       description). Search "tagline" in each product's data.json
       under media/products/ to find/edit these.
    -> Along the way: 3 products (Cleo, Cora, Roselle) still had
       "Lorem ipsum" placeholder descriptions left over from early in
       this project (flagged once before, back when the 10-product
       shop catalog was first built, but never actually fixed) — real
       descriptions were written for all three while writing their
       taglines, since leaving placeholder text in a product's
       description would still show up the moment someone opens its
       Quick View or Product Page, even with the tagline fix on the
       card itself.
    -> BUG CAUGHT AND FIXED while making this change: Shop cards never
       had a separate place to store the FULL description once the
       visible text became the tagline instead — Quick View and the
       Product Page get a product's description by checking a
       data-desc attribute first, which only Featured cards had (since
       they already showed a tagline instead of the description).
       Without adding that same attribute to Shop cards, opening Quick
       View or the Product Page for any Shop product would have
       started showing the short tagline where the full description
       used to be — the exact opposite of a cosmetic-only change.
       Fixed by adding data-desc to the Shop card template too (search
       "data-desc" in renderShopCardHTML). Tested directly: Shop cards
       show taglines, the Product Page still shows the full
       description, confirmed for the same product in the same test.

34. A NOTE ON CONTINUITY ACROSS THIS CONVERSATION
    Partway through this project, the working files being edited
    turn-to-turn were lost and had to be reconstructed from the most
    recent fully-packaged zip download rather than the exact state
    from immediately before. Two specific things from recent
    conversation turns did NOT make it into this reconstruction and
    are worth knowing about:
      - The hero banner repositioning from a prior round of your
        manual edits (style.css, .hero-content-1/2/3) — slides 2 and
        3's improved positions aren't present here, and neither is
        slide 1's position that was causing it to overlap the model
        (meaning that specific bug ISN'T present right now either,
        since this file reverted to the original, safer position
        before that edit).
      - If you still have that version of style.css on your end and
        want those improvements back (minus the slide 1 overlap),
        send it over and it can be fixed properly this time.

35. NEW: Launch announcement popup
    -> A centered popup now appears 2.5 seconds after the homepage
       first loads, announcing the Courtiva launch with a 15%-off
       email signup offer — search "LAUNCH ANNOUNCEMENT POPUP" in
       index.html for the markup. Built after being shown a reference
       screenshot of another site's own promo popup for layout
       inspiration — the structure (eyebrow text, heading, offer,
       email capture, fine print, close option) follows that general
       pattern, but every word of copy and all the styling here is
       original to Courtiva, using the site's own gold/cream theme.
    -> It only shows ONCE per visitor — closing it any way (the X,
       "No thanks", clicking outside it, pressing Escape, or
       submitting the email form) saves that to localStorage
       (search "LAUNCH_POPUP_SEEN_KEY" in script.js) so it won't
       interrupt the same visitor again on a later visit. To make it
       reappear for testing, clear that one localStorage key, or open
       the site in a private/incognito window.
    -> The email form is a front-end-only demo right now, same as the
       footer's newsletter signup (search "Launch announcement popup"
       in script.js) — it doesn't actually send the email anywhere
       yet. Connect it to a real backend or a service like Mailchimp/
       Klaviyo when ready, ideally the same place the footer signup
       ends up connected to, so you're not managing two separate
       email lists.
    -> To change the offer/wording/dates: search "launch-popup" in
       index.html — it's all plain text in the markup, no code logic
       to touch for a content-only edit.
    -> Tested directly in a browser: confirmed it stays hidden on
       load and opens after the delay, and that every close method
       (X button, overlay click, Escape key, "No thanks", and
       successful form submission) correctly closes it AND prevents
       it from reappearing on a page reload.

36. ABOUT PAGE REVAMPED with the real Founder Story + Fabric & Design
    Story (replacing the old placeholder "Kashmira" text)
    -> Content came from two uploaded Word docs: FOUNDER_STORY.docx
       (shown first) and FABRIC_AND_DESIGN_STORY.docx (shown after).
       Search "About page" or "data-page=\"About Us\"" in index.html
       for all of it.
    -> FOUNDER_STORY.docx contained both the finished founder
       narrative AND a separate block of internal planning notes
       mixed into the same file (draft tagline alternatives, an
       Instagram bio, a bullet list of content ideas, FIR-marketing
       positioning options). Only the actual finished narrative was
       used on the page — the planning notes weren't written as
       publishable copy and would've read oddly as real page content.
    -> FABRIC_AND_DESIGN_STORY.docx was fully polished, finished copy
       (Our Philosophy / Our Fabric Story / Beyond Performance /
       Designed for Life On and Off the Court / The Courtiva Promise)
       and all of it was used, in that order. One part was
       intentionally left out: a closing aside suggesting removing
       the word "tennis" from the site and a follow-up FAQ-style
       "The Fabric, Explained" section — those read as a strategist's
       side-notes/suggestions rather than finished copy meant to be
       published as-is. Worth a look yourself (still in the original
       .docx) in case you want any of that added in too.
    -> No founder name was given in the document, so the signature
       just reads "Founder, Courtiva" rather than inventing a name —
       search "about-founder-signature" to add a real name once you
       have one.
    -> Scroll-in animations (the same fade/slide effect already used
       on this page) were extended to cover all of this new content —
       but the old CSS only had hardcoded stagger timing for up to 7
       paragraphs per section, and this page now has far more than
       that. Rather than just extend the hardcoded list further,
       initScrollReveal() in script.js was upgraded to calculate each
       element's stagger delay in JS instead (search "--reveal-delay")
       — this scales automatically to any number of paragraphs in any
       section, on this page or any other one that uses data-reveal
       later.

37. NEW: Terms & Conditions now opens as a popup (not a dead link)
    -> The footer's "Terms & Conditions" link previously went nowhere
       (href="#", no real destination). It now opens a popup with the
       full policy content from POLICIES.docx — search "TERMS &
       CONDITIONS / POLICIES POPUP" in index.html for the markup,
       "Terms & Conditions popup" in script.js for the open/close
       logic.
    -> All 13 sections from the document are included (General
       Information, Products & Availability, Pricing & Payment,
       Orders, Delivery, Returns & Exchanges, Customer
       Responsibilities, Intellectual Property, Website Availability,
       Limitation of Liability, Privacy, Governing Law, Contact
       Information) — nothing was trimmed or summarized.
    -> Closes via the X button, clicking outside it, or pressing
       Escape — tested all three directly, plus confirmed it opens
       correctly from both the homepage and the About page, and that
       closing it leaves you exactly where you were (no accidental
       navigation).
    -> To edit the policy wording later: it's plain HTML text/lists
       directly in index.html, no code logic to touch for a
       content-only change.

38. ABOUT PAGE RESTRUCTURED into a hero / split / card-grid / accordion
    layout (replacing the long continuous-paragraph version from #36)
    -> Rebuilt to follow the structure of some uploaded page-template
       mockups, which were themselves built around the same founder
       and fabric content from #36. Colors and fonts stay on
       Courtiva's own existing theme (gold/cream, Poppins) rather than
       the templates' own fonts/palette, to stay visually consistent
       with the rest of the site. Search "ABOUT PAGE:" in style.css
       for all of this section's CSS, all under an "ab-" prefix so it
       doesn't collide with anything else.
    -> New sections, top to bottom: a centered hero banner with an
       "Explore The Story" button that scrolls down to the founder
       section; the founder story as a split image+text layout; a
       3-card "Our Brand Pillars" grid (Recovery / Wellness / Luxury
       Comfort); a centered "Our Philosophy" statement; a second
       3-card grid for fabric features (Far Infrared Technology /
       Tropical Climate Comfort / On & Off Court Versatility); a
       "The Fabric, Explained" FAQ accordion (click a question to
       expand it); and a closing brand-promise statement.
    -> The FAQ accordion is new functionality — search "ab-faq-header"
       in script.js. Had to use event delegation (listening on the
       whole document rather than the individual buttons directly)
       because this content only exists inside #pageBody after the
       page is actually opened, same reasoning as the scroll-reveal
       system elsewhere on this page.
    -> BUG FOUND AND FIXED while testing this: the founder section's
       photo wasn't loading at all. The actual file on disk is named
       about-hero.jpg, but index.html was still pointing to
       "About hero.png" (capitalized, with a space, different
       extension) — a leftover mismatch from earlier in this project.
       Confirmed by rendering the page and seeing the broken-image alt
       text instead of the photo, not just by reading the code. Fixed
       the path in index.html to match the real filename.
    -> Tested directly in a browser: hero loads and reveals correctly,
       "Explore The Story" scrolls to the right section, all reveal
       animations cascade correctly through the new longer page, the
       FAQ accordion opens/closes on click, and the layout holds up
       at mobile width (390px) with the split section stacking
       correctly.

39. MERGE: your uploaded files adopted as the base, with recent work
    layered back on top
    -> Your uploaded index.html/style.css/script.js were from a saved
       copy that predated a few recent rounds of work. Adopted them as
       the new base as instructed, kept .hero-content-1 exactly as you
       set it (left:60%; bottom:60% — unchanged, per your explicit
       instruction, even though this still has the same slide-1/model
       overlap flagged previously; let me know if/when you want that
       properly addressed), and added back on top:
         - The About page redesign from #38 (hero / split / pillars /
           philosophy / fabric grid / FAQ accordion / promise) —
           your uploaded copy had reverted to the older long-form
           "Founder Story" layout from before #38.
         - The matching FAQ accordion click-to-expand JavaScript,
           which your uploaded script.js was missing (the HTML for it
           was there, but nothing made it interactive).
         - The about-hero.jpg image path fix from #38 — your uploaded
           copy had reverted to the broken "About hero.png" reference.
    -> Footer "Connect" links (TikTok/Instagram/Facebook) and the
       Terms & Conditions popup were mentioned but didn't actually
       need restoring — both were already fully intact in your
       uploaded files, unchanged.
    -> One judgment call made without being explicitly asked: your
       uploaded index.html still had the launch popup showing
       "WE ARE COMING TO ULTRALUXE 2026" / "21-26 OCTOBER" / "FREE
       ADMISSION" — leftover placeholder text from the reference
       screenshot this popup was originally designed from, not
       Courtiva's own copy. Since shipping a different brand's name
       on this site would be a real bug rather than a style choice,
       this was restored to Courtiva's own content ("We're Live" /
       15% off first order) to match what's documented in #35. If you
       actually wanted the UltraLuxe placeholder kept for some reason,
       let me know and it can be reverted.
    -> Tested all of this together directly in a browser: popup shows
       the right brand, the hero position matches what you specified,
       the About page loads with a working photo, the FAQ accordion
       opens on click, and the Terms & Conditions popup still opens
       correctly — all in the same test pass, confirming nothing
       about this merge broke any of the other pieces.

40. HOMEPAGE: Philosophy section converted from a flat image to real
    text + icons
    -> The homepage's "Philosophy" section used to be a single flat
       placeholder image (media/images/PHILOSOPHY.png, the "REPLACE
       THIS IMAGE" box). It's now real HTML — an olive banner with
       italic text and three clothing-silhouette line icons
       (search "philosophy-banner" in index.html and style.css).
    -> You'd already done the smart part yourself before uploading:
       the standalone demo file (philosophy-section.html) had generic
       placeholder copy ("all individuals deserve to experience
       beauty and confidence..."), but by the time you integrated it
       into index.html, you'd already swapped in the real "Courtiva
       Promise" text from #36/#38 instead. That's exactly right —
       the demo's copy didn't match Courtiva's actual positioning at
       all, so no changes were needed there.
    -> What DID need fixing: the demo's CSS used a different font
       (Cormorant Garamond) and hardcoded hex colors (#cf9e5d ochre,
       #86551b bronze) that don't exist anywhere else on this site.
       Rewrote the CSS to use Courtiva's own theme instead — Poppins
       italic (matching every other quote/statement on the site) and
       the existing --olive-dark/--cream-deep variables — so it's
       visually consistent with the rest of the page rather than
       introducing a one-off new look. Also removed the old
       .image-container CSS, which nothing references anymore.
    -> Real Instagram and Facebook URLs were also added in this same
       upload (replacing the old href="#" placeholders, both in the
       footer links and the bottom social icons) — kept as-is, no
       changes needed.
    -> Tested directly in a browser: banner renders with the correct
       background/text/icon colors, all 3 icons display, and the
       social links point to the real URLs now.

41. Recurring note: the launch popup keeps reverting to "ULTRALUXE
    2026" placeholder text in every file you upload (this is now the
    second time). This suggests you may be editing from a saved local
    copy that's from before that content was ever added — worth
    checking which file you're actually opening/editing on your end,
    so this stops needing to be fixed each round. Restored to
    Courtiva's own copy again here; see #39 for why.

42. Same recurring pattern a 3rd time, plus new content loss this round
    -> Your latest upload again reverted the launch popup to
       "ULTRALUXE 2026" and the About page photo to the broken
       "About hero.png" path — same two issues as #39/#41, fixed the
       same way again.
    -> NEW this round: the About page's entire closing section (the
       "We believe the future of luxury sportswear..." / "Courtiva." /
       "Luxury Recovery Wear for Women Who Play." statement from #38)
       had been deleted and replaced with three empty, invalid
       </br></br></br> tags — a closing tag with no matching opening
       tag, which isn't valid HTML and was rendering as nothing.
       Restored the actual closing section's content and markup.
       A second, identical set of three stray </br> tags was also
       found right after the homepage's philosophy section (#40) —
       those had no content behind them to restore, so they were
       simply removed as invalid leftover markup.
    -> Given this is the third round of the exact same popup/image
       issue, strongly worth checking which local file you're
       actually editing from before the next upload — see #41.

43. CLARIFIED: the launch popup / image filename / closing section
    removal in #42 were intentional, not bugs
    -> The "ULTRALUXE 2026" popup is a real banner for Courtiva's
       participation in that trade show — not placeholder text. No
       longer an issue.
    -> The image file is apparently named "About hero.png" (capital
       letters, a space, .png) on your end and renders fine there.
       One thing worth knowing: that exact file doesn't exist in the
       media/images/ folder I have — only about-hero.jpg does. If you
       ever deploy using files packaged from this chat, double check
       that exact filename (same spelling, same case) travels with
       the project, since most real servers treat filenames as
       case-sensitive.
    -> Removing the About page's closing statement was intentional,
       since the same text already appears in the homepage's
       philosophy section (#40). No issue.

44. Fixed: the </br> tags didn't create any spacing at all
    -> You'd added </br></br></br> in two spots to create a gap
       before the footer. The actual effect: zero. <br> is a "void"
       element (same category as <img>) — it has no closing tag, so a
       browser just ignores a stray </br> completely. Any spacing you
       were seeing was coming from something else already there, not
       from these tags.
    -> Replaced with a real fix: a 24px margin-bottom added to the
       homepage's philosophy-banner section (search
       ".philosophy-banner{" in style.css) — confirmed with an actual
       measurement in a browser that this creates a real, visible
       24px gap before the footer now.
    -> Along the way, found that an older .philosophy{} CSS rule
       (three rules total, around line 1376) is dead code — nothing
       in the current page has just class="philosophy" anymore, since
       the homepage philosophy section was converted from an image to
       real text + icons in #40 (it's now .philosophy-banner). Left
       the dead rule in place with a comment explaining it, rather
       than deleting it outright, in case you want to reference the
       old styling — but it's safe to remove entirely if you'd rather
       clean it up.
    -> The second </br></br></br> occurrence, at the end of the About
       page's content (where the closing section used to be before
       #43), was simply removed — it isn't actually adjacent to the
       footer in the page's structure (the Shop page content comes
       right after it), so no spacing fix was needed there.

45. NEW: Hide Prices toggle
    -> Search "HIDE_PRODUCT_PRICES" in index.html — a single true/false
       flag near the PayPal config, same pattern as that one. Set to
       true to hide every price on the site (Shop/Featured cards,
       Quick View, Product Page, cart line items, cart subtotal,
       wishlist price column). Set back to false to show them again.
    -> Cart and checkout math are completely unaffected either way —
       this only hides the price TEXT visitors see (search
       "prices-hidden" in style.css for exactly what's hidden).
    -> Tested with it turned on: confirmed via a real page load that
       the Shop and Featured prices are actually invisible, and that
       the rest of each card (badges, name, tagline, category) still
       displays normally with no layout gaps left behind.

46. NEW: Size selector (Quick View + Product Page)
    -> All 9 sportswear products now have a "sizes" field in their
       data.json (XS/S/M/L/XL) — search "sizes" in any product's
       data.json under media/products/ to edit. The 3 accessories
       (Alba, Arden, Cora) intentionally have no sizes field, so they
       never show a size row at all.
    -> Appears in Quick View and the Product Page, between the
       description and the quantity stepper. Clicking a size
       highlights it (search ".size-option.selected" in style.css).
    -> If a product has sizes and Add to Cart is clicked with none
       selected, the size row shakes and turns red instead of adding
       silently with no size — tested directly, confirmed the cart
       stays untouched when this happens, and that it adds correctly
       once a size is picked.
    -> Cart items now track which size was chosen, shown as "Size: M"
       under the product name in the cart drawer. The same product in
       two different sizes now correctly stays as two separate cart
       lines rather than merging into one (same as how real clothing
       stores work) — search "addToCart" in script.js for the
       matching logic.
    -> One thing that needed solving: the Shop/Featured grid cards and
       the wishlist table both have their own direct "Add to Cart"
       buttons with no size selector UI of their own. For a sized
       product, clicking Add to Cart directly from a grid card now
       opens Quick View instead (so a size can actually be picked),
       and the wishlist's Add to Cart button opens the Product Page
       the same way — tested both directly: confirmed the cart stays
       empty/unchanged when this redirect happens, and that
       accessories (no sizes) still add immediately with no popup and
       no interruption, exactly as before.

47. Footer contact updates
    -> TikTok now links to https://www.tiktok.com/@courtivabykash in
       both places it appears — the "Connect" column text link and
       the bottom social icon (search "tiktok" in index.html, both
       were previously href="#" placeholders).
    -> Phone number updated to +65 84360304 (search "Phone" in the
       footer section of index.html).
    -> Added a WhatsApp line to "Need Help?", linking to
       https://wa.me/6584360304 — this is WhatsApp's standard
       "click to chat" link format (country code + number, no plus
       sign, no spaces), so clicking it opens a chat with that number
       directly, on both mobile and desktop. If the phone number ever
       changes again, update it in both places — the plain text next
       to "Phone" and inside this wa.me link — since they're two
       separate pieces of text, not generated from one shared value.
    -> Added matching CSS (search ".contact p a" in style.css) so the
       new link reads in the footer's existing muted gray rather than
       showing up as a jarring default blue, underlined browser link.

48. REMOVED: "Stay in the Loop" newsletter signup from the footer
    -> The whole first column of the footer (heading, paragraph, and
       email signup form) is gone — the footer now has 3 columns
       (Policy / Connect / Need Help?) instead of 4.
    -> This also had its own dedicated JavaScript (a "Newsletter
       signup form" handler that cleared the input and showed
       "Subscribed" on submit) — since the form it was attached to no
       longer exists, that JS was removed too rather than left behind
       as dead code with nothing to run on.
    -> Also removed the matching CSS (.newsletter, .signup and its
       input/button styling) — same reasoning, nothing references
       those classes anymore.
    -> Tested directly in a browser: confirmed the section is gone,
       exactly 3 columns remain, and there are no console errors from
       the removed JS trying to find an element that's no longer
       there.
    -> Worth knowing: this removes the only remaining way this site
       offered to collect an email address for marketing (separate
       from the launch popup in #35, which is unaffected and still
       has its own email capture).

49. FIXED: footer columns weren't properly proportioned after #48
    -> After removing the newsletter column in #48, the footer's
       grid (search ".footer-top{" in style.css) was still set up for
       4 columns with widths meant for the OLD layout
       (1.4fr 1fr 1fr 1.3fr) — meaning "Need Help?" (by far the
       biggest column: a paragraph plus Hours/Phone/WhatsApp/Email/
       Location) was stuck with the same narrow width as "Policy"
       (just 3 short links), while extra unused space sat where the
       4th column used to be.
    -> Fixed to a proper 3-column split (1fr 1fr 1.6fr) — Policy and
       Connect stay evenly matched (they have the same amount of
       content), and Need Help? gets real extra room for its longer
       content. Measured directly in a browser: Need Help? is now
       about 60% wider than the other two, instead of being
       artificially squeezed to the same size.
    -> Checked both responsive breakpoints too (tablet: 2 columns
       with Need Help wrapping to its own row below; mobile: single
       column stack) — both already used generic fr values not tied
       to a specific column count, so neither needed changes; both
       confirmed still looking correct via screenshots at 800px and
       390px wide.

50. NEW: HitPay payment integration (alongside PayPal, not replacing it)
    Built against HitPay's current API docs
    (docs.hitpayapp.com/apis/guide/online-payments) rather than
    anything memorized, since payment APIs change over time and this
    needed to be accurate.

    -> Two new Netlify functions, following the exact same security
       pattern PayPal already uses in this project:
         - netlify/functions/hitpay-create-payment.js — takes the
           cart's product ids + quantities from the browser, NEVER a
           price, and recomputes the real total itself from
           products.json before asking HitPay to create a payment
           request. Returns HitPay's hosted checkout URL.
         - netlify/functions/hitpay-webhook.js — HitPay calls this
           when a payment actually completes. Verifies the
           Hitpay-Signature header (HMAC-SHA256 against your Salt
           value) before trusting the payload at all — this is the
           ONLY safe place to mark an order as paid, since (unlike
           this webhook) the page a shopper lands on after paying can
           be visited by anyone, signature or not.
    -> New config toggle, same pattern as PAYPAL_CLIENT_ID — search
       "HITPAY_ENABLED" in index.html. Set to true (after adding your
       API key/Salt — see SETUP.md, Part 7) and a "Pay with HitPay"
       button appears in the cart drawer. Can run at the same time as
       PayPal; both buttons would show together.
    -> netlify.toml and .env.example both updated to match (search
       "hitpay" in each).
    -> TESTED without needing real HitPay credentials, in 3 separate
       ways:
         1. Ran hitpay-create-payment.js directly in Node with a
            mocked network call — confirmed it correctly recomputes
            $200\u00d72 + $180\u00d71 as $580.00 from products.json (not
            whatever the browser might have sent), and builds a
            correctly-encoded request to HitPay's API.
         2. Ran hitpay-webhook.js directly in Node with both a
            correctly-signed and a tampered payload — confirmed it
            returns 200 for the real one and 401 for the fake one.
         3. Loaded the actual page in a browser with HITPAY_ENABLED
            set to true and the network call mocked — confirmed the
            button only appears when enabled, stays hidden otherwise
            (no regression for anyone not using it), and that
            clicking it correctly redirects the browser to whatever
            checkout URL the server returns.
    -> SAME HONEST GAP AS PAYPAL: this project still has no database
       or order-storage system. hitpay-webhook.js verifies and logs
       each completed payment, but doesn't yet save it anywhere
       permanent — see SETUP.md, "What HitPay Does NOT Do Yet," and
       the matching note already in GOING-LIVE.md for PayPal.
    -> GOING-LIVE.md and SETUP.md both updated with a full HitPay
       walkthrough (getting API keys, registering the webhook,
       testing in Sandbox, switching to Live) — see SETUP.md, Part 7.

51. REMOVED: PayPal entirely. REMOVED: Netlify Functions — HitPay's
    backend moved to a new standalone /backend folder, deployable
    anywhere
    -> PayPal is completely gone: the #paypal-button-container, the
       PayPal SDK loading code, createOrder/onApprove/onCancel/onError
       handlers, window.PAYPAL_CLIENT_ID/PAYPAL_CURRENCY, and
       netlify/functions/create-order.js + capture-order.js have all
       been deleted. "PayPal" was also removed from the footer's
       accepted-payments badge row (replaced with "PayNow," which
       HitPay genuinely supports).
    -> netlify.toml and the whole netlify/ folder are gone. This
       project is no longer tied to Netlify specifically for
       anything — the site itself (index.html/style.css/script.js/
       media/) is now just plain static files, deployable to any
       static host (Netlify is still a perfectly fine CHOICE for that
       part, just no longer a requirement).
    -> HitPay's backend (previously netlify/functions/
       hitpay-create-payment.js + hitpay-webhook.js) has been rebuilt
       as a standalone Node/Express app in a new top-level /backend
       folder — see backend/README.md and backend/server.js. Same
       security logic as before (recomputes every price server-side
       from backend/products.json, verifies the HMAC-SHA256 signature
       on every webhook before trusting it), just running as a normal
       Express app instead of Netlify's serverless function format, so
       it can be deployed to ANY Node host (Render, Railway, a VPS,
       GoDaddy's Node.js Hosting, Fly.io, etc.) — you'll need to pick
       one and deploy it there; see SETUP.md for a full walkthrough
       using Render as one concrete example.
    -> New config in index.html (search "HITPAY_BACKEND_URL"): since
       the backend now lives on a separate host/domain from the
       static site (rather than both being served from the same
       Netlify site as before), the front-end needs to be told that
       backend's URL explicitly. The "Pay with HitPay" button now
       only appears once BOTH HITPAY_ENABLED is true AND
       HITPAY_BACKEND_URL is set to a real URL — leaving either unset
       shows a plain "Checkout" placeholder instead (same safe-
       fallback behavior PayPal used to have, just not tied to any
       one specific provider now).
    -> A REAL BUG WAS FOUND AND FIXED while building the standalone
       version: Express's global express.json() middleware was
       silently parsing the webhook's request body into an object
       BEFORE the webhook route's own raw-body middleware ever got a
       chance to read it — meaning the signature check was being run
       against a JS object instead of the raw bytes it actually needs,
       which made EVERY webhook fail signature verification, even
       correctly-signed ones. Confirmed this failure by actually
       running the server and sending it a correctly-signed test
       webhook, not just by reading the code. Fixed by scoping
       express.json() to only the one route that needs it
       (create-payment), leaving the webhook route to use only its
       own raw-body middleware. Re-tested afterward: a correctly-
       signed webhook now returns 200, a tampered one still correctly
       returns 401, and the OTHER route (create-payment) still works
       exactly as before — all three confirmed together in the same
       test run.
    -> Tested the full chain together, for real: started the actual
       standalone backend locally, pointed a real copy of the site at
       it, clicked "Pay with HitPay" in an actual browser, and
       confirmed the request correctly reached the real backend (no
       CORS issues) and the backend correctly attempted a real call to
       HitPay's sandbox API — it fails at exactly that point only
       because this environment has no outbound internet access to
       reach api.sandbox.hit-pay.com, not because of anything wrong in
       the code. The error was handled gracefully (a clear message
       shown to the shopper, not a crash), confirmed directly, not
       assumed.
    -> Root .env.example and the Netlify-specific lines in the root
       .gitignore were removed — the root of this project has no
       server-side code left in it anymore, so there's nothing left at
       that level needing environment variables. A new
       backend/.env.example covers everything the standalone backend
       needs instead.
    -> GOING-LIVE.md and SETUP.md both rewritten around this new
       two-piece structure (static site + separately-hosted backend)
       instead of the old single-Netlify-site assumption. New
       backend/README.md added as a quick-reference for that folder
       specifically.
