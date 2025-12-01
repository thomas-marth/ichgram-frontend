import styles from "./ExploreCard.module.css";

export default function ExploreCard({ post, showPost }) {
  return (
    <div className={styles.exploreCard} onClick={() => showPost?.(post.id)}>
      <div className={styles.imgWrapper}>
        <img src={post.image} alt={post.alt} className={styles.image} />
      </div>
    </div>
  );
}
