import Image from "next/image";
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/logo.png"
          alt="Next.js logo"
          width={580}
          height={150}
          priority
          quality={100}
          style={{
            objectFit: 'contain',
          }}
        />
        
        <div className={styles.buttonContainer}>
          <a
            className={styles.button}
            href="/products"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className={styles.buttonIcon}
              src="/logo-react-svgrepo-com.svg"
              alt="React logo"
              width={20}
              height={20}
            />
            React task
          </a>
        </div>
      </main>
    </div>
  );
}
