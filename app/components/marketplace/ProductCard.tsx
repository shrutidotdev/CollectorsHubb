import { ArrowRight, Heart, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import type { Product } from "../../data";
import { money } from "../../utils";
import SmartImage from "../shared/SmartImage";

export default function ProductCard({
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
