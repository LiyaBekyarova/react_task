import React from 'react';
import Image from 'next/image';
import styles from './CookieGallery.module.css';

export interface images {
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


export const CookieGallery = ({ images = [] }: { images?: images[] }) => {
  if (!images || images.length === 0) {
    return (
      <div className={styles.gallery}>
        <div className={styles.imageContainer}>
          <div className={styles.placeholder}>No images available</div>
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className={styles.imageContainer}>
        <Image 
          src={images[0]?.src} 
          alt="Cookie" 
          width={images[0]?.width}
          height={images[0]?.height}
          className={styles.bigImg}
          quality={100}
          priority 
        />
      </div>
        {images.slice(1).map((image, index) => (
          <Image 
            key={index}
            src={image?.src}
            alt="Cookie"
            width={image?.width}
            height={image?.height}
            className={styles.containerSmallImages}
          />
        ))}
    </div>
  );
};