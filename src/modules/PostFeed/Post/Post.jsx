import { useMemo } from "react";
import Avatar from "../../../shared/components/Avatar/Avatar";
import LikeIcon from "../../../assets/icons/LikeIcon";
import LikeIconActive from "../../../assets/icons/LikeIconActive";
import CommentsIcon from "../../../assets/icons/CommentsIcon";
import formatTimeAgo from "../../../shared/utils/formatTimeAgo";

import styles from "./Post.module.css";

const Post = ({ post, onOpen, onToggleLike }) => {
  const {
    profile,
    timeAgo,
    image,
    likesCount,
    descriptionBody,
    comments = [],
    commentsCount,
    isLiked,
    createdAt,
    isFollowed,
    isOwnedByCurrentUser,
  } = post;

  const descriptionText = useMemo(
    () =>
      (descriptionBody || "")
        .split("|")
        .map((line) => line.trim())
        .filter(Boolean)
        .join(" | "),
    [descriptionBody]
  );

  const DESCRIPTION_LIMIT = 120;
  const isLongDescription = descriptionText.length > DESCRIPTION_LIMIT;

  const visibleDescription = useMemo(() => {
    if (!isLongDescription) return descriptionText;
    return `${descriptionText.slice(0, DESCRIPTION_LIMIT)}...`;
  }, [descriptionText, isLongDescription]);

  const totalComments = comments.length || commentsCount || 0;
  const timeAgoLabel = createdAt ? formatTimeAgo(createdAt) : timeAgo;
  const followLabel = isFollowed ?? profile?.isFollowed ? "unfollow" : "follow";

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
            <span className={styles.timeAgo}> • {timeAgoLabel} • </span>
          </div>
        </div>
        {!isOwnedByCurrentUser && (
          <button type="button" className={styles.follow} onClick={onOpen}>
            {followLabel}
          </button>
        )}
      </header>

      <button type="button" className={styles.imageButton} onClick={onOpen}>
        <div className={styles.imageWrapper}>
          <img className={styles.postImage} src={image} alt="Post" />
        </div>
      </button>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.iconButton}
          onClick={onToggleLike}
          aria-label={isLiked ? "Unlike post" : "Like post"}
        >
          {isLiked ? <LikeIconActive /> : <LikeIcon />}
        </button>
        <button
          type="button"
          className={styles.iconButton}
          onClick={onOpen}
          aria-label="Open comments"
        >
          <CommentsIcon className={styles.commentIcon} />
        </button>
      </div>

      <div className={styles.likes}>{likesCount.toLocaleString()} likes</div>

      {descriptionText && (
        <div className={styles.description}>
          <p className={styles.descriptionBody}>
            <span className={styles.username}>{profile.username}</span>
            {visibleDescription}
            {isLongDescription && " "}
            {isLongDescription && (
              <button
                type="button"
                className={styles.toggleDescriptionButton}
                onClick={onOpen}
              >
                more
              </button>
            )}
          </p>
        </div>
      )}

      <button
        type="button"
        className={styles.comments}
        onClick={onOpen}
        aria-label="Open comments"
      >
        View all comments ({totalComments})
      </button>
    </article>
  );
};

export default Post;
