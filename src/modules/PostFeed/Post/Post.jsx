import { useMemo, useState } from "react";
import Avatar from "../../../shared/components/Avatar/Avatar";
import LikeIcon from "../../../assets/icons/LikeIcon";
import LikeIconActive from "../../../assets/icons/LikeIconActive";
import CommentsIcon from "../../../assets/icons/CommentsIcon";

import styles from "./Post.module.css";

const Post = ({ post }) => {
  const {
    profile,
    timeAgo,
    image,
    likesCount,
    captionTitle,
    captionBody,
    commentsCount,
    isLiked,
  } = post;

  const [expanded, setExpanded] = useState(false);

  const truncatedCaption = useMemo(() => {
    if (expanded || captionBody.length <= 15) {
      return captionBody;
    }

    return `${captionBody.slice(0, 15)}...`;
  }, [captionBody, expanded]);

  const shouldShowMore = captionBody.length > 15 && !expanded;

  return (
    <article className={styles.post}>
      <header className={styles.header}>
        <div className={styles.profile}>
          <Avatar
            size="xs"
            src={profile.avatar}
            alt={profile.username}
            withGradient
          />
          <div className={styles.profileInfo}>
            <span className={styles.username}>{profile.username}</span>
            <span className={styles.timeAgo}> • {timeAgo} • </span>
          </div>
        </div>
        <a className={styles.follow} href="/">
          follow
        </a>
      </header>

      <div className={styles.imageWrapper}>
        <img className={styles.postImage} src={image} alt="Post" />
      </div>

      <div className={styles.actions}>
        {isLiked ? <LikeIconActive /> : <LikeIcon />}
        <CommentsIcon className={styles.commentIcon} />
      </div>

      <div className={styles.likes}>{likesCount.toLocaleString()} likes</div>

      <div className={styles.caption}>
        <span className={styles.username}>{profile.username}</span>
        <span className={styles.captionTitle}> {captionTitle}</span>
      </div>

      <div className={styles.captionBody}>
        <span>{truncatedCaption}</span>
        {shouldShowMore && (
          <button
            type="button"
            className={styles.moreButton}
            onClick={() => setExpanded(true)}
          >
            more
          </button>
        )}
      </div>

      <a className={styles.comments} href="/">
        View all comments ({commentsCount})
      </a>
    </article>
  );
};

export default Post;
