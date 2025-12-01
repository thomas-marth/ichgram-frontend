import styles from "./ExploreCard.module.css";

const ExploreCard = ({ post, onSelect }) => (
  <div className={styles.exploreCard} onClick={() => onSelect?.(post.id)}>
    <div className={styles.imgWrapper}>
      <img src={post.image} alt={post.alt} className={styles.image} />
    </div>
  </div>
);

export default ExploreCard;
