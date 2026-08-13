import {
  ArrowLeft,
  Box,
  Check,
  Heart,
  MapPin,
  ShieldCheck,
  Star,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { products, type CollectionItem, type CollectionName, type Product } from "../../data";
import type { Toast } from "../../types";
import { money } from "../../utils";
import NotFound from "../layout/NotFound";
import SmartImage from "../shared/SmartImage";

export default function ProductDetails({
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
