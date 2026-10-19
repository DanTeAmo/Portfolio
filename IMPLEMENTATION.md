# Editorial Presence

Approved direction: personal editorial portfolio inspired by MW.S composition, with original content and the author's identity foremost. Monochrome palette approved after the concept selection.

## Design system

- Paper #F4F4F0; ink #161616; dark chapter #141414.
- Dark text #F3F3EF; secondary #BCBCB6. Light secondary #5C5C58.
- Locally hosted Inter variable. Large, tightly tracked sans headings; readable prose.
- Main width 1440px, 34px desktop inset, 20px mobile inset.
- Asymmetric opening: portrait and text beside the featured project.
- Desktop collection: unequal project/continuation columns. Mobile: stacked flow.
- Composition breakpoint 650px; header menu breakpoint 768px; small-screen refinements 360px.
- Base spacing: 8px, 16px, 24px, 32px, 48px, 64px, 96px.
- Large headings scale with container width; no viewport-height content locks.
- Links and controls retain visible keyboard focus. Menu and viewer support Escape, focus restoration and scroll restoration.
- Hover scale is restrained; reduced-motion disables transforms, animated transitions and smooth scrolling.

## Components and content

PortfolioPage retains SiteHeader and ImageViewer. Screenshot rendering uses responsive WebP derivatives; full originals remain available in the viewer. Featured project cycles through three real screenshots. Native disclosures provide notes, full features and skill categories. Profile retains both certificate PDFs and the résumé. No forms, analytics, backend or invented project claims were added.

Collection data lives in src/content.ts. It currently contains the portfolio itself, complementing the featured ASOS project. Add verified future work to the same collection; do not publish placeholder case studies as real projects.

## Build and checks

`npm run build` runs TypeScript, Vite client build, server rendering and static prerendering. It passed on October 19, 2026. Output: dist/.

Existing browser regression checks were updated for the new section structure. Run `npm run test:browser` with the production preview on port 4173 and Chrome installed. Existing Lighthouse script remains available. Do not interpret retained historical VERIFICATION.md scores as results for this redesign.

The approved restored design is promoted to GitHub main in one commit. The previous main is retained by the portfolio-before-redesign tag. Canonical metadata retains the original Vercel URL; the separate Sites publication remains a design preview.
