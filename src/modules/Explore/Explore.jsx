import ExploreCard from "./ExploreCard/ExploreCard";

import styles from "./Explore.module.css";

export default function Explore({ posts = [], variant, onPostSelect }) {
  const fullClassName = `${styles.explore} ${
    variant ? styles[variant] : ""
  }`.trim();

  const showPost = (postId) => {
    if (onPostSelect) {
      onPostSelect(postId);
    }
  };

  const elements = posts.map((post) => {
    return <ExploreCard key={post.id} post={post} showPost={showPost} />;
  });

  return <div className={fullClassName}>{elements}</div>;
}
