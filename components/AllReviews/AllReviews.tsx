import { Review } from "@/types/review";
import React, { useState, useMemo, useEffect } from "react";
import styles from "./AllReviews.module.css";
import {
  updateReviewReaction,
  getFilteredAndSortedReviews,
  getPaginationInfo,
  getReviewStats,
} from "@/utils/reviewsUtils";
import { RatingSummary } from "./RatingSummary";
import { RatingBreakdown } from "./RatingBreakdown";
import { Pagination } from "./Pagination";
import { ReviewCard } from "./ReviewCard";

interface AllReviewsProps {
  reviews: Review[];
  onLeaveReview: () => void;
  onReviewReaction: (updatedReview: Review) => void;
}

const AllReviews = ({
  reviews: initialReviews,
  onLeaveReview,
  onReviewReaction,
}: AllReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews || []);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState<string>("highest-rating");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const reviewsPerPage: number = 10;

  useEffect(() => {
    if (JSON.stringify(initialReviews) !== JSON.stringify(reviews)) {
      setReviews(initialReviews || []);
      setCurrentPage(1);
    }
  }, [initialReviews, reviews]);

  const handleReaction = (
    reviewId: string | number,
    reactionType: "like" | "dislike"
  ) => {
    if (reviewId === undefined || reviewId === null) return;
    
    setReviews((prevReviews) => {
      const reviewIdStr = String(reviewId);
      const updatedReviews = prevReviews.map((review) => {
        if (String(review.id) !== reviewIdStr) return review;
        const updatedReview = updateReviewReaction(review, reactionType);
        onReviewReaction(updatedReview);
        return updatedReview;
      });
      return updatedReviews;
    });
  };

  const filteredAndSortedReviews = useMemo(() => {
    return getFilteredAndSortedReviews(reviews, filterRating, sortOption);
  }, [reviews, filterRating, sortOption]);

  const { currentItems: currentReviews, totalPages } = getPaginationInfo(
    filteredAndSortedReviews,
    reviewsPerPage,
    currentPage
  );

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filterRating, sortOption]);

  const { averageRating, totalReviews, ratingCounts } = getReviewStats(reviews);

  if (!reviews || reviews.length === 0) {
    return (
      <div
      className={styles.noReviewsContainer}
      >
        <p>No reviews available yet. Be the first to leave one!</p>
        <hr className={styles.hr} />

        <button onClick={onLeaveReview} className={styles.reviewButton}>
          Leave a review
        </button>
      </div>
    );
  }

  return (
    <div className={styles.allReviewsWrapper}>
      <div className={styles.allReviewsHeader}>
        <RatingSummary
          averageRating={averageRating}
          totalReviews={totalReviews}
        />

        <RatingBreakdown
          ratingCounts={ratingCounts}
          totalReviews={totalReviews}
          filterRating={filterRating}
          onFilterChange={setFilterRating}
        />

        <button onClick={onLeaveReview} className={styles.reviewButton}>
          Leave a review
        </button>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "20px 0",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            style={{ fontSize: "0.9rem", color: "#666", fontWeight: "bold" }}
          >
            Sort by:
          </span>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            style={{
              cursor: "pointer",
              border: "none",
              outline: "none",
              backgroundColor: "transparent",
              fontSize: "14px",
            }}
          >
            <option value="highest-rating">Highest Rating</option>
            <option value="lowest-rating">Lowest Rating</option>
            <option value="only-pictures">Only Pictures</option>
            <option value="most-helpful">Most Helpful</option>
          </select>
        </div>
      </div>
      <hr className={styles.hr} />
      {filteredAndSortedReviews.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666", marginTop: "20px" }}>
          No reviews match your current filter selection.
        </p>
      ) : (
        <>
          {currentReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onReaction={handleReaction}
            />
          ))}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={paginate}
          />
        </>
      )}
    </div>
  );
};

export default AllReviews;
