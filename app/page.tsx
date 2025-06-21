import Image from "next/image";
import Link from "next/link";
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.pageContainer}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <Image
            src="/logo.png"
            alt="Craftberry Logo"
            width={580}
            height={150}
            priority
            className={styles.logo}
          />
          <h1 className={styles.heroTitle}>Handcrafted Delights for Every Occasion</h1>
          <p className={styles.heroSubtitle}>Discover our collection of artisanal cookies made with love and premium ingredients</p>
          <Link href="/products" className={styles.ctaButton}>
            Shop Now
            <svg className={styles.ctaIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

    

     
    </div>
  );
}
