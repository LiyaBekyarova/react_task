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
}
export const ReviewsOverview = ({
  reviews,
  onReviewSubmit,
  onReviewReaction
}: ReviewsOverviewProps) => {
  const [showModal, setShowModal] = useState(false);

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
