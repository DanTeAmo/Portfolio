# Daniel Rusnac — Portfolio

Quiet Precision portfolio built with React, TypeScript, Vite and CSS. The production build includes prerendered HTML, so the content, navigation, project details, images and certificate links remain usable without JavaScript.

## Local development

Requires Node.js 22.12+ (or 20.19+) and npm.

```sh
npm ci
npm run dev
```

## Production

```sh
npm run build
npm run preview
```

Publish the contents of `dist/` to a static web host. No application server, database or environment secrets are required. This version assumes hosting at the domain root. A subdirectory deployment requires setting Vite's base and updating root-relative asset URLs before building.

## Editing

- `src/content.ts`: skills, about text, project, screenshot descriptions and credentials.
- `src/PortfolioPage.tsx`: six sections, hero and contact copy, navigation and disclosure.
- `src/ImageViewer.tsx`: accessible native image dialog, keyboard navigation and zoom.
- `src/styles.css`: typography, olive palette, layout and responsive rules.
- `public/assets/`: original photographs/screenshots, optimized WebP derivatives, certificates, local Inter and its license.

Original assets are retained unchanged. WebP derivatives only compress the original pixels; no retouching or generated replacements. Georgia uses the visitor's system font. PDFs are supplied by the portfolio owner; certificate details were transcribed from those documents, without issuer validation. ASOS project descriptions are the owner's account, not a test report for that separate application.

No analytics, third-party embeds, fake contact form or unprovided live-demo links. Add canonical and Open Graph URLs after the public domain is known.

## Verification

With the production preview running on port 4173 and Google Chrome installed:

```sh
npm run test:browser
npm run test:performance
```

Browser checks cover seven viewport widths, keyboard navigation, native project details, the image viewer, both PDFs, reduced motion and content/navigation without JavaScript. Reports and browser screenshots are written to `test-results/`. Lighthouse uses its simulated mobile profile. Automated checks are not a full screen-reader or WCAG conformance audit.

The mobile menu uses native HTML disclosure so it is usable before hydration and without JavaScript; it does not shift the page on initialization. Inter's Latin subset retains the original variable weights and license. Responsive WebP images let small screens download smaller copies while the gallery opens the full original PNGs.
