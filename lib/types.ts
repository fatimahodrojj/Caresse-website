export type Service = {
  /** Translation key under Services.items in messages/*.json. */
  id: "autism" | "speechLanguage" | "neuroDevelopmental" | "feeding" | "familySupport" | "coTherapy";
  /** Path under public/ to the service character illustration. */
  image: string;
  /** Colour of the small dot in the card's top-right corner. */
  dot: "pink" | "purple";
};

/** A shop product. Products are managed in the admin panel and stored in the database. */
export type Product = {
  id: string;
  name: string;
  description: string;
  /** Price in US dollars. */
  price: number;
  /** Image URL (from the admin panel). */
  imageUrl: string;
};
