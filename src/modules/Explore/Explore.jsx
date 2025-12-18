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
      {posts.map((post, index) => {
        const postId = post.id ?? post._id ?? `post-${index}`;

        return (
          <ExploreCard
            key={postId}
            post={{ ...post, id: postId }}
            onSelect={handlePostSelect}
          />
        );
      })}
    </div>
  );
};

export default Explore;
