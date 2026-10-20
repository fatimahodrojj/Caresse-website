# Design system

Design tokens used on the Caresse homepage. Every value is taken from Figma
(file `6dtaFzxjdeLClcmtOMUSb7`; desktop frame `7:4`, mobile frame `113:7`).
Nothing here is invented or rounded. Where Figma is inconsistent, both values
are listed and marked **⚠**.

Values were read from the layers themselves. Figma variables were not
checked (the Figma API call limit was reached), so if the file defines any,
they aren't reflected here.

## Colors

### Core palette

| Hex | Role | Where it's used |
| --- | --- | --- |
| `#2A3B4D` | Navy (text and dark surfaces) | Headings and body text; stats and footer backgrounds; "Add to Cart" and "Visit Full Shop" buttons; "Book Now" label; stroke colour of all icons except the white arrow |
| `#EA6E9C` | Pink (primary accent) | "Book a Session" and "العربية" buttons; service-card dots (Speech & Language, Family Support); footer wordmark letters C and s; end colour of the CTA gradient; pink star icon |
| `#4A9FE0` | Blue | Team member role text; footer wordmark letters a and s; start colour of the CTA gradient; blue star icon |
| `#F0C349` | Gold | Stats numbers; footer column headings; "Book Now" button; footer wordmark letters r and e; gold star icon |
| `#B19CD9` | Purple | Service-card dots (Autism, Neuro Developmental, Feeding, Co-Therapy); footer wordmark letter e; purple star icon |
| `#FFFFFF` | White | Cards; button labels on dark or pink; text on navy and gradient sections; mobile header background |

### Supporting colors

| Hex | Where it's used |
| --- | --- |
| ~~`#334059`~~ | Hero tagline text in Figma. **Unified:** the site uses navy `#2A3B4D` instead (decision 2026-10-14) |
| ~~`#1A59A6`~~ | "Know More About Our Therapy →" link in Figma. **Unified:** the site uses blue `#4A9FE0` instead (decision 2026-10-14) |
| `#737373` | The grey number next to each product price |
| `#E8EFF8` | Cart and hamburger icon-button backgrounds; also the Therapy Shop section background |
| `#E5E7EB` | 1px borders on "How We Reach You" cards and their image areas; mobile header bottom border |
| `#FFF8F5` | Image area of the "Home Visits" card |
| `#FFF8F8` | Image area of the "At the Clinic" card |
| `#FAF8FF` | Image area of the "Online Sessions" card |
| `#FDF8F3` | Booking form section background on `/book` (Figma 33:5) |
| `#B3261E` | **Not in Figma.** Error text and error borders in forms. Added because pink on white is too low-contrast for small text; contrast 6.6:1 on white |

### Translucent colors

| Value | Where it's used |
| --- | --- |
| `rgba(74, 159, 224, 0.13)` | Circle behind the blue star (Why section) |
| `rgba(234, 110, 156, 0.13)` | Circle behind the pink star |
| `rgba(240, 195, 73, 0.13)` | Circle behind the gold star |
| `rgba(177, 156, 217, 0.13)` | Circle behind the purple star |
| `rgba(255, 255, 255, 0.1)` | Circles behind the footer social icons |
| `rgba(42, 59, 77, 0.1)` | 1px border on carousel arrow buttons |

These are the four accent colours at 13% opacity.

### Gradients

| Name | Value | Where it's used |
| --- | --- | --- |
| Hero | Left → right: `#FFE5B8` → `#A2D8FF` (at 50%) → `#FEADCB` | Hero section (desktop and mobile) |
| CTA | Left → right: `#4A9FE0` → `#EA6E9C` | "Ready to Take the First Step?" section |

### Section backgrounds

| Section | Background |
| --- | --- |
| Navbar | Transparent (`rgba(0,0,0,0)`) on desktop, sits over the hero; white `#FFFFFF` with a `#E5E7EB` bottom border on mobile |
| Hero | Hero gradient |
| Our Services | `#FFF8EC` (also the mobile page background) |
| Stats | `#2A3B4D` |
| Why Families Choose Caresse | `#E3F0FF` |
| How We Reach You | `#FFF8F0` ⚠ almost identical to Our Services `#FFF8EC` |
| Our Therapy Shop | `#E8EFF8` |
| Meet Our Team | `#FFE4EC` |
| Call to action | CTA gradient |
| Footer | `#2A3B4D` |

## Typography

### Font families

| Family | Role | Weights used |
| --- | --- | --- |
| **Dancing Script** | Script tagline ("A Touch From The Soul") only | Bold (700) |
| **Boogaloo** | Display: section headings, card titles, product and team names, stats numbers, CTA title, footer wordmark | Regular (400), the only weight it has |
| **Sora** | Body and UI: paragraphs, nav links, buttons, labels, footer links | Regular (400), SemiBold (600), Bold (700) |
| ~~**Inter**~~ | Used only for "Know More About Our Therapy →" in Figma. **Unified:** the site uses Sora instead and does not load Inter (decision 2026-10-14) | n/a |

### Type scale (desktop / mobile, in px)

| Element | Font | Size | Line height | Other |
| --- | --- | --- | --- | --- |
| Hero tagline | Dancing Script Bold | 52 / 36 | 1.1 | Letter-spacing 3px / 2px; 95% opacity; text-shadow `0 8px 18px rgba(42,59,77,0.08)`; colour navy `#2A3B4D` (Figma: `#334059`, unified) |
| Section heading | Boogaloo | 56 / 32 | normal | Our Services, Why Families Choose Caresse, Our Therapy Shop |
| Section heading, team | Boogaloo | ⚠ 48 / 32 | normal | Meet Our Team |
| Section heading, delivery | ⚠ Sora Bold | 40 / 24 | 1.2 | How We Reach You (different font from all other headings) |
| CTA title | Boogaloo | 64 / 32 | normal | White |
| Stats number | Boogaloo | 64 / 36 | normal | Gold `#F0C349` |
| Service card title | Boogaloo | 28 / 20 | normal | |
| Product and team name | Boogaloo | 22 / 20 | normal | |
| Footer wordmark | Boogaloo | 36 / 24 | normal | One colour per letter, 2px gap |
| Nav link | Sora SemiBold | 20 | normal | Inactive links at 80% opacity |
| Why point title | Sora Bold | 18 / 16 | normal | |
| Delivery card title | Sora Bold | 20 / 16 | 1.3 | |
| Body, service card | Sora Regular | 15 / 12 | 1.5 / 1.45 | 80% opacity |
| Body, why point | Sora Regular | 14 / 13 | 1.4 | 70% opacity |
| Body, delivery card | Sora Regular | 14 / 12 | 1.6 / 1.5 | 80% opacity |
| Section subtitle, delivery | Sora Regular | 16 / 14 | 1.6 | 75% opacity |
| Section subtitle, shop | Sora Regular | 18 / 14 | 1.6 | 80% opacity |
| Section subtitle, team | Sora Regular | 18 / 14 | normal | 80% opacity |
| CTA body | Sora Regular | 18 / 14 | 1.6 | White, 90% opacity |
| Product description | Sora Regular | 14 / 13 | 1.5 | 80% opacity |
| Price | Sora SemiBold | 18 / 16 | normal | Price `#2A3B4D`, number after it `#737373` |
| Stats label | Sora SemiBold | 16 / 12 | normal | White |
| Team role | Sora SemiBold | 13 | 1.5 | Blue `#4A9FE0` |
| "See All Our Materials" | Sora SemiBold | 16 / 14 | normal | |
| "Know More About Our Therapy →" | Sora Bold (Figma: Inter Bold, unified) | 22 / 18 | normal | Letter-spacing 0.5px; blue `#4A9FE0` (Figma: `#1A59A6`, unified) |
| Footer column heading | Sora Bold | 16 / 14 | normal | Gold |
| Footer link and contact | Sora Regular | 14 / 13 | normal / 1.2 | White, 80% opacity |
| Footer tagline | Sora Regular | 14 / 12 | 1.5 / 1.35 | White, 70% opacity |
| Copyright | Sora Regular | 13 / 12 | normal | White, 50% opacity |
| "Goodbye from Caresse!" | Sora SemiBold | 14 / 12 | normal | White, 70% opacity |

## Border radii

| Radius | Where it's used |
| --- | --- |
| `100px` (pill) | All text buttons except "Add to Cart"; cart icon button |
| `28px` | "How We Reach You" cards (desktop); desktop carousel arrow buttons (56px circles) |
| `24px` | Service cards (desktop), product cards, team cards |
| `22px` | Mobile carousel arrow buttons (44px circles); mobile hamburger button (36px, so also a full circle) |
| `20px` | "How We Reach You" image areas (desktop); mobile service and delivery cards; Why star circles (40px) |
| `16px` | Product images, team photo frames, mobile image areas; mobile Why star circles (32px) |
| `12px` | "Add to Cart" buttons |
| `8px` / `6px` | Service-card colour dots (16px / 12px circles) |

Character illustrations are clipped to circles or pills with a radius of half their size (for example 130px, 150px, 90px, 35px).

## Shadows

| Value | Where it's used |
| --- | --- |
| `drop-shadow(0 12px 12px rgba(42,59,77,0.04))` | Service cards, product cards |
| `drop-shadow(0 10px 12px rgba(0,0,0,0.07))` | "How We Reach You" cards. ⚠ Black-based and stronger than the navy-based card shadow |
| `drop-shadow(0 10px 10px rgba(42,59,77,0.04))` | Carousel arrow buttons |
| `drop-shadow(0 10px 14px rgba(42,59,77,0.08))` | Booking form card on `/book` |
| `text-shadow: 0 8px 18px rgba(42,59,77,0.08)` | Hero tagline |

Team cards have no shadow.

## Borders

| Value | Where it's used |
| --- | --- |
| `1px solid #E5E7EB` | "How We Reach You" cards and their image areas; mobile header (bottom) |
| `1px solid rgba(42,59,77,0.1)` | Carousel arrow buttons |
| `2px solid #FFFFFF` | "Call Us" outline button |

## Buttons

| Button | Background | Label | Padding / size | Radius |
| --- | --- | --- | --- | --- |
| Primary pink: "Book a Session", "العربية" | `#EA6E9C` | White, Sora Bold 15 | 12px × 24px; "Book a Session" fixed 141px wide | 100px |
| Primary pink, mobile | `#EA6E9C` | White, Sora Bold 11 ("Book a Session") / 10 ("العربية") | 8px × 12px, 24px tall / 6px × 10px | 100px |
| CTA solid: "Book Now" | `#F0C349` | `#2A3B4D`, Sora Bold 18 (mobile 15) | 16px × 36px (mobile: 48px tall, 14px × 18px, half width) | 100px |
| CTA outline: "Call Us" | Transparent, 2px white border | White, Sora Bold 18 (mobile 15) | Same as "Book Now" | 100px |
| Dark: "Visit Full Shop" | `#2A3B4D` | White, Sora Bold 15, then an 18px white arrow (10px gap) | 14px × 24px | 100px |
| Card: "Add to Cart" | `#2A3B4D` | White, Sora SemiBold 14 (mobile 13) | Full width, 44px tall (mobile 40px) | 12px |
| Icon: cart | `#E8EFF8` | 20px cart icon | 12px padding (44px); mobile 34px tall | 100px |
| Icon: hamburger (mobile) | `#E8EFF8` | 18px menu icon | 36px square | 22px |
| Carousel arrow | White, border `rgba(42,59,77,0.1)` | 20px chevron (mobile 18px) | 56px circle (mobile 44px, 40px in Services) | Half the size |
| Text link: "See All Our Materials" | None | Navy, Sora SemiBold 16, then a 16px arrow (8px gap) | none | n/a |
| Text link: "Know More About Our Therapy →" | None | Blue `#4A9FE0`, Sora Bold 22 (Figma: `#1A59A6`, Inter; unified) | none | n/a |

## Inconsistencies and open questions

### Colors and type
1. ~~**Two navies:** the hero tagline uses `#334059`; everything else uses `#2A3B4D`.~~ **Resolved:** the tagline uses `#2A3B4D`.
2. ~~**Two link blues:** "Know More About Our Therapy →" is `#1A59A6`; the other blue is `#4A9FE0`.~~ **Resolved:** the link uses `#4A9FE0`.
3. **Near-identical creams:** section backgrounds `#FFF8EC` (Services) and `#FFF8F0` (How We Reach You), plus three delivery image-area tints (`#FFF8F5`, `#FFF8F8`, `#FAF8FF`).
4. ~~**One-off font:** Inter is used only for the "Know More" link; everything else is Sora, Boogaloo or Dancing Script.~~ **Resolved:** the link uses Sora; Inter is not loaded.
5. **Heading styles differ:** "How We Reach You" is Sora Bold 40; the other headings are Boogaloo (56, but "Meet Our Team" is 48).
6. **Two card shadows:** a navy-based `0.04` shadow vs a black-based `0.07` shadow.
7. **Service-card dots** alternate purple/pink in an irregular pattern (purple, pink, purple / purple, pink, purple) with no clear meaning.

### Layout and structure
8. ~~**Two desktop navbars:** a standalone navbar (`98:296`) and a second copy inside the hero (`12:4`), overlapping at the top of the page, offset by 1px.~~ **Resolved:** the site has one navbar (`components/Navbar.tsx`).
9. **"Visit Full Shop" is below the footer** (`78:16`), detached from the Therapy Shop section, which has its own "See All Our Materials" link.
10. **Duplicate footer column:** desktop shows "Contact Info" twice, with identical content.
11. **Footer overflows:** the desktop footer is 1443px wide in a 1440px frame. The rendered desktop frame is 1466px wide and the mobile frame 424px instead of 390px, so something overflows both.
12. **Odd paddings:** Services has 12px top padding and the Therapy Shop 3px, compared with 80–120px elsewhere.
13. **Uneven card heights:** service cards are 264px or 287px; team cards are 533px (Rawan, two-line role) or 513px.
14. **Shop subtitle box** is 14px tall for 18px text, and the shop title uses negative margins.
15. **Mobile delivery card:** the "Home Visits" title box is fixed at 80px tall for a one-line title, leaving a large gap.

### Content
16. **Stats label differs:** "Good reviews" (desktop) vs "Progress Rate" (mobile).
17. **Footer "Services"** (Speech, ABA, Occupational, Psychomotor) don't match the six service cards.
18. **Unlabelled number** after each price (layer `quantity`: 4, 7, 10, 3). Its meaning (stock? count?) isn't stated.
19. **Zero-width space:** "Meet Our Team" (desktop) has a blank first line containing U+200B.
20. **Mobile truncation:** some mobile text is cut with an ellipsis (delivery description, product description, Rawan's role).

### Assets
21. **Empty "shop-mascot":** layers `80:2` (desktop) and `113:164` (mobile) reserve 120×112 / 96×90 above "Our Therapy Shop" but contain no image.
22. **Mobile placeholder characters:** the mobile Autism card shows three characters (`character-Autism`, `character-ADHD`, `character-SPD`), but all three use the Autism image.
23. **Placeholder layer names:** the team characters are named after other people ("Dr. Sarah Mitchell", "James Rivera", "Nora Khalil").
24. **Baked-in backgrounds:** every character illustration is a fully opaque image with its section's background colour (or a slice of the gradient) in the corners. They only blend in on exactly that background.
25. **Ali Atie's photo** has a 25px radius inside a 16px-radius frame; the other two photos have none.
26. **Broken mobile arrow:** the Services carousel's right arrow (`116:7`) is a flattened vector with the chevron off-centre, unlike every other carousel arrow.
27. **Logo is raster only:** the logo is a 1080×391 PNG; no vector version exists in the file. The footer wordmark is live text, not the logo.
28. **Shop product images are not static assets:** the shop is managed from the admin panel, so product images, names, descriptions and prices come from the database. The four product photos in the Figma design are placeholders and are not stored in this repo. Image slots are 180px tall on desktop and 140px on mobile, with a 16px radius and `object-fit: cover`.
