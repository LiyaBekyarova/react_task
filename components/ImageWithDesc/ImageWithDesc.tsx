import React from 'react';
import styles from './ImageWithDesc.module.css';
import { CookieGallery } from '../CookieGallery/CookieGallery';
import { CookieDescription } from '../CookieDescription/CookieDescription';
import { Review } from '@/types/review';

interface ImageWithDescProps {
  //eslint-disable-next-line
  product: any;
  reviews?: Review[];
}

export const ImageWithDesc: React.FC<ImageWithDescProps> = ({ product, reviews = [] }) => {
  return (
    <div className={styles.container}>
      <div className={styles.galleryContainer}>
        <CookieGallery images={product?.images} />
      </div>
      <div className={styles.descriptionContainer}>
        <CookieDescription product={product} reviews={reviews} />
      </div>
    </div>
  );
};
