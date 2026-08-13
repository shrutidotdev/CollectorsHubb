import {
  ArrowRight,
  LayoutGrid,
  List,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";
import { Link } from "react-router-dom";
import {
  categories,
  products,
  type Category,
  type CollectionItem,
  type CollectionName,
  type Condition,
  type Product,
} from "../../data";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { useLoadState } from "../../hooks/useLoadState";
import type { MarketFilters, Toast } from "../../types";
import { conditions, money } from "../../utils";
import CardSkeleton from "../shared/CardSkeleton";
import EmptyState from "../shared/EmptyState";
import ErrorState from "../shared/ErrorState";
import SelectControl from "../shared/SelectControl";
import SmartImage from "../shared/SmartImage";
import ProductCard from "./ProductCard";

export default function MarketplacePage({
  collections,
  addToCollection,
  filters,
  setFilters,
}: {
  collections: Record<CollectionName, CollectionItem[]>;
  addToCollection: (product: Product, target: CollectionName) => void;
  notify: (message: string, tone?: Toast["tone"]) => void;
  filters: MarketFilters;
  setFilters: Dispatch<SetStateAction<MarketFilters>>;
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
