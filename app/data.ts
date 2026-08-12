export type Category =
  | "Cameras"
  | "Sneakers"
  | "Music"
  | "Watches"
  | "Gaming"
  | "Comics"
  | "Stamps"
  | "Toys";

export type Condition = "Mint" | "Excellent" | "Good" | "Fair";
export type CollectionName = "Owned" | "Wishlist" | "Selling";

export type Product = {
  id: number;
  title: string;
  category: Category;
  condition: Condition;
  price: number;
  seller: string;
  sellerRating: number;
  location: string;
  image?: string;
  year: string;
  description: string;
  postedAt: string;
  featured?: boolean;
};

export type CommunityPost = {
  id: number;
  user: string;
  handle: string;
  initials: string;
  avatarColor: string;
  image?: string;
  caption: string;
  category: Category;
  likes: number;
  comments: number;
  timeAgo: string;
  tags: string[];
};

export type CollectionItem = Product & {
  dateAdded: string;
  estimatedValue: number;
};

const images = {
  camera:
    "https://images.unsplash.com/photo-1625061661591-14d9e67e1ee7?auto=format&fit=crop&w=1200&q=85",
  sneaker:
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=85",
  vinyl:
    "https://images.unsplash.com/photo-1672073314527-cd2d83182992?auto=format&fit=crop&w=1200&q=85",
  watch:
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85",
  gameboy:
    "https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?auto=format&fit=crop&w=1200&q=85",
  comic:
    "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&w=1200&q=85",
  toy:
    "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=1200&q=85",
  typewriter:
    "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=85",
};

export const categories: Category[] = [
  "Cameras",
  "Sneakers",
  "Music",
  "Watches",
  "Gaming",
  "Comics",
  "Stamps",
  "Toys",
];

export const products: Product[] = [
  {
    id: 1,
    title: "Canon AE-1 Program",
    category: "Cameras",
    condition: "Excellent",
    price: 245,
    seller: "Maya Thompson",
    sellerRating: 4.9,
    location: "Portland, OR",
    image: images.camera,
    year: "1981",
    description:
      "A beautifully preserved Canon AE-1 Program with a clean 50mm f/1.8 lens. The light meter is accurate, shutter speeds are crisp, and the seals were replaced last year.",
    postedAt: "2026-08-10T09:30:00Z",
    featured: true,
  },
  {
    id: 2,
    title: "Air Jordan 1 Retro High",
    category: "Sneakers",
    condition: "Mint",
    price: 320,
    seller: "Noah Williams",
    sellerRating: 4.8,
    location: "Brooklyn, NY",
    image: images.sneaker,
    year: "2020",
    description:
      "Deadstock pair with original box, extra laces, and receipt. Stored in a climate-controlled room away from direct sunlight.",
    postedAt: "2026-08-12T06:15:00Z",
  },
  {
    id: 3,
    title: "Blue Note First Pressing",
    category: "Music",
    condition: "Good",
    price: 185,
    seller: "Elena Rossi",
    sellerRating: 5,
    location: "Austin, TX",
    image: images.vinyl,
    year: "1964",
    description:
      "Original mono pressing with deep groove labels. Light sleeve wear and a few quiet surface marks, but a rich and lively playback.",
    postedAt: "2026-08-09T15:40:00Z",
  },
  {
    id: 4,
    title: "Apollo 11 Stamp Block",
    category: "Stamps",
    condition: "Mint",
    price: 78,
    seller: "Arthur Bell",
    sellerRating: 4.7,
    location: "Boston, MA",
    year: "1969",
    description:
      "Never-hinged block of four commemorating the first moon landing. Strong color, intact gum, and clean perforations.",
    postedAt: "2026-08-11T12:05:00Z",
  },
  {
    id: 5,
    title: "Omega Seamaster De Ville",
    category: "Watches",
    condition: "Excellent",
    price: 1290,
    seller: "Theo Laurent",
    sellerRating: 4.9,
    location: "Chicago, IL",
    image: images.watch,
    year: "1966",
    description:
      "Classic automatic Seamaster with an original silver dial and recently serviced movement. Includes a period-correct leather strap.",
    postedAt: "2026-08-08T18:20:00Z",
  },
  {
    id: 6,
    title: "Nintendo Game Boy DMG-01",
    category: "Gaming",
    condition: "Good",
    price: 145,
    seller: "Jamie Chen",
    sellerRating: 4.8,
    location: "Seattle, WA",
    image: images.gameboy,
    year: "1989",
    description:
      "Original grey Game Boy in working condition with a crisp display and clean battery compartment. Includes Tetris and a protective case.",
    postedAt: "2026-08-12T03:50:00Z",
  },
  {
    id: 7,
    title: "The Amazing Spider-Man #129",
    category: "Comics",
    condition: "Good",
    price: 560,
    seller: "Marcus Reed",
    sellerRating: 4.9,
    location: "Atlanta, GA",
    image: images.comic,
    year: "1974",
    description:
      "Key Bronze Age issue featuring the first appearance of the Punisher. Complete, flat, and stored in an archival sleeve with a fresh board.",
    postedAt: "2026-08-07T14:10:00Z",
  },
  {
    id: 8,
    title: "Space Explorer Brick Set",
    category: "Toys",
    condition: "Excellent",
    price: 210,
    seller: "Priya Shah",
    sellerRating: 5,
    location: "San Jose, CA",
    image: images.toy,
    year: "1992",
    description:
      "A complete vintage space exploration set with instructions and minifigures. Pieces are clean with only minimal play wear.",
    postedAt: "2026-08-06T10:25:00Z",
  },
];

export const communityPosts: CommunityPost[] = [
  {
    id: 101,
    user: "Mia Carter",
    handle: "@mia.collects",
    initials: "MC",
    avatarColor: "#b85c38",
    image: images.typewriter,
    caption:
      "Found this wonderfully stubborn Olivetti at a Sunday market. Two hours of cleaning later, every key sings again.",
    category: "Cameras",
    likes: 248,
    comments: 31,
    timeAgo: "2h",
    tags: ["vintagefind", "typewriter"],
  },
  {
    id: 102,
    user: "Jon Bell",
    handle: "@needle.drop",
    initials: "JB",
    avatarColor: "#3f6a61",
    image: images.vinyl,
    caption:
      "The tiny crackle before the first note might be my favorite part. Today’s desk rotation: a near-mint jazz pressing.",
    category: "Music",
    likes: 412,
    comments: 46,
    timeAgo: "4h",
    tags: ["nowspinning", "vinylcommunity"],
  },
  {
    id: 103,
    user: "Aarav Mehta",
    handle: "@sole.archive",
    initials: "AM",
    avatarColor: "#37577a",
    image: images.sneaker,
    caption:
      "Finally completed the color story I have been building for a year. The red pair was worth the wait.",
    category: "Sneakers",
    likes: 689,
    comments: 72,
    timeAgo: "6h",
    tags: ["sneakerwall", "grail"],
  },
  {
    id: 104,
    user: "Sofia Reyes",
    handle: "@sixteen.frames",
    initials: "SR",
    avatarColor: "#86713d",
    image: images.camera,
    caption:
      "My grandfather’s camera, restored and loaded with film for the first time in twenty years. Some objects keep memories before taking new ones.",
    category: "Cameras",
    likes: 931,
    comments: 88,
    timeAgo: "Yesterday",
    tags: ["filmisnotdead", "heirloom"],
  },
  {
    id: 105,
    user: "Lucas Park",
    handle: "@pixel.past",
    initials: "LP",
    avatarColor: "#7c4f74",
    image: images.gameboy,
    caption:
      "Fresh screen lens, careful clean, and a long Tetris session. This little brick still has magic.",
    category: "Gaming",
    likes: 376,
    comments: 39,
    timeAgo: "Yesterday",
    tags: ["retrogaming", "gameboy"],
  },
  {
    id: 106,
    user: "Nina Brooks",
    handle: "@panels.and.ink",
    initials: "NB",
    avatarColor: "#9c493f",
    image: images.comic,
    caption:
      "Rebagging day is strangely therapeutic. This issue is the centerpiece of my Bronze Age shelf.",
    category: "Comics",
    likes: 527,
    comments: 54,
    timeAgo: "2d",
    tags: ["comiccollector", "bronzeage"],
  },
];

function toCollectionItem(product: Product, dateAdded: string, value: number) {
  return { ...product, dateAdded, estimatedValue: value };
}

export const initialCollections: Record<CollectionName, CollectionItem[]> = {
  Owned: [
    toCollectionItem(products[0], "2026-07-24", 268),
    toCollectionItem(products[2], "2026-06-18", 205),
    toCollectionItem(products[6], "2026-05-02", 610),
  ],
  Wishlist: [toCollectionItem(products[1], "2026-08-01", 335)],
  Selling: [
    toCollectionItem(products[5], "2026-07-11", 155),
    toCollectionItem(products[7], "2026-04-29", 225),
  ],
};
