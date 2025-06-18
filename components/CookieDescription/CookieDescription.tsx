"use client";
import React from "react";
import styles from "./CookieDescription.module.css";
import { stripHTML } from "@/utils/stripHtml";

interface ProductVariant {
  id: number;
  title: string;
  option1: string | null;
  option2: string | null;
  option3: string | null;
  sku: string;
  requires_shipping: boolean;
  taxable: boolean;
  featured_image: string | null;
  available: boolean;
  price: string;
  grams: number;
  compare_at_price: string | null;
  position: number;
  product_id: number;
  created_at: string;
  updated_at: string;
}

interface ProductImage {
  id: number;
  created_at: string;
  position: number;
  updated_at: string;
  product_id: number;
  variant_ids: number[];
  src: string;
  width: number;
  height: number;
}

interface ProductOption {
  name: string;
  position: number;
  values: string[];
}

interface Product {
  id: number;
  title: string;
  handle: string;
  body_html: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  vendor: string;
  product_type: string;
  tags: string[];
  variants: ProductVariant[];
  images: ProductImage[];
  options: ProductOption[];
}

interface CookieDescriptionProps {
  product: Product;
}

export const CookieDescription: React.FC<CookieDescriptionProps> = ({ product }) => {
  const cleanDescription = product.body_html ? stripHTML(product.body_html) : '';
  const price = product.variants?.[0]?.price;
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{product.title}</h1>
      {price && <p className={styles.price}>${price}</p>}
      {cleanDescription && (
        <p className={styles.desc}>
          {cleanDescription}
        </p>
      )}
    </div>
  );
};
