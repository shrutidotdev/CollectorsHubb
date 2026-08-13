import { ArrowLeft, Bookmark, Heart } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { communityPosts } from "../../data";
import NotFound from "../layout/NotFound";
import SmartImage from "../shared/SmartImage";

export default function PostDetails({
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
