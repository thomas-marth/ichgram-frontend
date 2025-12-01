import ExploreCard from "./ExploreCard/ExploreCard";

import styles from "./Explore.module.css";

const Explore = ({ posts = [], variant, onPostSelect }) => {
  const handlePostSelect = (postId) => {
    if (!onPostSelect) return;

    onPostSelect(postId);
  };

  const className = [styles.explore, variant ? styles[variant] : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={className}>
      {posts.map((post) => (
        <ExploreCard key={post.id} post={post} onSelect={handlePostSelect} />
      ))}
    </div>
  );
};

export default Explore;
