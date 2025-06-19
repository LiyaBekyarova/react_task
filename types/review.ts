export interface Review {
    id: number;
    product_id: number;
    product_title: string;
    reviewer_name: string;
    email: string; 
    rating: number;
    review_title?: string;
    comment: string;
    image_url?: string; 
    date: string;
    likes: number;
    dislikes: number;
    userReaction?: "liked" | "disliked" | null; 
    image?: string; 
  }