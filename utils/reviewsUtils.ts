import { Review } from "@/types/review";

/**
 * Calculates the updated review object based on a like/dislike reaction.
 * @param review The original review object.
 * @param reactionType 'like' or 'dislike'.
 * @returns The updated review object.
 */
export const updateReviewReaction = (review: Review, reactionType: "like" | "dislike"): Review => {
  const updatedReview = { ...review };

  if (reactionType === "like") {
    if (updatedReview.userReaction === "liked") {
      updatedReview.likes = Math.max(0, updatedReview.likes - 1);
      updatedReview.userReaction = null;
    } else {
      if (updatedReview.userReaction === "disliked") {
        updatedReview.dislikes = Math.max(0, updatedReview.dislikes - 1);
      }
      updatedReview.likes = (updatedReview.likes || 0) + 1; // Ensure likes is initialized
      updatedReview.userReaction = "liked";
    }
  } else { // reactionType === "dislike"
    if (updatedReview.userReaction === "disliked") {
      updatedReview.dislikes = Math.max(0, updatedReview.dislikes - 1);
      updatedReview.userReaction = null;
    } else {
      if (updatedReview.userReaction === "liked") {
        updatedReview.likes = Math.max(0, updatedReview.likes - 1);
      }
      updatedReview.dislikes = (updatedReview.dislikes || 0) + 1; // Ensure dislikes is initialized
      updatedReview.userReaction = "disliked";
    }
  }

  return updatedReview;
};

/**
 * Filters and sorts a list of reviews.
 * @param reviews The array of reviews to filter and sort.
 * @param filterRating The rating to filter by (null for no filter).
 * @param sortOption The sorting option ('highest-rating', 'lowest-rating', 'only-pictures', 'most-helpful').
 * @returns The filtered and sorted array of reviews.
 */
export const getFilteredAndSortedReviews = (
  reviews: Review[],
  filterRating: number | null,
  sortOption: string
): Review[] => {
  let filtered = reviews;

  if (filterRating !== null) {
    filtered = filtered.filter((review) => review.rating === filterRating);
  }

  let sorted = [...filtered];

  switch (sortOption) {
    case "highest-rating":
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    case "lowest-rating":
      sorted.sort((a, b) => a.rating - b.rating);
      break;
    case "only-pictures":
      sorted = sorted.filter((review) => review.image_url);
      sorted.sort((a, b) => b.rating - a.rating); // Still sort by rating for pictures
      break;
    case "most-helpful":
      sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0)); // Ensure likes are numbers
      break;
    default:
      sorted.sort((a, b) => b.rating - a.rating);
      break;
  }
  return sorted;
};

/**
 * Calculates pagination details for reviews.
 * @param totalReviewsCount The total number of reviews.
 * @param reviewsPerPage The number of reviews to display per page.
 * @param currentPage The current page number.
 * @returns An object containing pagination info (current reviews slice, total pages, start/end indices).
 */
interface PaginationInfo {
  currentItems: Review[];
  totalPages: number;
  indexOfFirstItem: number;
  indexOfLastItem: number;
}

export const getPaginationInfo = (
  items: Review[],
  reviewsPerPage: number, 
  currentPage: number
): PaginationInfo => {
  const indexOfLastItem = currentPage * reviewsPerPage;
  const indexOfFirstItem = indexOfLastItem - reviewsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(items.length / reviewsPerPage);

  return { currentItems, totalPages, indexOfFirstItem, indexOfLastItem };
};

/**
 * Calculates average rating and rating distribution.
 * @param reviews The array of reviews.
 * @returns An object containing averageRating (string) and ratingCounts (object).
 */
interface ReviewStats {
  averageRating: string;
  totalReviews: number;
  ratingCounts: { [key: number]: number };
}

export const getReviewStats = (reviews: Review[]): ReviewStats => {
  const totalReviews = reviews.length;
  const sumRatings = reviews.reduce((acc, review) => acc + review.rating, 0);
  const averageRating =
    totalReviews > 0 ? (sumRatings / totalReviews).toFixed(1) : "0.0";

  const ratingCounts: { [key: number]: number } = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };
  reviews.forEach((review) => {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingCounts[review.rating]++;
    }
  });

  return { averageRating, totalReviews, ratingCounts };
};

