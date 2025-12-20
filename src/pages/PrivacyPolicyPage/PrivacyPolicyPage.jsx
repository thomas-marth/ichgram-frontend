import styles from "./PrivacyPolicyPage.module.css";
import Header from "./../../shared/components/Header/Header";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.h1}>Privacy Policy</h1>
        <p className={styles.p}>
          At ICHgram, your privacy is important to us. This Privacy Policy
          explains how we collect, use, and protect your information when you
          use our platform.
        </p>

        <h2 className={styles.h2}>1. Information We Collect</h2>
        <p className={styles.p}>We may collect:</p>
        <ul className={styles.ul}>
          <li className={styles.li}>
            Your name, email, and password when you register
          </li>
          <li className={styles.li}>
            Profile details such as avatar, bio, and website
          </li>
          <li className={styles.li}>
            Posts, comments, likes, and messages you create
          </li>
          <li className={styles.li}>
            Technical data like device info, browser type, and IP address
          </li>
        </ul>

        <h2 className={styles.h2}>2. How We Use Your Data</h2>
        <p className={styles.p}>We use your data to:</p>
        <ul className={styles.ul}>
          <li className={styles.li}>
            Provide core features (feed, chat, notifications)
          </li>
          <li className={styles.li}>
            Improve our platform and user experience
          </li>
          <li className={styles.li}>
            Protect against misuse and enforce our terms
          </li>
        </ul>
        <p className={styles.p}>
          <strong>We do not sell your personal data to third parties.</strong>
        </p>

        <h2 className={styles.h2}>3. Data Sharing</h2>
        <p className={styles.p}>We may share data with:</p>
        <ul className={styles.ul}>
          <li className={styles.li}>Cloud services (e.g., image hosting)</li>
          <li className={styles.li}>Law enforcement if legally required</li>
        </ul>
        <p className={styles.p}>
          We minimize what is shared and always protect your data.
        </p>

        <h2 className={styles.h2}>4. Data Security</h2>
        <p className={styles.p}>
          We implement measures to protect your data using encryption,
          authentication, and access controls.
        </p>

        <h2 className={styles.h2}>5. Your Rights</h2>
        <p className={styles.p}>You may:</p>
        <ul className={styles.ul}>
          <li className={styles.li}>
            Access, update, or delete your personal info
          </li>
          <li className={styles.li}>Request account deletion at any time</li>
        </ul>

        <h2 className={styles.h2}>6. Contact Us</h2>
        <p className={styles.p}>
          For questions or privacy-related concerns, contact us at:{" "}
          <strong>privacy@ichgram.com</strong>
        </p>

        <p className={styles.p}>
          <em>Last updated: December 2025</em>
        </p>
      </div>
    </>
  );
}
