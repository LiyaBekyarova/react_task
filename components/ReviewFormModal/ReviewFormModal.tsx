import React, { useState } from 'react';
import { X, Star } from 'lucide-react';
import styles from './ReviewFormModal.module.css';
import { Review } from '@/types/review';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reviewData: Review) => void;
  productName?: string;
  productId?: number;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  productName = "Product",
  productId
}) => {
  const [formData, setFormData] = useState<Review>({
    reviewer_name: '',
    email: '',
    rating: 0,
    review_title: '',
    comment: '',
    date: '', // Ще се запълни при submit
    likes: 0,
    dislikes: 0,
    userReaction: null,
    // Тези са необходими за Review типа, но се задават при submit или са по default
    id: 0, // placeholder, will be updated on submit
    product_id: productId || 0, // Ensure productId is used, default to 0 if undefined
    product_title: productName,
  });
  const [hoveredStar, setHoveredStar] = useState(0);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleSubmit = () => {
    // Проверка за валидация
    if (isFormValid && productId !== undefined) {
      const newReview: Review = {
        reviewer_name: formData.reviewer_name.trim(),
        email: formData.email.trim(),
        rating: formData.rating,
        comment: formData.comment.trim(),
        date: new Date().toISOString().split('T')[0], // Форматиране на датата като YYYY-MM-DD
        likes: 0,
        dislikes: 0,
        userReaction: null,
        id: Date.now(), // Генериране на уникално ID
        product_id: productId, // Използване на productId от props
        product_title: productName,
      };

      if (formData.review_title && formData.review_title.trim()) {
        newReview.review_title = formData.review_title.trim();
      }
      
      console.log('Submitting review:', newReview);

      onSubmit(newReview);

      // Нулиране на формата след изпращане
      setFormData({
        reviewer_name: '',
        email: '',
        rating: 0,
        review_title: '',
        comment: '',
        date: '',
        likes: 0,
        dislikes: 0,
        userReaction: null,
        id: 0,
        product_id: productId || 0,
        product_title: productName,
      });
      onClose();
    } else {
      console.error("Form is invalid or product ID is missing.");
    }
  };

  // Проверка дали всички задължителни полета са попълнени
  const isFormValid = formData.reviewer_name.trim() !== '' &&
                      formData.email.trim() !== '' &&
                      formData.rating > 0 &&
                      formData.comment.trim() !== '';

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalBox}>
        <div className={styles.closeBtn}>
        <button onClick={onClose} aria-label="Close review form">
            <X size={20} />
          </button>
        </div>
        <div className={styles.modalHeader}>
          <h2 className={styles.title}>Leave a review</h2>
         
        </div>

        <div className={styles.formContent}>
          <div className={styles.fieldGroup}>
            <label htmlFor="reviewer_name" className={styles.label}>Name <span style={{ color: '#ef4444' }}>*</span></label>
            <input
              type="text"
              id="reviewer_name"
              name="reviewer_name"
              placeholder="Your name"
              value={formData.reviewer_name}
              onChange={handleInputChange}
              className={styles.input}
              required
              aria-required="true"
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="email" className={styles.label}>Email <span style={{ color: '#ef4444' }}>*</span></label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              className={styles.input}
              required
              aria-required="true"
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Rating <span style={{ color: '#ef4444' }}>*</span></label>
            <div className={styles.stars}>
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className={`${star <= (hoveredStar || formData.rating)
                    ? styles.starFilled
                    : styles.starEmpty
                    } ${styles.starHover}`}
                  aria-label={`Give ${star} star${star === 1 ? '' : 's'}`}
                >
                  <Star size={20} />
                </button>
              ))}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="review_title" className={styles.label}>Review title</label>
            <input
              type="text"
              id="review_title"
              name="review_title"
              placeholder="Enter review title"
              value={formData.review_title || ''}
              onChange={handleInputChange}
              className={styles.input}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="comment" className={styles.label}>Review <span style={{ color: '#ef4444' }}>*</span></label>
            <textarea
              id="comment"
              name="comment"
              placeholder="Write your review"
              value={formData.comment}
              onChange={handleInputChange}
              rows={4}
              className={styles.textarea}
              required
              aria-required="true"
            />
          </div>

          {/* Секцията за качване на снимки е коментирана, както в оригиналния ти код */}
          {/*
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Upload a photo (optional)</label>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`${styles.uploadArea} ${dragActive ? styles.uploadAreaHover : ''}`}
            >
              {formData.image ? (
                <>
                  <p className={styles.uploadText}>{formData.image.name}</p>
                  <img src={URL.createObjectURL(formData.image)} alt="Preview" className={styles.imagePreview} />
                  <button
                    onClick={() => {
                      setFormData(prev => ({ ...prev, image: undefined }));
                      if (formData.image) URL.revokeObjectURL(URL.createObjectURL(formData.image));
                    }}
                    className={styles.removePhoto}
                    type="button"
                  >
                    Remove
                  </button>
                </>
              ) : (
                <>
                  <Upload size={24} className="mx-auto text-gray-400" />
                  <p className={styles.uploadText}>
                    Drag and drop image here, or{' '}
                    <label className={styles.browse}>
                      browse
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          e.target.files?.[0] && handleFileUpload(e.target.files[0])
                        }
                        className="hidden"
                      />
                    </label>
                  </p>
                </>
              )}
            </div>
          </div>
          */}

          <button
            onClick={handleSubmit}
            className={`${styles.submitBtn} ${isFormValid ? styles.submitBtnActive : styles.submitBtnDisabled}`}
            disabled={!isFormValid}
          >
            Submit review
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;