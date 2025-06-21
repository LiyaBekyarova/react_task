import React from "react";
import { Review } from "@/types/review";
import { renderDynamicStars } from "@/utils/StarRenderers";
import styles from "./AllReviews.module.css";
interface ReviewCardProps {
  review: Review;
  onReaction: (reviewId: string | number, reaction: "like" | "dislike") => void;
}

export const ReviewCard = ({
  review,
  onReaction,
}:ReviewCardProps) => {
  return (
    <div
      style={{
        borderBottom: "1px solid #eee",
        paddingBottom: "20px",
        marginBottom: "20px",
        display: "flex",
        gap: "15px",
      }}
    >
      <div className={styles.reviewerInfo}>
        <div>{renderDynamicStars(review.rating)}</div>
        <div
          style={{
            fontWeight: "bold",
            color: "#333",
            fontSize: "0.95em",
          }}
        >
          {review.reviewer_name}
        </div>
        <div
          style={{
            fontSize: "0.85em",
            color: "#888",
          }}
        >
          {review.date}
        </div>
      </div>

      <div style={{ flex: 1 }}>
        {review.review_title && (
          <h4
            style={{
              margin: "0 0 8px 0",
              color: "#333",
              fontSize: "1.1em",
              fontWeight: "bold",
            }}
          >
            {review.review_title}
          </h4>
        )}

        <p
          style={{
            margin: "0 0 12px 0",
            color: "#333",
            lineHeight: "1.4",
          }}
        >
          {review.comment}
        </p>

        {review.image_url && (
          <div style={{ marginBottom: "15px" }}>
            <img
              src={review.image_url}
              alt="Review"
              width={100}
              height={100}
              style={{
                maxWidth: "120px",
                maxHeight: "120px",
                objectFit: "cover",
              }}
            />
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            marginTop: "15px",
            gap: "15px",
          }}
        >
          <span
            style={{
              fontSize: "0.9em",
              color: "#666",
            }}
          >
            Was this helpful?
          </span>
          <button
            onClick={() => onReaction(review.id!, "like")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              color: review.userReaction === "liked" ? "#2e7d32" : "#1C1B1F",
            }}
          >
            <svg
              width="21"
              height="21"
              viewBox="0 0 21 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 20.2849H5V7.28491L12 0.284912L13.25 1.53491C13.3667 1.65158 13.4625 1.80991 13.5375 2.00991C13.6125 2.20991 13.65 2.40158 13.65 2.58491V2.93491L12.55 7.28491H19C19.5333 7.28491 20 7.48491 20.4 7.88491C20.8 8.28491 21 8.75158 21 9.28491V11.2849C21 11.4016 20.9833 11.5266 20.95 11.6599C20.9167 11.7932 20.8833 11.9182 20.85 12.0349L17.85 19.0849C17.7 19.4182 17.45 19.7016 17.1 19.9349C16.75 20.1682 16.3833 20.2849 16 20.2849ZM7 18.2849H16L19 11.2849V9.28491H10L11.35 3.78491L7 8.13491V18.2849ZM5 7.28491V9.28491H2V18.2849H5V20.2849H0V7.28491H5Z"
                fill="currentColor"
              />
            </svg>
            <span>{review.likes}</span>
          </button>
          <button
            onClick={() => onReaction(review.id!, "dislike")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              color: review.userReaction === "disliked" ? "#d32f2f" : "#1C1B1F",
            }}
          >
            <svg
              width="21"
              height="21"
              viewBox="0 0 21 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 0.284912H16V13.2849L9 20.2849L7.75 19.0349C7.63333 18.9182 7.5375 18.7599 7.4625 18.5599C7.3875 18.3599 7.35 18.1682 7.35 17.9849V17.6349L8.45 13.2849H2C1.46667 13.2849 1 13.0849 0.6 12.6849C0.2 12.2849 0 11.8182 0 11.2849V9.28491C0 9.16825 0.0166667 9.04325 0.05 8.90991C0.0833333 8.77658 0.116667 8.65158 0.15 8.53491L3.15 1.48491C3.3 1.15158 3.55 0.868245 3.9 0.634912C4.25 0.401579 4.61667 0.284912 5 0.284912ZM14 2.28491H5L2 9.28491V11.2849H11L9.65 16.7849L14 12.4349V2.28491ZM16 13.2849V11.2849H19V2.28491H16V0.284912H21V13.2849H16Z"
                fill="currentColor"
              />
            </svg>
            <span>{review.dislikes}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
