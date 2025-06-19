"use client";
import { useEffect, useMemo, useState } from "react";
import { ImageWithDesc } from "@/components/ImageWithDesc/ImageWithDesc";
import { ReviewsOverview } from "@/components/ReviewsOverview/ReviewsOverview";
import productsData from "@/constants/product.json";
import styles from "./page.module.css";
import { Review } from "@/types/review";

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const productData = useMemo(() => 
    productsData.products.find((p) => p.handle === id),
    [id]
  );
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [productReviews, setProductReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productData?.id) {
      setLoading(false);
      return;
    }

    const loadReviews = async () => {
      try {
        setLoading(true);
        setError(null);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let reviews: any[] = [];
        
        // Check if we're in the browser and localStorage is available
        if (typeof window !== "undefined" && window.localStorage) {
          const cachedReviews = localStorage.getItem("reviews");
          
          if (cachedReviews) {
            reviews = JSON.parse(cachedReviews);
          } else {
            // Fetch from API if not in localStorage
            const res = await fetch("/reviews.json");
            if (!res.ok) {
              throw new Error(`Failed to fetch reviews: ${res.status}`);
            }
            const data = await res.json();
            reviews = data.reviews || [];
            
            // Cache the reviews
            localStorage.setItem("reviews", JSON.stringify(reviews));
          }
        } else {
          // Fallback for SSR or when localStorage is not available
          const res = await fetch("/reviews.json");
          if (!res.ok) {
            throw new Error(`Failed to fetch reviews: ${res.status}`);
          }
          const data = await res.json();
          reviews = data.reviews || [];
        }

        // Ensure productData.id is a number and filter reviews
        const productId = Number(productData.id);
        const filtered = reviews.filter((r) => r.product_id === productId);
        
        setProductReviews(filtered);
      } catch (e) {
        console.error("Failed to load reviews:", e);
        setError(e instanceof Error ? e.message : "Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [productData?.id]);
  console.log("productData:", productData);
  if (typeof window !== "undefined") {
    console.log("reviews in localStorage:", localStorage.getItem("reviews"));
  }
  console.log("filtered reviews:", productReviews);

  if (!productData) {
    return <div>Product not found</div>;
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <ImageWithDesc product={productData} />
        <div>Loading reviews...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <ImageWithDesc product={productData} />
        <div>Error loading reviews: {error}</div>
      </div>
    );
  }
const handleReviewSubmit = (reviewData: Review) => {
  try {
    console.log('Received review data:', reviewData);
    
    const currentReviews = JSON.parse(localStorage.getItem("reviews") || "[]");
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];
    
    // Create a new review with all required fields
    const newReview: Review = {
      ...reviewData,
      id: Date.now(),
      product_id: Number(productData.id),
      product_title: productData.title,
      date: formattedDate,
      likes: 0,
      dislikes: 0,
      userReaction: null
    };
    
    console.log('New review to be saved:', newReview);
    
    // Add the new review to the beginning of the array (most recent first)
    const updatedReviews = [newReview, ...currentReviews];
    
    // Save to localStorage
    localStorage.setItem("reviews", JSON.stringify(updatedReviews));
    
    // Update the component's state with reviews for the current product only
    const productId = Number(productData.id);
    const filteredProductReviews = updatedReviews.filter(
      (r: Review) => r.product_id === productId
    );
    
    console.log('Updated product reviews:', filteredProductReviews);
    setProductReviews(filteredProductReviews);
    
  } catch (error) {
    console.error('Error submitting review:', error);
  }
};


const handleReviewReaction = (updatedReview: Review) => {
  // 1. Get ALL reviews from localStorage
  const allReviewsFromLocalStorage: Review[] = JSON.parse(localStorage.getItem("reviews") || "[]");

  // 2. Find the specific review and update it in the full list
  const updatedAllReviews = allReviewsFromLocalStorage.map((r) =>
    r.id === updatedReview.id ? updatedReview : r
  );

  // 3. Save the full updated list back to localStorage
  localStorage.setItem("reviews", JSON.stringify(updatedAllReviews));

  // 4. Update the component's state (productReviews)
  // This is crucial for immediate UI update in the current view
  setProductReviews((prevProductReviews) =>
    prevProductReviews.map((r) =>
      r.id === updatedReview.id ? updatedReview : r
    )
  );
};
  return (
    <div className={styles.container}>
      <ImageWithDesc product={productData} />
      <ReviewsOverview reviews={productReviews} onReviewSubmit={handleReviewSubmit} onReviewReaction={handleReviewReaction}/>
      
    </div>
  );
}