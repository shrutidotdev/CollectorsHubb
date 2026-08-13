import {
  Box,
  CircleDollarSign,
  Heart,
  Search,
  TrendingUp,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  categories,
  type Category,
  type CollectionItem,
  type CollectionName,
} from "../../data";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { useLoadState } from "../../hooks/useLoadState";
import { collectionNames, money } from "../../utils";
import CollectionSkeleton from "../shared/CollectionSkeleton";
import EmptyState from "../shared/EmptyState";
import ErrorState from "../shared/ErrorState";
import SelectControl from "../shared/SelectControl";
import CollectionRow from "./CollectionRow";

export default function CollectionPage({
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
