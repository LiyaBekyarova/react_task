import React from "react";
import { renderDynamicStars } from "../../utils/StarRenderers";
import styles from "./AllReviews.module.css";

interface RatingSummaryProps {
  averageRating: number | string;
  totalReviews: number;
  variantDes?: boolean;
}

export const RatingSummary = ({
  averageRating,
  totalReviews,
  variantDes=false,
}:RatingSummaryProps) => {
  return (
    <div className={styles.ratingSummary}>
      {variantDes ? (
        <div className={styles.ratingStars}>
          {renderDynamicStars(parseFloat(averageRating.toString()))}{" "}
          {averageRating} ( {totalReviews} reviews )
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          <div className={styles.ratingStars}>
            {renderDynamicStars(parseFloat(averageRating.toString()))}{" "}
            {averageRating}
          </div>

          <div className={styles.reviewCount}>
            Based on {totalReviews} reviews
          </div>
        </div>
      )}
    </div>
  );
};
