import { MessageCircle, Search, Users, X } from "lucide-react";
import { useMemo, useState } from "react";
import { categories, communityPosts, type Category } from "../../data";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { useLoadState } from "../../hooks/useLoadState";
import EmptyState from "../shared/EmptyState";
import ErrorState from "../shared/ErrorState";
import PostSkeleton from "../shared/PostSkeleton";
import PostCard from "./PostCard";

export default function CommunityPage({
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
