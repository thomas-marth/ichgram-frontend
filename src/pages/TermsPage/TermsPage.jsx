import styles from "./TermsPage.module.css";
import Header from "./../../shared/components/Header/Header";

export default function TermsPage() {
  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1>Terms of Service</h1>

        <p>
          Welcome to ICHgram! By accessing or using our platform, you agree to
          the following terms and conditions:
        </p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By registering, browsing, or posting content on ICHgram, you accept
          these Terms of Service in full.
        </p>

        <h2>2. User Content</h2>
        <p>
          You retain ownership of all content you upload. However, by sharing
          content, you grant ICHgram a non-exclusive, royalty-free license to
          display and distribute it within the platform.
        </p>

        <h2>3. User Conduct</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Post content that is illegal, harmful, or offensive</li>
          <li>Harass, impersonate, or intimidate other users</li>
          <li>Attempt to hack or exploit the service</li>
        </ul>
        <p>
          We reserve the right to remove any content or suspend users who
          violate these rules.
        </p>

        <h2>4. Privacy</h2>
        <p>
          We value your privacy. Please refer to our Privacy Policy for details
          on how we collect, store, and use your data.
        </p>

        <h2>5. Availability</h2>
        <p>
          ICHgram is provided "as is." We do our best to keep the platform
          running smoothly but offer no guarantees regarding uptime or
          performance.
        </p>

        <h2>6. Changes to Terms</h2>
        <p>
          These terms may be updated from time to time. We will notify users of
          significant changes.
        </p>

        <p>
          <em>Last updated: December 2025</em>
        </p>
      </div>
    </>
  );
}
