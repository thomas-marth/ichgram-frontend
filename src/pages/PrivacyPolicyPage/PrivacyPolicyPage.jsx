import styles from "./PrivacyPolicyPage.module.css";
import Header from "./../../shared/components/Header/Header";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1>Privacy Policy</h1>
        <p>
          At ICHgram, your privacy is important to us. This Privacy Policy
          explains how we collect, use, and protect your information when you
          use our platform.
        </p>

        <h2>1. Information We Collect</h2>
        <p>We may collect:</p>
        <ul>
          <li>Your name, email, and password when you register</li>
          <li>Profile details such as avatar, bio, and website</li>
          <li>Posts, comments, likes, and messages you create</li>
          <li>Technical data like device info, browser type, and IP address</li>
        </ul>

        <h2>2. How We Use Your Data</h2>
        <p>We use your data to:</p>
        <ul>
          <li>Provide core features (feed, chat, notifications)</li>
          <li>Improve our platform and user experience</li>
          <li>Protect against misuse and enforce our terms</li>
        </ul>
        <p>
          <strong>We do not sell your personal data to third parties.</strong>
        </p>

        <h2>3. Data Sharing</h2>
        <p>We may share data with:</p>
        <ul>
          <li>Cloud services (e.g., image hosting)</li>
          <li>Law enforcement if legally required</li>
        </ul>
        <p>We minimize what is shared and always protect your data.</p>

        <h2>4. Data Security</h2>
        <p>
          We implement measures to protect your data using encryption,
          authentication, and access controls.
        </p>

        <h2>5. Your Rights</h2>
        <p>You may:</p>
        <ul>
          <li>Access, update, or delete your personal info</li>
          <li>Request account deletion at any time</li>
        </ul>

        <h2>6. Contact Us</h2>
        <p>
          For questions or privacy-related concerns, contact us at:{" "}
          <strong>privacy@ichgram.com</strong>
        </p>

        <p>
          <em>Last updated: December 2025</em>
        </p>
      </div>
    </>
  );
}
