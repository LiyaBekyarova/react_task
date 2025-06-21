export interface Review {
    id?: number;
    product_id?: number;
    product_title?: string;
    reviewer_name: string;
    email: string; // Required field
    rating: number;
    review_title?: string;
    comment: string;
    image_url?: string; 
    date: string;
    likes: number;
    dislikes: number;
    userReaction?: "liked" | "disliked" | null; 
    // For form handling
    image?: File | string; // Can be either File (for new uploads) or string (for existing images)
    imageFile?: File; // Temporary storage for file before upload
  }