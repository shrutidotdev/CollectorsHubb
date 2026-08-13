import { useEffect, useState, useSyncExternalStore } from "react";
import {
  BrowserRouter,
  MemoryRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import {
  initialCollections,
  type CollectionItem,
  type CollectionName,
  type Product,
} from "./data";
import CollectionPage from "./components/collection/CollectionPage";
import CommunityPage from "./components/community/CommunityPage";
import PostDetails from "./components/community/PostDetails";
import Header from "./components/layout/Header";
import MobileNav from "./components/layout/MobileNav";
import NotFound from "./components/layout/NotFound";
import ToastRegion from "./components/layout/ToastRegion";
import MarketplacePage from "./components/marketplace/MarketplacePage";
import ProductDetails from "./components/marketplace/ProductDetails";
import { subscribeToBrowser } from "./hooks/useLoadState";
import { usePersistentState } from "./hooks/usePersistentState";
import type { MarketFilters, Toast } from "./types";

function App() {
  const [theme, setTheme] = usePersistentState<"light" | "dark">(
    "curio-theme",
    "light",
  );
  const [collections, setCollections] = usePersistentState<
    Record<CollectionName, CollectionItem[]>
  >("curio-collections", initialCollections);
  const [likedPosts, setLikedPosts] = usePersistentState<number[]>(
    "curio-liked-posts",
    [],
  );
  const [savedPosts, setSavedPosts] = usePersistentState<number[]>(
    "curio-saved-posts",
    [],
  );
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [marketFilters, setMarketFilters] = usePersistentState<MarketFilters>(
    "curio-market-filters",
    {
      search: "",
      category: "All",
      condition: "All",
      sort: "newest",
      view: "grid",
    },
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function notify(message: string, tone: Toast["tone"] = "success") {
    const id = Date.now() + Math.random();
    setToasts((items) => [...items, { id, message, tone }]);
    window.setTimeout(
      () => setToasts((items) => items.filter((item) => item.id !== id)),
      2800,
    );
  }

  function addToCollection(product: Product, target: CollectionName) {
    if (collections[target].some((item) => item.id === product.id)) {
      notify(`${product.title} is already in ${target}.`, "info");
      return;
    }

    const item: CollectionItem = {
      ...product,
      dateAdded: new Date().toISOString().slice(0, 10),
      estimatedValue: Math.round(product.price * 1.06),
    };
    setCollections((current) => ({
      ...current,
      [target]: [item, ...current[target]],
    }));
    notify(`Added to ${target}.`);
  }

  function removeFromCollection(id: number, source: CollectionName) {
    const item = collections[source].find((entry) => entry.id === id);
    setCollections((current) => ({
      ...current,
      [source]: current[source].filter((entry) => entry.id !== id),
    }));
    if (item) notify(`${item.title} removed from ${source}.`, "info");
  }

  function moveCollectionItem(
    id: number,
    source: CollectionName,
    target: CollectionName,
  ) {
    if (source === target) return;
    const item = collections[source].find((entry) => entry.id === id);
    if (!item) return;
    if (collections[target].some((entry) => entry.id === id)) {
      notify(`${item.title} already exists in ${target}.`, "info");
      return;
    }
    setCollections((current) => ({
      ...current,
      [source]: current[source].filter((entry) => entry.id !== id),
      [target]: [{ ...item, dateAdded: new Date().toISOString().slice(0, 10) }, ...current[target]],
    }));
    notify(`Moved to ${target}.`);
  }

  function toggleLiked(postId: number) {
    const isLiked = likedPosts.includes(postId);
    setLikedPosts((items) =>
      isLiked ? items.filter((id) => id !== postId) : [...items, postId],
    );
    notify(isLiked ? "Like removed." : "Post liked.", "info");
  }

  function toggleSaved(postId: number) {
    const isSaved = savedPosts.includes(postId);
    setSavedPosts((items) =>
      isSaved ? items.filter((id) => id !== postId) : [...items, postId],
    );
    notify(isSaved ? "Removed from saved posts." : "Post saved.", "info");
  }

  const shared = {
    collections,
    addToCollection,
    notify,
  };

  return (
    <div className="app-shell">
      <Header
        theme={theme}
        onToggleTheme={() =>
          setTheme((current) => (current === "light" ? "dark" : "light"))
        }
        collectionCount={Object.values(collections).reduce(
          (total, items) => total + items.length,
          0,
        )}
      />

      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/marketplace" replace />} />
          <Route
            path="/marketplace"
            element={
              <MarketplacePage
                {...shared}
                filters={marketFilters}
                setFilters={setMarketFilters}
              />
            }
          />
          <Route
            path="/marketplace/:productId"
            element={<ProductDetails {...shared} />}
          />
          <Route
            path="/community"
            element={
              <CommunityPage
                likedPosts={likedPosts}
                savedPosts={savedPosts}
                toggleLiked={toggleLiked}
                toggleSaved={toggleSaved}
              />
            }
          />
          <Route
            path="/community/:postId"
            element={
              <PostDetails
                likedPosts={likedPosts}
                savedPosts={savedPosts}
                toggleLiked={toggleLiked}
                toggleSaved={toggleSaved}
              />
            }
          />
          <Route
            path="/collection"
            element={
              <CollectionPage
                collections={collections}
                removeItem={removeFromCollection}
                moveItem={moveCollectionItem}
              />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <MobileNav />
      <ToastRegion toasts={toasts} />
    </div>
  );
}

export default function HomePage() {
  const browserReady = useSyncExternalStore(
    subscribeToBrowser,
    () => true,
    () => false,
  );

  if (!browserReady) {
    return (
      <MemoryRouter initialEntries={["/marketplace"]}>
        <App />
      </MemoryRouter>
    );
  }
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
