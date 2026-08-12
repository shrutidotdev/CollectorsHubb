# How to Explain Curio in Your Interview

## 30-second introduction

“Curio is a responsive Collector's Hub with three connected modules: a marketplace for discovery, a community feed for collector stories, and a personal collection manager. I focused on making it feel like one real product rather than three separate screens. Shared state connects every route, the important choices persist locally, and the interface handles duplicates, missing images, loading, errors, empty results, and mobile layouts.”

## How the application works

The app starts with realistic mock data, which keeps setup easy for reviewers. React Router provides separate URLs for Marketplace, Community, collection management, product details, and post details. The shared `App` component owns the important state, so an item added from a product page immediately appears in My Collection.

Local Storage acts as a small device-only database. It remembers collections, likes, saved posts, dark mode, and marketplace filters after refresh. The persistence helper safely falls back to normal React state if storage is blocked.

## Important engineering decisions

### 1. One source of truth

Collection data lives once at the top level. Every screen receives that state and the same add, move, and remove functions. This prevents different pages from disagreeing about whether an item is owned or wishlisted.

### 2. Duplicate prevention

Before adding or moving an item, the code checks the target collection for its product ID. If it exists, the update is stopped and the user receives a friendly message. This protects data and makes the action understandable.

### 3. Derived filtering

Search, category, condition, and sorting do not mutate the source data. A memoized calculation derives the visible list. Search is debounced so filtering does not run on every fast keystroke.

### 4. Resilient UI states

The loading skeleton resembles the final card layout. Empty states explain what happened and provide a recovery action. A reusable image component catches failed or missing images. Unknown URLs show a designed 404 instead of a blank page.

### 5. Responsive product design

Desktop uses spacious grids and detailed filters. Tablet reduces column counts. Mobile becomes a single-column experience with a reachable bottom navigation and stacked actions. Focus styles, labels, semantic buttons, and reduced-motion preferences improve accessibility.

## Files to know

- `app/data.ts`: types and mock marketplace/community data
- `app/page.tsx`: routing, state, behavior, and reusable components
- `app/globals.css`: visual system and responsive behavior
- `app/layout.tsx`: page metadata and social preview

## Questions you may be asked

**Why Local Storage instead of Redux?**

The state is small and only needs to be shared within one client application. Lifting it to the product shell plus a reusable persistence hook stays simple and maintainable. For a larger app with server caching and many domains, I would evaluate a dedicated state or query library.

**Why mock data?**

Authentication and a backend were not required. Mock data makes review instant and lets the assignment emphasize React behavior and UX. The data layer is isolated, so it can later be replaced by an API.

**How would you connect a real API?**

I would move list queries into a service layer, use abortable requests and server pagination, replace the simulated loading hook with real request states, and send collection mutations to authenticated endpoints with optimistic updates and rollback.

**How are filters maintained?**

Marketplace filter state is owned above the route and saved locally. Opening an item and returning preserves the user's exact search context, and refresh does too.

**What would you test next?**

I would add unit tests for duplicate and move rules, component tests for filter/empty states, and Playwright flows for add → move → remove, persistence after refresh, and responsive navigation.

## Strong closing line

“The main thing I wanted to demonstrate is product thinking alongside React: every feature has feedback, every failure has a recovery path, and the three modules behave like parts of the same collector journey.”
