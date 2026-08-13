import { ChevronDown, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { CollectionItem, CollectionName } from "../../data";
import { collectionNames, money } from "../../utils";
import SmartImage from "../shared/SmartImage";

export default function CollectionRow({
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
