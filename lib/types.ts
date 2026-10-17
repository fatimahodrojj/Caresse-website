export type Service = {
  /** Translation key under Services.items in messages/*.json. */
  id: "autism" | "speechLanguage" | "neuroDevelopmental" | "feeding" | "familySupport" | "coTherapy";
  /** Path under public/ to the service character illustration. */
  image: string;
  /** Colour of the small dot in the card's top-right corner. */
  dot: "pink" | "purple";
};

export type TeamMember = {
  /** Translation key under Team.members in messages/*.json (name and role). */
  id: "rawan" | "ali" | "mariam";
  /** Path under public/ to the team photo. */
  photo: string;
  /**
   * Optional CSS crop so all photos frame head and shoulders the same way
   * (the image files are not edited).
   */
  photoCrop?: {
    /** CSS object-position, e.g. "50% 21%". */
    position: string;
    /** Zoom factor, e.g. 1.3. */
    zoom: number;
    /** CSS transform-origin for the zoom, e.g. "50% 30%". */
    origin: string;
  };
  /** Path under public/ to the member's character, or null if not available yet. */
  character: string | null;
  /** Colour of the member's profile on /team (photo ring, role, icons, tags). */
  accent: "sky" | "pink" | "purple";
  /** CSS object-position for the wide photo on small screens of /team. */
  profilePhotoPosition?: string;
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
