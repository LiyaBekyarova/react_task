"use client";
import { useEffect, useMemo, useState } from "react";
import { ImageWithDesc } from "@/components/ImageWithDesc/ImageWithDesc";
import { ReviewsOverview } from "@/components/ReviewsOverview/ReviewsOverview";
import productsData from "@/constants/product.json";
import styles from "./page.module.css";

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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleReviewSubmit = (reviewData: any) => {
    const currentReviews = JSON.parse(localStorage.getItem("reviews") || "[]");
    const newReview = {
      ...reviewData,
      id: Date.now(),
      product_id: Number(productData.id),
      date: new Date().toISOString(),

    };
    const updatedReviews = [...currentReviews, newReview];
    localStorage.setItem("reviews", JSON.stringify(updatedReviews));
    setProductReviews(prev => [...prev, newReview]);
  };
  return (
    <div className={styles.container}>
      <ImageWithDesc product={productData} />
      <ReviewsOverview reviews={productReviews} onReviewSubmit={handleReviewSubmit} />
    </div>
  );
}