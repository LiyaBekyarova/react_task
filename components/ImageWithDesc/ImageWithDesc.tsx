import React from 'react';
import styles from './ImageWithDesc.module.css';
import { CookieGallery } from '../CookieGallery/CookieGallery';
import { CookieDescription } from '../CookieDescription/CookieDescription';

// eslint-disable-next-line
export const ImageWithDesc = ({product}: {product:any}) => {

  return (
    <div className={styles.container}>
      <div className={styles.galleryContainer}>
        <CookieGallery images={product?.images} />
      </div>
      <div className={styles.descriptionContainer}>
        <CookieDescription product={product} />
      </div>
    </div>
  );
}
