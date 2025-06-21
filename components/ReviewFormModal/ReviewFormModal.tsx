import React, { useState } from "react";
import { X, Star } from "lucide-react";
import styles from "./ReviewFormModal.module.css";
import { Review } from "@/types/review";
import Image from "next/image";
import { validateImageFile, resizeImage } from "@/utils/imageUtils";
import {
  validateReviewForm,
  createNewReview,
  getInitialReviewFormData,
  ReviewFormData,
} from "@/utils/reviewFormUtils";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reviewData: Review) => void;
  productName?: string;
  productId?: number;
}

const ReviewModal = ({
  isOpen,
  onClose,
  onSubmit,
  productName = "Product",
  productId,
}: ReviewModalProps) => {
  const [formData, setFormData] = useState<ReviewFormData>(
    getInitialReviewFormData(productId || 0, productName)
  );
  const [hoveredStar, setHoveredStar] = useState(0);

  if (!isOpen) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingClick = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!validateImageFile(file)) {
      return;
    }

    try {
      const resizedDataUrl = await resizeImage(file, {
        maxWidth: 800,
        maxSizeKB: 300,
      });
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        image_url: resizedDataUrl,
      }));
    } catch (error) {
      console.error("Error processing image:", error);
      alert(
        "Неуспешно обработване на изображението: " + (error as Error).message
      );
    }
  };

  const handleSubmit = () => {
    if (!validateReviewForm(formData)) {
      console.error("Form is invalid.");
      alert(
        "Моля, попълнете всички задължителни полета (Име, Имейл, Оценка, Коментар)."
      );
      return;
    }
    if (productId === undefined) {
      console.error("Product ID is missing.");
      alert("Възникна грешка: Липсва ID на продукта.");
      return;
    }

    const newReview: Review = createNewReview(formData, productId, productName);
    onSubmit(newReview);

    setFormData(getInitialReviewFormData(productId, productName));
    setHoveredStar(0);
    onClose();
  };

  const isFormValid = validateReviewForm(formData);

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
            <label htmlFor="reviewer_name" className={styles.label}>
              Name <span style={{ color: "#ef4444" }}>*</span>
            </label>
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
            <label htmlFor="email" className={styles.label}>
              Email <span style={{ color: "#ef4444" }}>*</span>
            </label>
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
            <label className={styles.label}>
              Rating <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <div className={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className={`${
                    star <= (hoveredStar || formData.rating)
                      ? styles.starFilled
                      : styles.starEmpty
                  } ${styles.starHover}`}
                  aria-label={`Give ${star} star${star === 1 ? "" : "s"}`}
                >
                  <Star size={20} />
                </button>
              ))}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="review_title" className={styles.label}>
              Review title
            </label>
            <input
              type="text"
              id="review_title"
              name="review_title"
              placeholder="Enter review title"
              value={formData.review_title || ""}
              onChange={handleInputChange}
              className={styles.input}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="comment" className={styles.label}>
              Review <span style={{ color: "#ef4444" }}>*</span>
            </label>
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

          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              Upload a photo of how it looks (optional)
            </label>
            <div className={styles.uploadArea}>
              {formData.image_url ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Image
                    src={formData.image_url}
                    alt="Preview"
                    width={400}
                    height={400}
                    className={styles.imagePreview}
                  />
                  <button
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        image_url: undefined,
                        imageFile: undefined,
                      }));
                    }}
                    className={styles.removePhoto}
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ position: "relative", width: 86, height: 86 }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        opacity: 0,
                        cursor: "pointer",
                        zIndex: 1,
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "100%",
                        backgroundColor: "#D9D9D9",
                        borderRadius: "5px",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 27 27"
                        width="27"
                        height="27"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M2.98629 24.1918C2.33835 24.1918 1.78367 23.9611 1.32225 23.4997C0.860835 23.0382 0.630127 22.4836 0.630127 21.8356V7.69864C0.630127 7.05069 0.860835 6.49601 1.32225 6.03459C1.78367 5.57318 2.33835 5.34247 2.98629 5.34247H6.69725L8.8767 2.98631H15.9452V5.34247H9.90752L7.75752 7.69864H2.98629V21.8356H21.8356V11.2329H24.1918V21.8356C24.1918 22.4836 23.9611 23.0382 23.4996 23.4997C23.0382 23.9611 22.4836 24.1918 21.8356 24.1918H2.98629ZM21.8356 7.69864V5.34247H19.4794V2.98631H21.8356V0.630142H24.1918V2.98631H26.5479V5.34247H24.1918V7.69864H21.8356ZM12.4109 20.0685C13.8836 20.0685 15.1353 19.5531 16.1661 18.5223C17.1969 17.4914 17.7123 16.2397 17.7123 14.7671C17.7123 13.2945 17.1969 12.0428 16.1661 11.012C15.1353 9.98117 13.8836 9.46576 12.4109 9.46576C10.9383 9.46576 9.68663 9.98117 8.65581 11.012C7.62499 12.0428 7.10958 13.2945 7.10958 14.7671C7.10958 16.2397 7.62499 17.4914 8.65581 18.5223C9.68663 19.5531 10.9383 20.0685 12.4109 20.0685ZM12.4109 17.7123C11.5863 17.7123 10.8893 17.4276 10.3199 16.8582C9.75045 16.2888 9.46574 15.5918 9.46574 14.7671C9.46574 13.9425 9.75045 13.2454 10.3199 12.676C10.8893 12.1066 11.5863 11.8219 12.4109 11.8219C13.2356 11.8219 13.9326 12.1066 14.502 12.676C15.0715 13.2454 15.3562 13.9425 15.3562 14.7671C15.3562 15.5918 15.0715 16.2888 14.502 16.8582C13.9326 17.4276 13.2356 17.7123 12.4109 17.7123Z"
                          fill="#1C1B1F"
                          fillOpacity="0.4"
                        />
                      </svg>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className={styles.submitBtnContainer}>
            <button
              onClick={handleSubmit}
              className={`${styles.submitBtn} ${
                isFormValid ? styles.submitBtnActive : styles.submitBtnDisabled
              }`}
              disabled={!isFormValid}
            >
              Submit review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
