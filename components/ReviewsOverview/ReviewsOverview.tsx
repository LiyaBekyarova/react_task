import React, { useState } from "react";
import styles from "./ReviewsOverview.module.css";
import AllReviews from "../AllReviews/AllReviews";
import ReviewModal from "../ReviewFormModal/ReviewFormModal";
import { Review } from "@/types/review";



interface ReviewsOverviewProps {
  reviews: Review[];
  onReviewReaction: (updatedReview: Review) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onReviewSubmit: (reviewData: any) => void;
  productId?: number;
}
export const ReviewsOverview = ({
  reviews,
  productId,
  onReviewSubmit,
  onReviewReaction
}: ReviewsOverviewProps) => {
  const [showModal, setShowModal] = useState(false);
  
  const handleReviewSubmit = (reviewData: Review) => {
    console.log('Submitting review from modal:', reviewData);
    try {
      onReviewSubmit(reviewData);
      setShowModal(false);
    } catch (error) {
      console.error('Error in review submission:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headingContainer}>
        <p className={styles.p}>Customer reviews</p>
      </div>
      <div className={styles.reviewContainer}>
        <AllReviews
          onReviewReaction={onReviewReaction}
          reviews={reviews}
          onLeaveReview={() => setShowModal(true)}
        />
      </div>
      <div>
        <ReviewModal
          productId={productId}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleReviewSubmit}
          productName={reviews[0]?.product_title}
          key={showModal ? 'open' : 'closed'} 
        />
      </div>
    </div>
  );
};
