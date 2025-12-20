import styles from "./TermsPage.module.css";
import Header from "./../../shared/components/Header/Header";

export default function TermsPage() {
  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.h1}>Terms of Service</h1>

        <p className={styles.p}>
          Welcome to ICHgram! By accessing or using our platform, you agree to
          the following terms and conditions:
        </p>

        <h2 className={styles.h2}>Acceptance of Terms</h2>
        <p className={styles.p}>
          By registering, browsing, or posting content on ICHgram, you accept
          these Terms of Service in full.
        </p>

        <h2 className={styles.h2}>User Content</h2>
        <p className={styles.p}>
          You retain ownership of all content you upload. However, by sharing
          content, you grant ICHgram a non-exclusive, royalty-free license to
          display and distribute it within the platform.
        </p>

        <h2 className={styles.h2}>User Conduct</h2>
        <p className={styles.p}>You agree not to:</p>
        <ul className={styles.ul}>
          <li className={styles.li}>
            Post content that is illegal, harmful, or offensive
          </li>
          <li className={styles.li}>
            Harass, impersonate, or intimidate other users
          </li>
          <li className={styles.li}>Attempt to hack or exploit the service</li>
        </ul>
        <p className={styles.p}>
          We reserve the right to remove any content or suspend users who
          violate these rules.
        </p>

        <h2 className={styles.h2}>Privacy</h2>
        <p className={styles.p}>
          We value your privacy. Please refer to our Privacy Policy for details
          on how we collect, store, and use your data.
        </p>

        <h2 className={styles.h2}>Availability</h2>
        <p className={styles.p}>
          ICHgram is provided "as is." We do our best to keep the platform
          running smoothly but offer no guarantees regarding uptime or
          performance.
        </p>

        <h2 className={styles.h2}>Changes to Terms</h2>
        <p className={styles.p}>
          These terms may be updated from time to time. We will notify users of
          significant changes.
        </p>

        <p className={styles.p}>
          <em>Last updated: December 2025</em>
        </p>
      </div>
    </>
  );
}
