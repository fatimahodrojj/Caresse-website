export type Service = {
  title: string;
  description: string;
  /** Path under public/ to the service character illustration. */
  image: string;
  /** Colour of the small dot in the card's top-right corner. */
  dot: "pink" | "purple";
};

export type TeamMember = {
  name: string;
  role: string;
  /** Path under public/ to the team photo. */
  photo: string;
  /** Path under public/ to the member's character, or null if not available yet. */
  character: string | null;
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
