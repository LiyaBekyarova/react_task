import React from 'react';
import styles from './AllReviews.module.css';
import { renderStaticStars } from '../../utils/StarRenderers';

interface RatingBreakdownProps {
  ratingCounts: { [key: number]: number };
  totalReviews: number;
  filterRating: number | null;
  onFilterChange: (rating: number | null) => void;
}

export const RatingBreakdown  = ({
  ratingCounts,
  totalReviews,
  filterRating,
  onFilterChange,
}:RatingBreakdownProps) => {
  return (
    <div className={styles.ratingBreakdown}>
      {[5, 4, 3, 2, 1].map((star) => {
        const count = ratingCounts[star];
        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
        
        return (
          <div
            key={star}
            className={styles.ratingBar}
            onClick={() => onFilterChange(filterRating === star ? null : star)}
          >
            <div className={styles.ratingBarStars}>
              {renderStaticStars(star)}
            </div>
            <div className={styles.ratingBarProgress}>
              <div 
                className={styles.ratingBarFill} 
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className={styles.ratingCount}>
              {count}
            </span>
          </div>
        );
      })}
      <button
        onClick={() => onFilterChange(null)}
        className={styles.reviewButton}
        style={{
          marginTop: '10px',
          border: '1px solid #9F3419',
          backgroundColor: filterRating === null ? '#9F3419' : 'white',
          color: filterRating === null ? 'white' : '#9F3419',
        }}
      >
        Show All Ratings
      </button>
    </div>
  );
};
