import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Box,
  Check,
  ChevronDown,
  CircleDollarSign,
  Compass,
  Grid2X2,
  Heart,
  Home,
  LayoutGrid,
  List,
  MapPin,
  MessageCircle,
  Moon,
  MoreHorizontal,
  PackageOpen,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Sun,
  Trash2,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import {
  BrowserRouter,
  Link,
  MemoryRouter,
  NavLink,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  categories,
  communityPosts,
  initialCollections,
  products,
  type Category,
  type CollectionItem,
  type CollectionName,
  type CommunityPost,
  type Condition,
  type Product,
} from "./data";

type Toast = { id: number; message: string; tone: "success" | "info" };
type MarketFilters = {
  search: string;
  category: Category | "All";
  condition: Condition | "All";
  sort: "newest" | "low" | "high";
  view: "grid" | "list";
};

const collectionNames: CollectionName[] = ["Owned", "Wishlist", "Selling"];
const conditions: Condition[] = ["Mint", "Excellent", "Good", "Fair"];
const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function subscribeToBrowser() {
  return () => undefined;
}

function usePersistentState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const hydrated = useRef(false);

  useEffect(() => {
    let timeout: number | undefined;
    try {
      const saved = window.localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved) as T;
        timeout = window.setTimeout(() => setValue(parsed), 0);
      }
    } catch {
      // Invalid or unavailable storage falls back to the safe default.
    } finally {
      hydrated.current = true;
    }
    return () => {
      if (timeout) window.clearTimeout(timeout);
    };
  }, [key]);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // The interface remains fully usable when storage is unavailable.
    }
  }, [key, value]);

  return [value, setValue] as const;
}

function useDebouncedValue<T>(value: T, delay = 250) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timeout = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timeout);
  }, [value, delay]);
  return debounced;
}

function useLoadState(key: string) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const shouldFail =
        window.localStorage.getItem("curio-simulated-error") === key;
      setStatus(shouldFail ? "error" : "ready");
    }, 520);
    return () => window.clearTimeout(timeout);
  }, [attempt, key]);

  return {
    status,
    retry: () => {
      window.localStorage.removeItem("curio-simulated-error");
      setStatus("loading");
      setAttempt((value) => value + 1);
    },
  };
}

function SmartImage({
  src,
  alt,
  className = "",
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  const [failedSrc, setFailedSrc] = useState<string | undefined>();
  const failed = !src || failedSrc === src;

  if (failed || !src) {
    return (
      <div
        className={`image-fallback ${className}`}
        role="img"
        aria-label={`${alt} image unavailable`}
      >
        <PackageOpen size={30} strokeWidth={1.5} />
        <span>Image unavailable</span>
      </div>
    );
  }

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailedSrc(src)}
    />
  );
}

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

function Logo() {
  return (
    <Link to="/marketplace" className="brand" aria-label="Curio home">
      <span className="brand-mark" aria-hidden="true">
        C
      </span>
      <span>curio</span>
    </Link>
  );
}

function Header({
  theme,
  onToggleTheme,
  collectionCount,
}: {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  collectionCount: number;
}) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Logo />
        <nav className="desktop-nav" aria-label="Main navigation">
          <NavLink to="/marketplace">
            <ShoppingBag size={17} /> Marketplace
          </NavLink>
          <NavLink to="/community">
            <Users size={17} /> Community
          </NavLink>
          <NavLink to="/collection">
            <Grid2X2 size={17} /> My collection
            <span className="nav-count">{collectionCount}</span>
          </NavLink>
        </nav>
        <div className="header-actions">
          <button
            className="icon-button"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
          </button>
          <button className="profile-button" aria-label="Open profile">
            SS
          </button>
        </div>
      </div>
    </header>
  );
}

function MobileNav() {
  return (
    <nav className="mobile-nav" aria-label="Mobile navigation">
      <NavLink to="/marketplace">
        <ShoppingBag size={20} /> <span>Market</span>
      </NavLink>
      <NavLink to="/community">
        <Users size={20} /> <span>Community</span>
      </NavLink>
      <NavLink to="/collection">
        <Grid2X2 size={20} /> <span>Collection</span>
      </NavLink>
    </nav>
  );
}

function MarketplacePage({
  collections,
  addToCollection,
  filters,
  setFilters,
}: {
  collections: Record<CollectionName, CollectionItem[]>;
  addToCollection: (product: Product, target: CollectionName) => void;
  notify: (message: string, tone?: Toast["tone"]) => void;
  filters: MarketFilters;
  setFilters: React.Dispatch<React.SetStateAction<MarketFilters>>;
}) {
  const debouncedSearch = useDebouncedValue(filters.search);
  const { status, retry } = useLoadState("marketplace");

  const visibleProducts = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    return products
      .filter(
        (product) =>
          (!query || product.title.toLowerCase().includes(query)) &&
          (filters.category === "All" ||
            product.category === filters.category) &&
          (filters.condition === "All" ||
            product.condition === filters.condition),
      )
      .sort((a, b) => {
        if (filters.sort === "low") return a.price - b.price;
        if (filters.sort === "high") return b.price - a.price;
        return Date.parse(b.postedAt) - Date.parse(a.postedAt);
      });
  }, [debouncedSearch, filters.category, filters.condition, filters.sort]);

  const filtersActive =
    filters.search !== "" ||
    filters.category !== "All" ||
    filters.condition !== "All";

  function clearFilters() {
    setFilters((current) => ({
      ...current,
      search: "",
      category: "All",
      condition: "All",
    }));
  }

  return (
    <>
      <section className="market-hero">
        <div className="hero-noise" />
        <div className="hero-copy">
          <span className="eyebrow light-eyebrow">
            <Sparkles size={14} /> Curated this week
          </span>
          <h1>
            Objects with a past.
            <br /> Stories worth keeping.
          </h1>
          <p>
            Discover remarkable finds from trusted collectors, from analog
            icons to the pieces you have been searching for.
          </p>
          <a href="#market-listings" className="hero-button">
            Explore the marketplace <ArrowRight size={17} />
          </a>
          <div className="hero-stats" aria-label="Marketplace statistics">
            <span>
              <strong>12.4k</strong> active listings
            </span>
            <span>
              <strong>8.9k</strong> collectors
            </span>
            <span>
              <strong>98%</strong> happy trades
            </span>
          </div>
        </div>
        <Link
          to="/marketplace/1"
          className="hero-feature"
          aria-label="View featured Canon AE-1 Program"
        >
          <SmartImage src={products[0].image} alt={products[0].title} />
          <div className="hero-feature-card">
            <span>Editor&apos;s pick</span>
            <strong>{products[0].title}</strong>
            <b>{money.format(products[0].price)}</b>
          </div>
        </Link>
      </section>

      <section className="page-section" id="market-listings">
        <div className="section-heading split-heading">
          <div>
            <span className="eyebrow">The marketplace</span>
            <h2>Find your next treasure</h2>
            <p>Fresh finds, thoughtfully listed by fellow collectors.</p>
          </div>
          <div className="view-toggle" aria-label="Listing view">
            <button
              className={filters.view === "grid" ? "active" : ""}
              onClick={() =>
                setFilters((current) => ({ ...current, view: "grid" }))
              }
              aria-label="Grid view"
            >
              <LayoutGrid size={17} />
            </button>
            <button
              className={filters.view === "list" ? "active" : ""}
              onClick={() =>
                setFilters((current) => ({ ...current, view: "list" }))
              }
              aria-label="List view"
            >
              <List size={18} />
            </button>
          </div>
        </div>

        <div className="filter-bar">
          <label className="search-control">
            <Search size={18} />
            <input
              type="search"
              value={filters.search}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  search: event.target.value,
                }))
              }
              placeholder="Search cameras, records, sneakers..."
              aria-label="Search marketplace"
            />
            {filters.search && (
              <button
                onClick={() =>
                  setFilters((current) => ({ ...current, search: "" }))
                }
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </label>
          <SelectControl
            label="Category"
            value={filters.category}
            options={["All", ...categories]}
            onChange={(value) =>
              setFilters((current) => ({
                ...current,
                category: value as Category | "All",
              }))
            }
          />
          <SelectControl
            label="Condition"
            value={filters.condition}
            options={["All", ...conditions]}
            onChange={(value) =>
              setFilters((current) => ({
                ...current,
                condition: value as Condition | "All",
              }))
            }
          />
          <SelectControl
            label="Sort by"
            value={filters.sort}
            options={["newest", "low", "high"]}
            optionLabels={{
              newest: "Newest first",
              low: "Price: low to high",
              high: "Price: high to low",
            }}
            onChange={(value) =>
              setFilters((current) => ({
                ...current,
                sort: value as MarketFilters["sort"],
              }))
            }
          />
        </div>

        <div className="results-line" aria-live="polite">
          <span>
            {visibleProducts.length} {visibleProducts.length === 1 ? "find" : "finds"}
          </span>
          {filtersActive && (
            <button onClick={clearFilters}>Clear all filters</button>
          )}
        </div>

        {status === "loading" && <CardSkeleton count={8} />}
        {status === "error" && (
          <ErrorState message="We couldn’t load the marketplace right now." onRetry={retry} />
        )}
        {status === "ready" && visibleProducts.length === 0 && (
          <EmptyState
            icon={<Search size={30} />}
            title="No treasures found"
            message="Try a broader search or clear one of your filters. The right find may be just outside your current search."
            action="Clear filters"
            onAction={clearFilters}
          />
        )}
        {status === "ready" && visibleProducts.length > 0 && (
          <div className={`product-grid ${filters.view === "list" ? "list-view" : ""}`}>
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={collections.Wishlist.some(
                  (item) => item.id === product.id,
                )}
                onWishlist={() => addToCollection(product, "Wishlist")}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function SelectControl({
  label,
  value,
  options,
  optionLabels,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  optionLabels?: Record<string, string>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="select-control">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {optionLabels?.[option] ?? (option === "All" ? `All ${label.toLowerCase()}s` : option)}
          </option>
        ))}
      </select>
      <ChevronDown size={16} aria-hidden="true" />
    </label>
  );
}

function ProductCard({
  product,
  isWishlisted,
  onWishlist,
}: {
  product: Product;
  isWishlisted: boolean;
  onWishlist: () => void;
}) {
  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <Link to={`/marketplace/${product.id}`}>
          <SmartImage src={product.image} alt={product.title} />
        </Link>
        <span className={`condition-badge condition-${product.condition.toLowerCase()}`}>
          {product.condition}
        </span>
        <button
          className={`heart-button ${isWishlisted ? "selected" : ""}`}
          onClick={onWishlist}
          aria-label={isWishlisted ? "Already in wishlist" : "Add to wishlist"}
        >
          <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="product-card-body">
        <span className="product-category">{product.category}</span>
        <Link to={`/marketplace/${product.id}`} className="product-title-link">
          <h3>{product.title}</h3>
        </Link>
        <div className="product-meta">
          <span>{product.seller}</span>
          <span>
            <MapPin size={13} /> {product.location}
          </span>
        </div>
        <div className="product-price-row">
          <strong>{money.format(product.price)}</strong>
          <Link to={`/marketplace/${product.id}`} aria-label={`View ${product.title}`}>
            View <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}

function ProductDetails({
  collections,
  addToCollection,
}: {
  collections: Record<CollectionName, CollectionItem[]>;
  addToCollection: (product: Product, target: CollectionName) => void;
  notify: (message: string, tone?: Toast["tone"]) => void;
}) {
  const { productId } = useParams();
  const navigate = useNavigate();
  const product = products.find((item) => item.id === Number(productId));

  if (!product) return <NotFound />;
  const owned = collections.Owned.some((item) => item.id === product.id);
  const wished = collections.Wishlist.some((item) => item.id === product.id);

  return (
    <section className="page-section detail-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        <ArrowLeft size={17} /> Back to marketplace
      </button>
      <div className="product-detail-grid">
        <div className="detail-image-panel">
          <SmartImage src={product.image} alt={product.title} />
          <span className="detail-year">{product.year}</span>
        </div>
        <div className="detail-copy">
          <span className="eyebrow">{product.category}</span>
          <h1>{product.title}</h1>
          <div className="detail-tags">
            <span className={`condition-badge condition-${product.condition.toLowerCase()}`}>
              {product.condition}
            </span>
            <span>
              <MapPin size={14} /> {product.location}
            </span>
          </div>
          <div className="detail-price">{money.format(product.price)}</div>
          <p className="detail-description">{product.description}</p>
          <div className="detail-actions">
            <button
              className="primary-button"
              onClick={() => addToCollection(product, "Owned")}
            >
              {owned ? <Check size={18} /> : <Box size={18} />}
              {owned ? "In your collection" : "Add to collection"}
            </button>
            <button
              className={`secondary-button ${wished ? "selected-button" : ""}`}
              onClick={() => addToCollection(product, "Wishlist")}
            >
              <Heart size={18} fill={wished ? "currentColor" : "none"} />
              {wished ? "In wishlist" : "Add to wishlist"}
            </button>
          </div>
          <div className="seller-card">
            <div className="avatar avatar-clay">{product.seller.split(" ").map((word) => word[0]).join("")}</div>
            <div>
              <small>Listed by</small>
              <strong>{product.seller}</strong>
              <span>
                <Star size={13} fill="currentColor" /> {product.sellerRating} seller rating
              </span>
            </div>
            <ShieldCheck size={24} />
          </div>
          <div className="buyer-note">
            <ShieldCheck size={18} />
            <span>
              <strong>Collect with confidence</strong>
              Buyer protection applies to every marketplace purchase.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function CommunityPage({
  likedPosts,
  savedPosts,
  toggleLiked,
  toggleSaved,
}: {
  likedPosts: number[];
  savedPosts: number[];
  toggleLiked: (id: number) => void;
  toggleSaved: (id: number) => void;
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category | "All">("All");
  const debouncedSearch = useDebouncedValue(search);
  const { status, retry } = useLoadState("community");

  const posts = useMemo(() => {
    const query = debouncedSearch.toLowerCase().trim();
    return communityPosts.filter(
      (post) =>
        (!query ||
          post.caption.toLowerCase().includes(query) ||
          post.user.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.includes(query))) &&
        (category === "All" || post.category === category),
    );
  }, [category, debouncedSearch]);

  return (
    <section className="page-section community-page">
      <div className="community-intro">
        <div>
          <span className="eyebrow">The community</span>
          <h1>A good find is better shared.</h1>
          <p>
            Stories, shelf tours, restorations, and remarkable finds from
            collectors around the world.
          </p>
        </div>
        <div className="community-stat">
          <Users size={22} />
          <span>
            <strong>1,240</strong>
            stories shared this week
          </span>
        </div>
      </div>

      <div className="community-toolbar">
        <label className="search-control">
          <Search size={18} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search stories, collectors, or tags"
            aria-label="Search community posts"
          />
          {search && (
            <button onClick={() => setSearch("")} aria-label="Clear search">
              <X size={16} />
            </button>
          )}
        </label>
        <div className="chip-row" aria-label="Filter community by category">
          {["All", ...categories.slice(0, 6)].map((item) => (
            <button
              key={item}
              className={category === item ? "active" : ""}
              onClick={() => setCategory(item as Category | "All")}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {status === "loading" && <PostSkeleton />}
      {status === "error" && (
        <ErrorState message="The community feed is taking longer than expected." onRetry={retry} />
      )}
      {status === "ready" && posts.length === 0 && (
        <EmptyState
          icon={<MessageCircle size={30} />}
          title="No stories match that search"
          message="Try a different keyword or browse all categories to reconnect with the community."
          action="Show all posts"
          onAction={() => {
            setSearch("");
            setCategory("All");
          }}
        />
      )}
      {status === "ready" && posts.length > 0 && (
        <div className="post-grid">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              liked={likedPosts.includes(post.id)}
              saved={savedPosts.includes(post.id)}
              onLike={() => toggleLiked(post.id)}
              onSave={() => toggleSaved(post.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function PostCard({
  post,
  liked,
  saved,
  onLike,
  onSave,
}: {
  post: CommunityPost;
  liked: boolean;
  saved: boolean;
  onLike: () => void;
  onSave: () => void;
}) {
  return (
    <article className="post-card">
      <div className="post-author">
        <span className="avatar" style={{ background: post.avatarColor }}>
          {post.initials}
        </span>
        <span>
          <strong>{post.user}</strong>
          <small>{post.handle} · {post.timeAgo}</small>
        </span>
        <button aria-label="Post options">
          <MoreHorizontal size={19} />
        </button>
      </div>
      <Link to={`/community/${post.id}`} className="post-image">
        <SmartImage src={post.image} alt={`Collectible shared by ${post.user}`} />
        <span>{post.category}</span>
      </Link>
      <div className="post-content">
        <p>{post.caption}</p>
        <div className="post-tags">
          {post.tags.map((tag) => <span key={tag}>#{tag}</span>)}
        </div>
        <div className="post-actions">
          <button className={liked ? "liked" : ""} onClick={onLike}>
            <Heart size={19} fill={liked ? "currentColor" : "none"} />
            {post.likes + (liked ? 1 : 0)}
          </button>
          <Link to={`/community/${post.id}`}>
            <MessageCircle size={19} /> {post.comments}
          </Link>
          <button
            className={`save-action ${saved ? "saved" : ""}`}
            onClick={onSave}
            aria-label={saved ? "Unsave post" : "Save post"}
          >
            <Bookmark size={19} fill={saved ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    </article>
  );
}

function PostDetails({
  likedPosts,
  savedPosts,
  toggleLiked,
  toggleSaved,
}: {
  likedPosts: number[];
  savedPosts: number[];
  toggleLiked: (id: number) => void;
  toggleSaved: (id: number) => void;
}) {
  const { postId } = useParams();
  const navigate = useNavigate();
  const post = communityPosts.find((item) => item.id === Number(postId));
  if (!post) return <NotFound />;
  const liked = likedPosts.includes(post.id);
  const saved = savedPosts.includes(post.id);

  return (
    <section className="page-section detail-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        <ArrowLeft size={17} /> Back to community
      </button>
      <article className="post-detail">
        <div className="post-detail-image">
          <SmartImage src={post.image} alt={`Collectible shared by ${post.user}`} />
        </div>
        <div className="post-detail-copy">
          <div className="post-author">
            <span className="avatar" style={{ background: post.avatarColor }}>{post.initials}</span>
            <span>
              <strong>{post.user}</strong>
              <small>{post.handle} · {post.timeAgo}</small>
            </span>
          </div>
          <span className="eyebrow">{post.category}</span>
          <p className="post-detail-caption">{post.caption}</p>
          <div className="post-tags">
            {post.tags.map((tag) => <span key={tag}>#{tag}</span>)}
          </div>
          <div className="post-detail-stats">
            <span><strong>{post.likes + (liked ? 1 : 0)}</strong> likes</span>
            <span><strong>{post.comments}</strong> comments</span>
          </div>
          <div className="detail-actions">
            <button className={`secondary-button ${liked ? "selected-button" : ""}`} onClick={() => toggleLiked(post.id)}>
              <Heart size={18} fill={liked ? "currentColor" : "none"} />
              {liked ? "Liked" : "Like post"}
            </button>
            <button className={`secondary-button ${saved ? "selected-button" : ""}`} onClick={() => toggleSaved(post.id)}>
              <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
              {saved ? "Saved" : "Save post"}
            </button>
          </div>
          <div className="comment-preview">
            <strong>Recent conversation</strong>
            <div><span className="mini-avatar">AL</span><p><b>@analog.life</b> What a wonderful restoration—those keys look perfect.</p></div>
            <div><span className="mini-avatar green">RK</span><p><b>@rare.kind</b> The story behind it makes the piece even better.</p></div>
          </div>
        </div>
      </article>
    </section>
  );
}

function CollectionPage({
  collections,
  removeItem,
  moveItem,
}: {
  collections: Record<CollectionName, CollectionItem[]>;
  removeItem: (id: number, source: CollectionName) => void;
  moveItem: (id: number, source: CollectionName, target: CollectionName) => void;
}) {
  const [activeCollection, setActiveCollection] = useState<CollectionName>("Owned");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category | "All">("All");
  const [sort, setSort] = useState<"date" | "value" | "title">("date");
  const debouncedSearch = useDebouncedValue(search);
  const { status, retry } = useLoadState("collection");

  const currentItems = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    return [...collections[activeCollection]]
      .filter(
        (item) =>
          (!query || item.title.toLowerCase().includes(query)) &&
          (category === "All" || item.category === category),
      )
      .sort((a, b) => {
        if (sort === "value") return b.estimatedValue - a.estimatedValue;
        if (sort === "title") return a.title.localeCompare(b.title);
        return Date.parse(b.dateAdded) - Date.parse(a.dateAdded);
      });
  }, [activeCollection, category, collections, debouncedSearch, sort]);

  const ownedValue = collections.Owned.reduce(
    (sum, item) => sum + item.estimatedValue,
    0,
  );
  const sellingValue = collections.Selling.reduce(
    (sum, item) => sum + item.estimatedValue,
    0,
  );

  return (
    <section className="page-section collection-page">
      <div className="collection-heading">
        <div>
          <span className="eyebrow">Your private archive</span>
          <h1>My collection</h1>
          <p>Keep every treasured find organized, valued, and close at hand.</p>
        </div>
        <div className="portfolio-card">
          <TrendingUp size={23} />
          <span>
            <small>Estimated owned value</small>
            <strong>{money.format(ownedValue)}</strong>
          </span>
          <em>+6.4% this year</em>
        </div>
      </div>

      <div className="collection-tabs" role="tablist" aria-label="Collections">
        {collectionNames.map((name) => {
          const icons = {
            Owned: <Box size={18} />,
            Wishlist: <Heart size={18} />,
            Selling: <CircleDollarSign size={18} />,
          };
          return (
            <button
              key={name}
              role="tab"
              aria-selected={activeCollection === name}
              className={activeCollection === name ? "active" : ""}
              onClick={() => {
                setActiveCollection(name);
                setSearch("");
                setCategory("All");
              }}
            >
              {icons[name]}
              <span>{name}<small>{name === "Selling" ? money.format(sellingValue) : `${collections[name].length} items`}</small></span>
              <b>{collections[name].length}</b>
            </button>
          );
        })}
      </div>

      <div className="collection-toolbar">
        <label className="search-control">
          <Search size={18} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={`Search ${activeCollection.toLowerCase()}`}
            aria-label={`Search ${activeCollection}`}
          />
          {search && <button onClick={() => setSearch("")} aria-label="Clear search"><X size={16} /></button>}
        </label>
        <SelectControl
          label="Category"
          value={category}
          options={["All", ...categories]}
          onChange={(value) => setCategory(value as Category | "All")}
        />
        <SelectControl
          label="Sort"
          value={sort}
          options={["date", "value", "title"]}
          optionLabels={{ date: "Recently added", value: "Highest value", title: "Title A–Z" }}
          onChange={(value) => setSort(value as typeof sort)}
        />
      </div>

      <div className="collection-results-line">
        <strong>{activeCollection}</strong>
        <span>{currentItems.length} {currentItems.length === 1 ? "item" : "items"}</span>
      </div>

      {status === "loading" && <CollectionSkeleton />}
      {status === "error" && <ErrorState message="We couldn’t load your collection." onRetry={retry} />}
      {status === "ready" && currentItems.length === 0 && (
        <EmptyState
          icon={search || category !== "All" ? <Search size={30} /> : <Box size={30} />}
          title={search || category !== "All" ? "No matching items" : `${activeCollection} is empty`}
          message={search || category !== "All" ? "Try another search or clear your category filter." : `Items added to ${activeCollection} will appear here.`}
          action={search || category !== "All" ? "Clear search" : "Browse marketplace"}
          onAction={() => {
            if (search || category !== "All") {
              setSearch("");
              setCategory("All");
            } else {
              window.location.assign("/marketplace");
            }
          }}
        />
      )}
      {status === "ready" && currentItems.length > 0 && (
        <div className="collection-list">
          {currentItems.map((item) => (
            <CollectionRow
              key={item.id}
              item={item}
              source={activeCollection}
              onRemove={() => removeItem(item.id, activeCollection)}
              onMove={(target) => moveItem(item.id, activeCollection, target)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function CollectionRow({
  item,
  source,
  onRemove,
  onMove,
}: {
  item: CollectionItem;
  source: CollectionName;
  onRemove: () => void;
  onMove: (target: CollectionName) => void;
}) {
  return (
    <article className="collection-row">
      <Link to={`/marketplace/${item.id}`} className="collection-thumb">
        <SmartImage src={item.image} alt={item.title} />
      </Link>
      <div className="collection-item-title">
        <span>{item.category}</span>
        <Link to={`/marketplace/${item.id}`}><h3>{item.title}</h3></Link>
        <small>{item.condition} condition</small>
      </div>
      <div className="collection-value">
        <small>Estimated value</small>
        <strong>{money.format(item.estimatedValue)}</strong>
      </div>
      <div className="date-added">
        <small>Added</small>
        <span>{new Date(`${item.dateAdded}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
      </div>
      <label className="move-control">
        <span>Move to</span>
        <select
          value={source}
          onChange={(event) => onMove(event.target.value as CollectionName)}
          aria-label={`Move ${item.title} to another collection`}
        >
          {collectionNames.map((name) => <option key={name} value={name}>{name}</option>)}
        </select>
        <ChevronDown size={15} />
      </label>
      <button className="remove-button" onClick={onRemove} aria-label={`Remove ${item.title}`}>
        <Trash2 size={17} />
      </button>
    </article>
  );
}

function CardSkeleton({ count }: { count: number }) {
  return (
    <div className="product-grid" aria-label="Loading listings" role="status">
      {Array.from({ length: count }).map((_, index) => (
        <div className="skeleton-card" key={index}>
          <div className="skeleton skeleton-image" />
          <div className="skeleton skeleton-line short" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line medium" />
        </div>
      ))}
    </div>
  );
}

function PostSkeleton() {
  return (
    <div className="post-grid" aria-label="Loading community posts" role="status">
      {Array.from({ length: 6 }).map((_, index) => (
        <div className="skeleton-card post-skeleton" key={index}>
          <div className="skeleton skeleton-profile" />
          <div className="skeleton skeleton-image" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line medium" />
        </div>
      ))}
    </div>
  );
}

function CollectionSkeleton() {
  return (
    <div className="collection-list" aria-label="Loading collection" role="status">
      {Array.from({ length: 3 }).map((_, index) => (
        <div className="skeleton-collection" key={index}>
          <div className="skeleton skeleton-square" />
          <div><div className="skeleton skeleton-line" /><div className="skeleton skeleton-line short" /></div>
        </div>
      ))}
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="state-card" role="alert">
      <span className="state-icon"><PackageOpen size={30} /></span>
      <h3>Something went off the shelf</h3>
      <p>{message} Your saved information is safe.</p>
      <button className="primary-button" onClick={onRetry}>Try again</button>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  message,
  action,
  onAction,
}: {
  icon: React.ReactNode;
  title: string;
  message: string;
  action: string;
  onAction: () => void;
}) {
  return (
    <div className="state-card">
      <span className="state-icon">{icon}</span>
      <h3>{title}</h3>
      <p>{message}</p>
      <button className="secondary-button" onClick={onAction}>{action}</button>
    </div>
  );
}

function ToastRegion({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="toast-region" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div className={`toast toast-${toast.tone}`} key={toast.id}>
          {toast.tone === "success" ? <Check size={17} /> : <Sparkles size={17} />}
          {toast.message}
        </div>
      ))}
    </div>
  );
}

function NotFound() {
  return (
    <section className="page-section not-found">
      <span className="state-icon"><Compass size={32} /></span>
      <span className="eyebrow">404 · Lost and found</span>
      <h1>This collectible has wandered off.</h1>
      <p>The page you are looking for may have been moved or is no longer available.</p>
      <Link to="/marketplace" className="primary-button"><Home size={17} /> Return to marketplace</Link>
    </section>
  );
}
