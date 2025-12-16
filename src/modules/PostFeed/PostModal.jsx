import { useEffect, useMemo, useRef, useState } from "react";
import Avatar from "../../shared/components/Avatar/Avatar";
import LikeIcon from "../../assets/icons/LikeIcon";
import LikeIconActive from "../../assets/icons/LikeIconActive";
import CommentsIcon from "../../assets/icons/CommentsIcon";
import unlikedCommentIcon from "../../assets/icons/like-comment-icon.svg";
import likedCommentIcon from "../../assets/icons/like-comment-icon-active.svg";
import smileIcon from "../../assets/icons/smile.svg";
import formatTimeAgo from "../../shared/utils/formatTimeAgo";
import optionsIcon from "../../assets/icons/options.svg";

import styles from "./PostModal.module.css";

const emojiPalette = [
  "😀",
  "😎",
  "😍",
  "🎉",
  "🔥",
  "👏",
  "🥳",
  "🤩",
  "🤔",
  "😅",
  "😇",
  "🙌",
];

const PostModal = ({
  post,
  onClose,
  onToggleLike,
  onAddComment,
  onToggleCommentLike,
  currentUser,
  onFollowStatusChange,
  onToggleFollow,
  onNavigateProfile,
}) => {
  const [newComment, setNewComment] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [followError, setFollowError] = useState(null);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const commentInputRef = useRef(null);
  const contentAreaRef = useRef(null);
  const lastCommentRef = useRef(null);
  const previousCommentsLength = useRef(post.comments?.length || 0);
  const shouldScrollToNewComment = useRef(false);

  const isFollowed = useMemo(
    () => Boolean(post.isFollowed ?? post.profile?.isFollowed),
    [post.isFollowed, post.profile?.isFollowed]
  );

  const descriptionBody = useMemo(
    () => post.descriptionBody || post.description || post.captionBody || "",
    [post.captionBody, post.description, post.descriptionBody]
  );

  const descriptionText = descriptionBody.trim();

  const DESCRIPTION_LIMIT = 290;

  const isLongDescription = descriptionText.length > DESCRIPTION_LIMIT;
  const hasDescription = Boolean(descriptionText);
  const comments = post.comments || [];
  const hasComments = comments.length > 0;

  const visibleDescription = useMemo(() => {
    if (!hasDescription) {
      return "";
    }

    if (!isLongDescription || isDescriptionExpanded) {
      return descriptionText;
    }

    return `${descriptionText.slice(0, DESCRIPTION_LIMIT)}...`;
  }, [
    hasDescription,
    isDescriptionExpanded,
    isLongDescription,
    descriptionText,
  ]);

  const likesCount = post.likesCount ?? 0;

  const currentUserId = currentUser?._id || currentUser?.id || "";
  const postOwnerId = post.profile?._id || post.profile?.id;
  const isPostOwner = Boolean(
    postOwnerId &&
      currentUserId &&
      String(postOwnerId) === String(currentUserId)
  );

  const shouldShowGradient = (userId) =>
    Boolean(
      userId && currentUserId && String(userId) === String(currentUserId)
    );

  const handleAddComment = () => {
    const trimmed = newComment.trim();
    if (!trimmed) return;
    shouldScrollToNewComment.current = true;
    onAddComment(trimmed);
    setNewComment("");
    setShowEmojis(false);
  };

  const handleCommentLike = (commentId) => {
    onToggleCommentLike(commentId);
  };

  const handleCommentIconClick = () => {
    commentInputRef.current?.focus();
  };

  const handleFollowToggle = async () => {
    if (!postOwnerId || !onToggleFollow) return;

    setFollowError(null);
    setIsFollowLoading(true);
    const { error } = await onToggleFollow();

    setIsFollowLoading(false);

    if (error) {
      const apiMessage =
        typeof error === "string"
          ? error
          : error?.message || "Unable to update follow status";
      setFollowError(apiMessage);
      return;
    }

    if (typeof onFollowStatusChange === "function") {
      onFollowStatusChange(postOwnerId, !isFollowed);
    }
  };

  const toggleDescription = () => {
    if (!isLongDescription) return;
    setIsDescriptionExpanded((prev) => !prev);
  };

  const handleNavigateToProfile = (userId) => {
    if (!userId || typeof onNavigateProfile !== "function") return;
    onNavigateProfile(userId);
  };

  useEffect(() => {
    const contentArea = contentAreaRef.current;
    const lastComment = lastCommentRef.current;
    const wasLength = previousCommentsLength.current;

    if (comments.length <= wasLength) {
      previousCommentsLength.current = comments.length;
      return;
    }

    previousCommentsLength.current = comments.length;

    if (!contentArea || !lastComment || !shouldScrollToNewComment.current) {
      shouldScrollToNewComment.current = false;
      return;
    }

    const containerRect = contentArea.getBoundingClientRect();
    const commentRect = lastComment.getBoundingClientRect();
    const isFullyVisible =
      commentRect.top >= containerRect.top &&
      commentRect.bottom <= containerRect.bottom;

    if (!isFullyVisible) {
      lastComment.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    shouldScrollToNewComment.current = false;
  }, [comments.length]);

  const lastLikeDateLabel = useMemo(() => {
    if (!post.lastLikedAt && !post.updatedAt && !post.createdAt) return "";
    const date = post.lastLikedAt || post.updatedAt || post.createdAt;
    return formatTimeAgo(date);
  }, [post.createdAt, post.lastLikedAt, post.updatedAt]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.mediaWrapper}>
          <img className={styles.media} src={post.image} alt="Post" />
        </div>

        <div className={styles.sidebar}>
          <header className={styles.header}>
            <button
              type="button"
              className={`${styles.profileButton} ${styles.profile}`}
              onClick={() => handleNavigateToProfile(postOwnerId)}
            >
              <Avatar
                size="xs"
                src={post.profile?.avatar}
                alt={post.profile?.username}
                withGradient={shouldShowGradient(postOwnerId)}
              />
              <div className={styles.profileInfo}>
                <span className={styles.username}>
                  {post.profile?.username}
                </span>
              </div>
            </button>
            <div className={styles.profileActions}>
              {!isPostOwner && (
                <>
                  <span className={styles.separator}>•</span>
                  <button
                    type="button"
                    className={styles.followButton}
                    onClick={handleFollowToggle}
                    disabled={isFollowLoading}
                  >
                    {isFollowed ? "unfollow" : "follow"}
                  </button>
                </>
              )}

              {isPostOwner && (
                <button
                  type="button"
                  className={styles.optionsButton}
                  onClick={() => setIsManageModalOpen(true)}
                  aria-label="Post options"
                >
                  <img src={optionsIcon} alt="Options" />
                </button>
              )}
            </div>
          </header>

          <div className={styles.contentArea} ref={contentAreaRef}>
            {hasDescription && (
              <div className={styles.description}>
                <button
                  type="button"
                  className={`${styles.profileButton} ${styles.avatarButton}`}
                  onClick={() => handleNavigateToProfile(postOwnerId)}
                >
                  <Avatar
                    size="xs"
                    src={post.profile?.avatar}
                    alt={post.profile?.username}
                    withGradient={shouldShowGradient(postOwnerId)}
                  />
                </button>
                <div className={styles.descriptionContent}>
                  <div className={styles.descriptionHeader}>
                    <p className={styles.descriptionBody}>
                      <button
                        type="button"
                        className={`${styles.username} ${styles.usernameButton}`}
                        onClick={() => handleNavigateToProfile(postOwnerId)}
                      >
                        {post.profile?.username}
                      </button>
                      {visibleDescription}
                      {isLongDescription && " "}
                      {isLongDescription && (
                        <button
                          type="button"
                          className={styles.toggleDescriptionButton}
                          onClick={toggleDescription}
                        >
                          {isDescriptionExpanded ? "less" : "more"}
                        </button>
                      )}
                    </p>
                  </div>
                  {post.createdAt && (
                    <span className={styles.descriptionDate}>
                      {formatTimeAgo(post.createdAt)}
                    </span>
                  )}
                </div>
              </div>
            )}

            {followError && <p className={styles.errorText}>{followError}</p>}

            {hasComments && (
              <div className={styles.commentsSection}>
                {comments.map((comment, index) => {
                  const isLiked =
                    comment.isLiked ?? comment.likes?.includes(currentUserId);
                  const likesCount =
                    comment.likesCount ?? comment.likes?.length ?? 0;
                  const commentUserId = comment.user?._id || comment.user?.id;
                  const isLastComment = index === comments.length - 1;
                  return (
                    <div
                      key={comment.id}
                      className={styles.comment}
                      ref={isLastComment ? lastCommentRef : null}
                    >
                      <button
                        type="button"
                        className={`${styles.profileButton} ${styles.commentAvatarButton}`}
                        onClick={() => handleNavigateToProfile(commentUserId)}
                      >
                        <Avatar
                          size="xs"
                          src={comment.user?.avatar}
                          alt={comment.user?.username}
                          withGradient={shouldShowGradient(commentUserId)}
                        />
                      </button>
                      <div className={styles.commentMain}>
                        <div className={styles.commentHeader}>
                          <button
                            type="button"
                            className={`${styles.username} ${styles.usernameButton}`}
                            onClick={() =>
                              handleNavigateToProfile(commentUserId)
                            }
                          >
                            {comment.user?.username}
                          </button>
                          <p className={styles.commentText}>{comment.text}</p>
                        </div>
                        <div className={styles.commentFooter}>
                          <span className={styles.timeAgo}>
                            {formatTimeAgo(comment.createdAt)}
                          </span>
                          <span className={styles.commentLikes}>
                            Likes: {likesCount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className={styles.commentActions}>
                        <button
                          type="button"
                          className={styles.commentLikeButton}
                          onClick={() => handleCommentLike(comment.id)}
                        >
                          <img
                            src={
                              isLiked ? likedCommentIcon : unlikedCommentIcon
                            }
                            alt={isLiked ? "Unlike comment" : "Like comment"}
                            className={styles.commentLikeIcon}
                          />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!hasComments && !hasDescription && (
              <div className={styles.emptyStateWrapper}>
                <p className={styles.emptyState}>
                  No comments yet. Start the conversation.
                </p>
              </div>
            )}
          </div>

          <footer className={styles.footer}>
            <div className={styles.actionRow}>
              <button
                type="button"
                className={styles.iconButton}
                onClick={onToggleLike}
                aria-label={post.isLiked ? "Unlike post" : "Like post"}
              >
                {post.isLiked ? <LikeIconActive /> : <LikeIcon />}
              </button>
              <button
                type="button"
                className={styles.iconButton}
                aria-label="Comments"
                onClick={handleCommentIconClick}
              >
                <CommentsIcon className={styles.commentIcon} />
              </button>
            </div>

            <div className={styles.likesSummary}>
              {likesCount.toLocaleString()}{" "}
              {likesCount === 1 ? "like" : "likes"}
            </div>

            {lastLikeDateLabel && (
              <div className={styles.lastLikeDate}>{lastLikeDateLabel}</div>
            )}

            <div className={styles.addComment}>
              <div className={styles.emojiPicker}>
                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={() => setShowEmojis((state) => !state)}
                  aria-label="Toggle emojis"
                >
                  <img src={smileIcon} alt="Add emoji" width={20} height={20} />
                </button>
                {showEmojis && (
                  <div className={styles.emojiList}>
                    {emojiPalette.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        className={styles.emojiButton}
                        onClick={() =>
                          setNewComment((value) => `${value}${emoji}`)
                        }
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <input
                className={styles.commentInput}
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(event) => setNewComment(event.target.value)}
                ref={commentInputRef}
              />
              <button
                type="button"
                className={styles.submitButton}
                onClick={handleAddComment}
                disabled={!newComment.trim()}
              >
                Send
              </button>
            </div>
          </footer>
        </div>
      </div>

      {isManageModalOpen && (
        <div
          className={styles.manageOverlay}
          onClick={(event) => {
            event.stopPropagation();
            setIsManageModalOpen(false);
          }}
        >
          <div
            className={styles.manageModal}
            onClick={(event) => event.stopPropagation()}
          >
            <h3 className={styles.manageTitle}>Параметры поста</h3>
            <p className={styles.manageHint}>
              Здесь появится управление публикацией.
            </p>
            <button
              type="button"
              className={styles.closeManageButton}
              onClick={() => setIsManageModalOpen(false)}
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostModal;
