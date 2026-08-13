import { Bookmark, Heart, MessageCircle, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import type { CommunityPost } from "../../data";
import SmartImage from "../shared/SmartImage";

export default function PostCard({
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
