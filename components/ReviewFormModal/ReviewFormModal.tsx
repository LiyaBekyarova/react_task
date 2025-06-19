import React, { useState } from 'react';
import { X, Star } from 'lucide-react'; // Upload icon can now be removed if not used elsewhere
import styles from './ReviewFormModal.module.css';
import { Review } from '@/types/review'; // Import your centralized Review type

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reviewData: Review) => void; // Use the imported Review type here
  productName?: string;
  productId?: number; // Include productId as it's passed from page.tsx
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  productName = "Product",
  productId // Destructure productId
}) => {
  // Initialize formData with the imported Review type
  // Set optional properties to undefined if not provided initially
  const [formData, setFormData] = useState<Review>({
    reviewer_name: '',
    email: '',
    rating: 0,
    review_title: '',
    comment: '',
    // image_url: undefined, // Commented out image_url as it's not being used for submission
    date: '', // Will be filled on submit
    likes: 0,
    dislikes: 0,
    userReaction: null, // Ensure this matches your Review type (if optional, null is fine)
    // image: undefined, // Commented out image as it's not being used for submission
  });
  const [hoveredStar, setHoveredStar] = useState(0);
  // const [dragActive, setDragActive] = useState(false); // No longer needed if drag/drop is commented out

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  // COMMENTED OUT ALL IMAGE UPLOAD RELATED FUNCTIONS
  /*
  const handleFileUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setFormData(prev => ({ ...prev, image: file }));
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
  */

  const handleSubmit = () => {
    // Only proceed if form is valid and productId is available
    if (isFormValid && productId !== undefined) {
      const newReview: Review = {
        // Only include properties from formData that are part of the Review interface
        // and are actually being collected by the form.
        reviewer_name: formData.reviewer_name,
        email: formData.email,
        rating: formData.rating,
        review_title: formData.review_title,
        comment: formData.comment,
        date: new Date().toISOString().split('T')[0], // Format date
        likes: 0, // Initial likes
        dislikes: 0, // Initial dislikes
        userReaction: null, // Initial user reaction state

        // These properties are required by Review but generated/assigned on submit
        // Make sure your src/types/review.ts has them as OPTIONAL (id?, product_id?, product_title?)
        // OR provide placeholder values if they are NOT optional
        id: Date.now(), // Simple ID generation for dummy data
        product_id: productId, // Assign from props
        product_title: productName || '', // Assign from props

        // Image related properties are not set here as per request
        // image_url: undefined, // Explicitly set to undefined or omit
        // image: undefined // Explicitly set to undefined or omit
      };

      onSubmit(newReview); // Pass the fully formed Review object

      // Reset form data after submission
      setFormData({
        reviewer_name: '',
        email: '',
        rating: 0,
        review_title: '',
        comment: '',
        // image_url: undefined, // No longer used
        date: '',
        likes: 0,
        dislikes: 0,
        userReaction: null,
        // image: undefined // No longer used
      });
      onClose();
    } else {
      console.error("Form is invalid or product ID is missing.");
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
            <label htmlFor="reviewer_name" className={styles.label}>Name *</label>
            <input
              type="text"
              id="reviewer_name"
              name="reviewer_name"
              value={formData.reviewer_name}
              onChange={handleInputChange}
              className={styles.input}
              required
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
            <label className={styles.label}>Rating *</label>
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
            <label htmlFor="review_title" className={styles.label}>Review title</label>
            <input
              type="text"
              id="review_title"
              name="review_title"
              value={formData.review_title || ''} // Default to empty string if undefined
              onChange={handleInputChange}
              className={styles.input}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="comment" className={styles.label}>Review *</label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              rows={4}
              className={styles.textarea}
              required
            />
          </div>

          {/* COMMENTED OUT THE ENTIRE IMAGE UPLOAD SECTION */}
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