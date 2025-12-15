import { useMemo, useState } from "react";
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
    captionBody,
    comments = [],
    commentsCount,
    isLiked,
    createdAt,
  } = post;

  const [expanded, setExpanded] = useState(false);

  const captionLines = useMemo(
    () =>
      captionBody
        .split("|")
        .map((line) => line.trim())
        .filter(Boolean),
    [captionBody]
  );

  const firstCaptionLine = captionLines[0] ?? "";
  const remainingCaption = captionLines.slice(1).join(" | ");

  const truncatedCaption = useMemo(() => {
    if (expanded || remainingCaption.length <= 15) {
      return remainingCaption;
    }

    return `${remainingCaption.slice(0, 15)}...`;
  }, [expanded, remainingCaption]);

  const shouldShowMore = remainingCaption.length > 15 && !expanded;
  const totalComments = comments.length || commentsCount || 0;
  const timeAgoLabel = createdAt ? formatTimeAgo(createdAt) : timeAgo;

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
        <button type="button" className={styles.follow} onClick={onOpen}>
          follow
        </button>
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

      <div className={styles.caption}>
        <span className={styles.username}>{profile.username}</span>
        {firstCaptionLine && (
          <span className={styles.captionTitle}> {firstCaptionLine}</span>
        )}
      </div>

      <div className={styles.captionBody}>
        {remainingCaption && (
          <>
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
          </>
        )}
      </div>

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
