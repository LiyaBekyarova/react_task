import React, { useState } from "react";
import styles from "./ReviewsOverview.module.css";
import AllReviews from "../AllReviews/AllReviews";
import ReviewModal from "../ReviewFormModal/ReviewFormModal";

export interface Review {
  id: number;
  product_id: number;
  product_title: string;
  reviewer_name: string;
  email: string;
  rating: number;
  review_title: string;
  comment: string;
  image_url?: string;
  date: string;
  likes: number;
  dislikes: number;
  userReaction?: "liked" | "disliked" | null;
}

interface ReviewsOverviewProps {
  reviews: Review[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onReviewSubmit: (reviewData: any) => void;
}
export const ReviewsOverview = ({
  reviews,
  onReviewSubmit,
}: ReviewsOverviewProps) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.headingContainer}>
        <p className={styles.p}>Customer reviews</p>
      </div>
      <div className={styles.reviewContainer}>
        <AllReviews
          reviews={reviews}
          onLeaveReview={() => setShowModal(true)}
        />
      </div>
      <div>
        <ReviewModal
          productId={reviews[0]?.product_id}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={onReviewSubmit}
          productName={reviews[0]?.product_title}
        />
      </div>
    </div>
  );
};
