import React, { useState } from 'react';
import { X, Upload, Star } from 'lucide-react';
import styles from './ReviewFormModal.module.css';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reviewData: ReviewData) => void;
  productName?: string;
  productId?: number;
}

interface ReviewData {
    reviewer_name: string;
    email: string;
    rating: number;
    review_title: string;
    comment: string;
    image_url?: string;
    date: string;
    likes: number;
    dislikes: number;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  productName = "Product"
}) => {
  const [formData, setFormData] = useState<ReviewData>({
    reviewer_name: '',
    email: '',
    rating: 0,
    review_title: '',
    comment: '',
    image_url: '',
    date: '',
    likes: 0,
    dislikes: 0,
  })
  const [hoveredStar, setHoveredStar] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleFileUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setFormData(prev => ({ ...prev, photo: file }));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = () => {
    if (isFormValid) {
      onSubmit(formData);
      setFormData({
        reviewer_name: '',
        email: '',
        rating: 0,
        review_title: '',
        comment: '',
        image_url: '',
        date: '',
        likes: 0,
        dislikes: 0,
      });
      onClose();
    }
  };

  const isFormValid = formData.reviewer_name && formData.email && formData.rating && formData.comment;

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalBox}>
        <div className={styles.modalHeader}>
          <h2 className={styles.title}>Leave a review for {productName}</h2>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.formContent}>
          <div className={styles.fieldGroup}>
            <label htmlFor="name" className={styles.label}>Name *</label>
            <input
              type="text"
              id="reviewer_name"
              name="reviewer_name"
              value={formData.reviewer_name}
              onChange={handleInputChange}
              className={styles.input}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={styles.input}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Rating</label>
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
                >
                  <Star size={20} />
                </button>
              ))}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="title" className={styles.label}>Review title</label>
            <input
              type="text"
              id="review_title"
              name="review_title"
              value={formData.review_title}
              onChange={handleInputChange}
              className={styles.input}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="review" className={styles.label}>Review</label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              rows={4}
              className={styles.textarea}
            />
          </div>

         
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Upload a photo (optional)</label>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`${styles.uploadArea} ${dragActive ? styles.uploadAreaHover : ''}`}
            >
              {formData.image_url ? (
                <>
                  <p className={styles.uploadText}>{formData.image_url}</p>
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, image_url: undefined }))}
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
