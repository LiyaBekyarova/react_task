import { Review } from '@/types/review';

export interface ReviewFormData extends Omit<Review, 'image_url' | 'image'> {
  image_url?: string;
  imageFile?: File;
}

export const validateReviewForm = (formData: ReviewFormData): boolean => {
  return (
    formData.reviewer_name.trim() !== '' &&
    formData.email.trim() !== '' &&
    formData.rating > 0 &&
    formData.comment.trim() !== ''
  );
};
export const createNewReview = (formData: ReviewFormData, productId: number, productName: string): Review => {
  const newReview: Review = {
    reviewer_name: formData.reviewer_name.trim(),
    email: formData.email.trim(),
    rating: formData.rating,
    comment: formData.comment.trim(),
    // Тези полета идват от formData, но за reviewFormUtils трябва да ги добавим:
    date: new Date().toISOString().split('T')[0], // Датата се генерира тук, не идва от formData директно
    likes: 0,
    dislikes: 0,
    userReaction: null,
    id: Date.now(), // Генерира се тук
    product_id: productId,
    product_title: productName,
    image_url: formData.image_url,
    // image: formData.image_url ? formData.image_url : undefined, // Ако искаш и 'image' полето, което може да е string (base64)
  };

  if (formData.review_title && formData.review_title.trim()) {
    newReview.review_title = formData.review_title.trim();
  }

  return newReview;
};

/**
 * Returns the initial state for the review form data.
 * @param productId The ID of the product.
 * @param productName The name of the product.
 * @returns An object representing the initial form state.
 */
export const getInitialReviewFormData = (productId: number, productName: string): ReviewFormData => ({
  reviewer_name: '',
  email: '',
  rating: 0,
  review_title: '',
  comment: '',
  // Тези полета трябва да бъдат включени, тъй като ReviewFormData ги разширява от Review
  date: '', // Ще бъде презаписана при submit
  likes: 0,
  dislikes: 0,
  userReaction: null,
  id: 0,
  product_id: productId,
  product_title: productName,
  image_url: undefined,
  imageFile: undefined,
});