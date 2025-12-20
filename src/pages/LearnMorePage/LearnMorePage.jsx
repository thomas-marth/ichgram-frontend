import styles from "./LearnMorePage.module.css";
import Header from "./../../shared/components/Header/Header";

export default function LearnMorePage() {
  return (
    <>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.h1}>Learn More about ICHgram</h1>
        <p className={styles.p}>
          Welcome to <b>ICHgram</b> — your creative social playground where
          every picture tells a story and every interaction matters. Built for
          those who love to share, explore, connect, and express, ICHgram brings
          people closer through images, comments, conversations, and moments
          that matter.
        </p>
        <h2 className={styles.h2}>Why ICHgram?</h2>
        <ul className={styles.ul}>
          <li className={styles.li}>
            <b>Capture & Share Freely</b> — Post photos, write captions, and
            express your vibe with emojis.
          </li>
          <li className={styles.li}>
            <b>Real Conversations</b> — Chat with people you follow in real time
            — because comments aren't always enough.
          </li>
          <li className={styles.li}>
            <b>Follow the Story</b> — Keep up with creators, friends, and
            everyday moments via your personal feed.
          </li>
          <li className={styles.li}>
            <b>Instant Feedback</b> — Likes, comments, and notifications that
            feel alive and instant.
          </li>
          <li className={styles.li}>
            <b>Explore Beyond</b> — Discover new profiles and trending posts
            that match your interests.
          </li>
        </ul>
        <h2 className={styles.h2}>
          Built for Privacy. Designed for Expression.
        </h2>
        <p className={styles.p}>
          Your content belongs to you. ICHgram ensures your data stays safe
          while you stay expressive.
        </p>
        <h2 className={styles.h2}>Who is it for?</h2>
        <p className={styles.p}>
          Everyone — creators, dreamers, everyday humans. If you’ve got a story,
          a selfie, a sunset, or a moment — ICHgram is the place to share it.
        </p>
      </div>
    </>
  );
}
