import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import productsData from '../../constants/product.json';
import styles from './page.module.css';

export default function ProductsPage() {
  const { products } = productsData;

  return (
    <div className={styles.productsContainer}>
      <h1>Our Delicious Cookies</h1>
      <div className={styles.productsGrid}>
        {products.map((product) => (
          <Link key={product.id} href={`/products/${product.handle}`} className={styles.productCard}>
            {product.images && product.images[0] && (
              <div className={styles.imageContainer}>
                <Image 
                  src={product.images[0].src} 
                  alt={product.title}
                  width={300}
                  height={300}
                  className={styles.productImage}
                />
              </div>
            )}
            <h2>{product.title}</h2>
            <p>${product.variants[0]?.price || 'N/A'}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
