import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import productsData from '../../constants/product.json';
import styles from './page.module.css';

export default function ProductsPage() {
  const { products } = productsData;

  return (
    <div className={styles.productsContainer}>
      <h1>Our Handcrafted Cookies</h1>
      <ul className={styles.productsGrid}>
        {products.map((product) => (
          <li key={product.id}>
            <Link href={`/products/${product.handle}`} className={styles.productCard}>
              {product.images && product.images[0] && (
                <div className={styles.imageContainer}>
                  <Image 
                    src={product.images[0].src} 
                    alt={product.title}
                    width={400}
                    height={400}
                    className={styles.productImage}
                    priority={products.indexOf(product) < 4} // Only preload first 4 images
                  />
                </div>
              )}
              <div className={styles.productInfo}>
                <h2>{product.title}</h2>
                <p>${product.variants[0]?.price || 'N/A'}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
