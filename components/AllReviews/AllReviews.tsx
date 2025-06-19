import { Review } from "@/types/review";
import React, { useState, useMemo, useEffect } from "react";
interface AllReviewsProps {
  reviews: Review[];
  onLeaveReview: () => void;
  onReviewReaction: (updatedReview: Review) => void;
}

const AllReviews: React.FC<AllReviewsProps> = ({
  reviews: initialReviews,
  onLeaveReview,
  onReviewReaction,
}) => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews || []);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState<string>("highest-rating");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const reviewsPerPage: number = 10;

  useEffect(() => {
    if (initialReviews !== reviews) {
      setReviews(initialReviews || []);
      setCurrentPage(1);
    }
  }, [initialReviews, reviews]);

  const handleReaction = (
    reviewId: number,
    reactionType: "like" | "dislike"
  ) => {
    setReviews((prevReviews) => {
      const updatedReviews = prevReviews.map((review) => {
        if (review.id !== reviewId) return review;

        const updatedReview = { ...review }; 

        if (reactionType === "like") {
          if (updatedReview.userReaction === "liked") {
            updatedReview.likes = Math.max(0, updatedReview.likes - 1);
            updatedReview.userReaction = null;
          } else {
            if (updatedReview.userReaction === "disliked") {
              updatedReview.dislikes = Math.max(0, updatedReview.dislikes - 1);
            }
            updatedReview.likes += 1;
            updatedReview.userReaction = "liked";
          }
        } else {
          if (updatedReview.userReaction === "disliked") {
            updatedReview.dislikes = Math.max(0, updatedReview.dislikes - 1);
            updatedReview.userReaction = null;
          } else {
            if (updatedReview.userReaction === "liked") {
              updatedReview.likes = Math.max(0, updatedReview.likes - 1);
            }
            updatedReview.dislikes += 1;
            updatedReview.userReaction = "disliked";
          }
        }

        onReviewReaction(updatedReview);

        return updatedReview;
      });
      return updatedReviews;
    });
  };

  const filteredAndSortedReviews = useMemo(() => {
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
        sorted.sort((a, b) => b.rating - a.rating); 
        break;
      case "most-helpful":
        sorted.sort((a, b) => b.likes - a.likes);
        break;
      default:
        sorted.sort((a, b) => b.rating - a.rating); 
        break;
    }
    return sorted;
  }, [reviews, filterRating, sortOption]);

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredAndSortedReviews.slice(
    indexOfFirstReview,
    indexOfLastReview
  );

  const totalPages = Math.ceil(
    filteredAndSortedReviews.length / reviewsPerPage
  );

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  useEffect(() => {
    setCurrentPage(1);
  }, [filterRating, sortOption]);

  if (!reviews || reviews.length === 0) {
    return (
      <div
        style={{
          padding: "20px",
          fontFamily: "Arial, sans-serif",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          maxWidth: "900px",
          margin: "20px auto",
        }}
      >
        No reviews available yet. Be the first to leave one!
        <button
          onClick={onLeaveReview}
          style={{
            backgroundColor: "#a34a2e",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "1rem",
            marginLeft: "auto",
            display: "block",
            marginTop: "15px",
          }}
        >
          Leave a review
        </button>
      </div>
    );
  }

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

  const renderStaticStars = (numStars: number) => {
    return (
      <div style={{ display: "flex", minWidth: "80px" }}>
        {[...Array(numStars)].map((_, i) => (
          <span
            key={`star-${numStars}-${i}`}
            style={{ color: "gold", fontSize: "1rem" }}
          >
            ★
          </span>
        ))}
        {[...Array(5 - numStars)].map((_, i) => (
          <span
            key={`empty-star-${numStars}-${i}`}
            style={{ color: "lightgray", fontSize: "1rem" }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const renderDynamicStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div style={{ display: "flex" }}>
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} style={{ color: "gold", fontSize: "1.5rem" }}>
            ★
          </span>
        ))}
        {hasHalfStar && (
          <span style={{ color: "gold", fontSize: "1.5rem" }}>★</span>
        )}{" "}
        {/* Use gold for half star if it's part of the rating */}
        {[...Array(emptyStars)].map((_, i) => (
          <span
            key={`empty-${i}`}
            style={{ color: "lightgray", fontSize: "1.5rem" }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="all-reviews-wrapper">
    <div className="all-reviews-header">
      <div className="rating-summary">
        <div className="rating-stars">
            {renderDynamicStars(parseFloat(averageRating))}
            <span style={{ fontSize: "1.8rem", fontWeight: "bold" }}>
              {averageRating}
            </span>
          </div>
          <div style={{ color: "#666", fontSize: "0.9rem" }}>
            Based on {totalReviews} reviews
          </div>
        </div>

        <div className="rating-breakdown">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingCounts[star];
            const percentage =
              totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            return (
              <div
                key={star}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "5px",
                  cursor: "pointer",
                  fontWeight: filterRating === star ? "bold" : "normal",
                }}
                onClick={() =>
                  setFilterRating(filterRating === star ? null : star)
                }
              >
                {renderStaticStars(star)}
                <div
                  style={{
                    flexGrow: 1,
                    height: "8px",
                    backgroundColor: "#e0e0e0",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${percentage}%`,
                      height: "100%",
                      backgroundColor: "#a34a2e",
                      borderRadius: "4px",
                    }}
                  ></div>
                </div>
                <span
                  style={{
                    minWidth: "30px",
                    textAlign: "right",
                    fontSize: "0.9rem",
                  }}
                >
                  {count}
                </span>
              </div>
            );
          })}
          <button
            onClick={() => setFilterRating(null)}
            style={{
              marginTop: "10px",
              padding: "5px 10px",
              border: "1px solid #a34a2e",
              borderRadius: "5px",
              backgroundColor: filterRating === null ? "#a34a2e" : "white",
              color: filterRating === null ? "white" : "#a34a2e",
              cursor: "pointer",
              fontSize: "0.85rem",
              fontWeight: "bold",
            }}
          >
            Show All Ratings
          </button>
        </div>

        <div style={{ flex: "0 0 auto", alignSelf: "center" }}>
          <button
            onClick={onLeaveReview}
            style={{
              backgroundColor: "#a34a2e",
              color: "white",
              border: "none",
              padding: "12px 25px",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "bold",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#8c3d26")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#a34a2e")
            }
          >
            Leave a review
          </button>
        </div>
      </div>

      <hr
        style={{
          border: "none",
          borderTop: "1px solid #eee",
          margin: "20px 0",
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <h3 style={{ margin: 0 }}>Customer Reviews</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "0.9rem", color: "#666" }}>Sort by:</span>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              fontSize: "0.9rem",
              cursor: "pointer",
              backgroundColor: "white",
              minWidth: "150px",
            }}
          >
            <option value="highest-rating">Highest Rating</option>
            <option value="lowest-rating">Lowest Rating</option>
            <option value="only-pictures">Only Pictures</option>
            <option value="most-helpful">Most Helpful</option>
          </select>
        </div>
      </div>

      {filteredAndSortedReviews.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666", marginTop: "20px" }}>
          No reviews match your current filter/sort selection.
        </p>
      ) : (
        <>
          {currentReviews.map((review, index) => (
            <div
              key={review.id || `review-${review.product_id}-${index}`}
              style={{
                borderBottom: "1px solid #eee",
                paddingBottom: "15px",
                marginBottom: "15px",
              }}
            >
              {review.review_title && (
                <h4 style={{ margin: "5px 0", color: "#333" }}>
                  {review.review_title}
                </h4>
              )}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                {renderDynamicStars(review.rating)}
                {review.product_title && (
                  <span style={{ marginLeft: "10px", fontWeight: "bold" }}>
                    {review.product_title}
                  </span>
                )}
              </div>
              <p style={{ margin: "5px 0", color: "#333" }}>
                &quot;{review.comment}&quot;
              </p>
              {review.image_url && (
                <div style={{ marginTop: "10px" }}>
                  <img
                    src={review.image_url}
                    alt="Review"
                    style={{
                      maxWidth: "100px",
                      maxHeight: "100px",
                      borderRadius: "5px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "10px",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                <div style={{ fontSize: "0.9em", color: "#888" }}>
                  Reviewed by {review.reviewer_name} on {review.date}
                </div>
                <div style={{ display: "flex", gap: "15px" }}>
                  <button
                    onClick={() => handleReaction(review.id!, "like")}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      color:
                        review.userReaction === "liked" ? "#2e7d32" : "#666",
                    }}
                  >
                    <span style={{ fontSize: "1.2rem" }}>👍</span>
                    <span>{review.likes}</span>
                  </button>
                  <button
                    onClick={() => handleReaction(review.id!, "dislike")}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      color:
                        review.userReaction === "disliked" ? "#d32f2f" : "#666",
                    }}
                  >
                    <span style={{ fontSize: "1.2rem" }}>👎</span>
                    <span>{review.dislikes}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {totalPages > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "20px",
                gap: "10px",
              }}
            >
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  padding: "8px 15px",
                  borderRadius: "5px",
                  border: "1px solid #a34a2e",
                  backgroundColor: currentPage === 1 ? "#e0e0e0" : "#a34a2e",
                  color: currentPage === 1 ? "#666" : "white",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                }}
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => paginate(index + 1)}
                  style={{
                    padding: "8px 15px",
                    borderRadius: "5px",
                    border:
                      currentPage === index + 1
                        ? "1px solid #a34a2e"
                        : "1px solid #ccc",
                    backgroundColor:
                      currentPage === index + 1 ? "#a34a2e" : "white",
                    color: currentPage === index + 1 ? "white" : "#a34a2e",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    fontWeight: "bold",
                  }}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  padding: "8px 15px",
                  borderRadius: "5px",
                  border: "1px solid #a34a2e",
                  backgroundColor:
                    currentPage === totalPages ? "#e0e0e0" : "#a34a2e",
                  color: currentPage === totalPages ? "#666" : "white",
                  cursor:
                    currentPage === totalPages ? "not-allowed" : "pointer",
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllReviews;
