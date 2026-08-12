# Curio — Collector's Hub

Curio is a responsive React application for discovering, discussing, and organizing collectible items. It was built for the React Web Developer Internship Assignment and covers all three requested product modules: Marketplace, Community Feed, and My Collection.

## Demo

- Live app: add the deployed URL here
- Demo video: add your Loom, Google Drive, or YouTube link here

## Core features

### Marketplace

- Browse realistic collectible listings in grid or list view
- Debounced title search
- Category and condition filters
- Price and newest sorting
- Dedicated product detail routes
- Add items to Owned or Wishlist
- Duplicate prevention with clear toast feedback
- Missing-image fallback for incomplete listings
- Filters remain selected while navigating between pages and after refresh

### Community Feed

- Browse responsive community post cards
- Search captions, collectors, and hashtags
- Filter by category
- Like and save posts with optimistic feedback
- Dedicated post detail routes with a conversation preview

### My Collection

- Three default collections: Owned, Wishlist, and Selling
- Search and category filtering
- Sort by date added, value, or title
- Remove items or move them between collections
- Duplicate-safe move logic
- Estimated portfolio and selling values
- Helpful empty and no-result states

## Additional product polish

- Dark mode with saved preference
- Local Storage persistence for collections, post activity, and marketplace filters
- Skeleton loading states
- Retryable error-state design
- Lazy-loaded images with graceful fallbacks
- Fully responsive desktop, tablet, and mobile layouts
- Mobile bottom navigation
- Accessible labels, keyboard focus styles, semantic controls, and reduced-motion support

## Tech stack

- React 19
- TypeScript
- React Router
- Lucide React icons
- CSS with responsive custom properties and media queries
- Browser Local Storage for device-local persistence
- Vite build tooling

## Setup instructions

Requirements: Node.js 22.13 or newer and npm.

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in a browser.

To create a production build:

```bash
npm run build
```

## Assumptions

- Authentication, checkout, direct messaging, and a real backend are outside this assignment's scope.
- Marketplace and feed data are realistic in-memory mock data to keep the review setup simple.
- Collection changes, likes, saves, theme preference, and filter preference belong to the current device, so they are stored in Local Storage.
- Prices and estimated values are displayed in USD and are intentionally mocked.
- Adding a marketplace item to “Collection” means adding it to Owned; the Wishlist action adds it to Wishlist.
- A collector may keep the same item in different collection types, but duplicates inside the same collection are blocked.
- Remote editorial photos are loaded from Unsplash. Every image surface includes a fallback if the network or source fails.

## Code organization

```text
app/
├── data.ts        # Types and realistic mock data
├── globals.css    # Design system, responsive layouts, states, and animations
└── page.tsx       # Routes, reusable UI components, and product logic
src/
└── main.tsx       # Browser entry point
```

The app keeps shared state at the product-shell level so every route sees the same collection and community state. Reusable components such as `SmartImage`, `ProductCard`, `PostCard`, `SelectControl`, `EmptyState`, and `ErrorState` keep behavior and visual patterns consistent.

## Edge-case strategy

- Before add or move operations, the target collection is checked for an existing product ID.
- Failed images switch to a branded fallback instead of showing a broken-image icon.
- Searches and filters return contextual empty states with a one-click recovery action.
- Loading states match the final layout to reduce visual movement.
- Storage access is wrapped in safe fallbacks so the interface still works when browser storage is unavailable.
- Unknown product, post, and route IDs show a designed 404 state.

## Suggested demo flow

1. Start in Marketplace and explain the reusable card and filter design.
2. Search for “Canon”, open the item, and add it to Owned.
3. Click the same action again to demonstrate duplicate prevention.
4. Add the item to Wishlist and show the immediate visual feedback.
5. Open Community, like and save a post, then open its detail route.
6. Open My Collection, switch tabs, move an item, and remove another.
7. Demonstrate search with no results, mobile layout, and dark mode.
8. Refresh the page to show that state and filters persist locally.

## Future production improvements

- Replace mock data with an API and server-side pagination
- Add authentication and collector profiles
- Add image uploads, moderation, and accessible comments
- Add a real checkout and offer flow
- Add unit, component, and end-to-end tests around collection operations
