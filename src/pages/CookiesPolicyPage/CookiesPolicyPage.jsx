import styles from "./CookiesPolicyPage.module.css";
import Header from "./../../shared/components/Header/Header";

export default function CookiesPolicyPage() {
  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.h1}>Cookies Policy</h1>
        <p className={styles.text}>
          This Cookies Policy explains how ICHgram uses cookies and similar
          technologies when you visit our platform.
        </p>

        <h2 className={styles.h2}>1. What Are Cookies?</h2>
        <p className={styles.text}>
          Cookies are small text files that are placed on your device to help
          websites remember information about your visit, preferences, and usage
          patterns.
        </p>

        <h2>2. How We Use Cookies</h2>
        <p className={styles.text}>We use cookies to:</p>
        <ul className={styles.ul}>
          <li className={styles.li}>Keep you logged into your account</li>
          <li className={styles.li}>
            Understand how you interact with our platform
          </li>
          <li className={styles.li}>Store your preferences and settings</li>
          <li className={styles.li}>Improve user experience and performance</li>
        </ul>

        <h2 className={styles.h2}>3. Types of Cookies We Use</h2>
        <ul className={styles.ul}>
          <li className={styles.li}>
            <strong>Essential Cookies:</strong> Required for the core
            functionality of the site.
          </li>
          <li className={styles.li}>
            <strong>Analytics Cookies:</strong> Help us understand user behavior
            and improve the platform.
          </li>
          <li className={styles.li}>
            <strong>Preference Cookies:</strong> Remember your language and
            settings.
          </li>
        </ul>

        <h2 className={styles.h2}>4. Managing Cookies</h2>
        <p className={styles.text}>
          You can control or delete cookies through your browser settings.
          Disabling some cookies may affect your ability to use certain features
          of ICHgram.
        </p>

        <h2 className={styles.h2}>5. Changes to This Policy</h2>
        <p className={styles.text}>
          We may update this Cookies Policy. Significant changes will be
          announced on this page.
        </p>

        <p className={styles.text}>
          <em>Last updated: December 2025</em>
        </p>
      </div>
    </>
  );
}
