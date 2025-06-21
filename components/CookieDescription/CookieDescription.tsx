"use client";
import React from "react";
import styles from "./CookieDescription.module.css";
import { stripHTML } from "@/utils/stripHtml";
import { RatingSummary } from "@/components/AllReviews/RatingSummary";
import { Review } from "@/types/review";
import { getReviewStats } from "@/utils/reviewsUtils";
import sloganData from "@/constants/slogan.json";
import { Product } from "@/types/productInterfaces";
import { IoCartOutline } from "react-icons/io5";
interface CookieDescriptionProps {
  product: Product;
  reviews: Review[];
}
export const CookieDescription = ({
  product,
  reviews = [],
}: CookieDescriptionProps) => {
  const cleanDescription = product.body_html
    ? stripHTML(product.body_html)
    : "";
  const price = product.variants?.[0]?.price;

  const productReviews = reviews.filter(
    (review) => review.product_title === product.title
  );

  const { averageRating, totalReviews } = getReviewStats(productReviews);
  const slogan = sloganData.slogan.find(
    (s) => s.product_id === product.id
  )?.slogan;
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{product.title}</h1>
      {price && <p className={styles.price}>${price}</p>}

      <RatingSummary
        averageRating={averageRating}
        totalReviews={totalReviews}
        variantDes={true}
      />

      <p className={styles.slogan}>{slogan}</p>
      {cleanDescription && <p className={styles.desc}>{cleanDescription}</p>}
      <button onClick={() => {
        alert("Product added to cart");
      }} className={styles.addToCartButton}><IoCartOutline size={20}/>Add to Cart</button>
    </div>
  );
};
