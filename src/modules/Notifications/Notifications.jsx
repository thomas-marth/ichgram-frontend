import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Avatar from "../../shared/components/Avatar/Avatar";
import PostModal from "../PostFeed/PostModal";
import formatTimeAgo from "../../shared/utils/formatTimeAgo";
import LoadingErrorOutput from "../../shared/components/LoadingErrorOutput/LoadingErrorOutput";
import EditPost from "../EditPost/EditPost";
import { getPostByIdApi, updatePostApi } from "../../shared/api/post-api";
import {
  getPostCommentsApi,
  createCommentApi,
  toggleCommentLikeApi,
} from "../../shared/api/comment-api";
import { likePostApi, unlikePostApi } from "../../shared/api/like-api";
import { followUserApi, unfollowUserApi } from "../../shared/api/follow-api";
import { mapPostsWithUserRelations } from "../../shared/utils/postRelations";
import styles from "./Notifications.module.css";

const notificationTextMap = {
  like_post: "liked your photo",
  comment_post: "commented your photo",
  follow: "started following",
  like_comment: "liked your comment",
};

const adaptPost = (post = {}) => {
  const author = post.author || {};

  return {
    ...post,
    id: post._id || post.id,
    image: post.image,
    profile: {
      id: author._id || author.id,
      username: author.username || "Unknown",
      avatar: author.avatar || "",
      isFollowed: post.isFollowed ?? author.isFollowed,
    },
    likesCount: post.totalLikes ?? post.likesCount ?? 0,
    commentsCount: post.totalComments ?? post.commentsCount ?? 0,
    descriptionBody:
      post.descriptionBody || post.description || post.captionBody || "",
    isLiked: Boolean(post.isLiked),
  };
};

const adaptComment = (comment) => {
  const likes = Array.isArray(comment.likes) ? comment.likes : [];

  return {
    ...comment,
    id: comment._id || comment.id,
    likes,
    likesCount: comment.likesCount ?? likes.length ?? 0,
  };
};

const Notifications = ({
  notifications = [],
  loading = false,
  error = null,
}) => {
  const navigate = useNavigate();
  const authUser = useSelector((state) => state.auth.user);
  const authUserId = authUser?._id || authUser?.id;

  const currentUser = useMemo(
    () => ({
      id: authUserId,
      username: authUser?.username || authUser?.name,
      avatar: authUser?.avatar,
    }),
    [authUserId, authUser?.avatar, authUser?.name, authUser?.username]
  );

  const [actionError, setActionError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [highlightedCommentId, setHighlightedCommentId] = useState(null);
  const [isPostLoading, setIsPostLoading] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const displayError = actionError || error;

  const updateSelectedPost = (updater) => {
    setSelectedPost((prev) => (prev ? updater(prev) : prev));
  };

  const loadPostWithComments = async (postId, commentId) => {
    setIsPostLoading(true);
    const [{ data: postData }, { data: commentsData }] = await Promise.all([
      getPostByIdApi(postId),
      getPostCommentsApi(postId),
    ]);

    if (!postData) throw new Error("Post not found");

    const adaptedPost = mapPostsWithUserRelations([adaptPost(postData)], {
      currentUserId: authUserId,
      defaultIsFollowed: true,
    })[0];

    const adaptedComments = (commentsData || []).map(adaptComment);

    setSelectedPost({ ...adaptedPost, comments: adaptedComments });
    setHighlightedCommentId(commentId || null);
    setIsPostLoading(false);
  };

  const handleNotificationClick = async (notification) => {
    if (notification.type === "follow" && notification.actor.id) {
      navigate(`/profile/${notification.actor.id}`);
      return;
    }

    const postId = notification.comment?.postId || notification.post?.id;
    if (!postId) return;

    setActionError(null);
    try {
      await loadPostWithComments(postId, notification.comment?.id);
    } catch (fetchError) {
      setActionError(fetchError);
      setIsPostLoading(false);
    }
  };

  const handleToggleLike = async (postId) => {
    updateSelectedPost((post) => {
      const isLikedNext = !post.isLiked;
      const likesDelta = isLikedNext ? 1 : -1;
      return {
        ...post,
        isLiked: isLikedNext,
        likesCount: Math.max(0, (post.likesCount || 0) + likesDelta),
      };
    });

    const apiCall = selectedPost?.isLiked ? unlikePostApi : likePostApi;
    const { error: likeError } = await apiCall(postId);

    if (likeError) {
      updateSelectedPost((post) => ({
        ...post,
        isLiked: !post.isLiked,
        likesCount: Math.max(
          0,
          (post.likesCount || 0) + (post.isLiked ? 1 : -1)
        ),
      }));
      setActionError(likeError);
    }
  };

  const handleAddComment = async (postId, text) => {
    const { data, error: commentError } = await createCommentApi(postId, text);
    if (commentError) {
      setActionError(commentError);
      return;
    }

    const newComment = adaptComment(data);

    updateSelectedPost((post) => ({
      ...post,
      comments: [...(post.comments || []), newComment],
      commentsCount: (post.commentsCount || 0) + 1,
    }));
  };

  const handleToggleCommentLike = async (commentId) => {
    const { data, error: likeError } = await toggleCommentLikeApi(commentId);
    if (likeError) {
      setActionError(likeError);
      return;
    }

    updateSelectedPost((post) => ({
      ...post,
      comments: (post.comments || []).map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              isLiked: data?.isLiked ?? !comment.isLiked,
              likesCount: data?.likesCount ?? comment.likesCount,
            }
          : comment
      ),
    }));
  };

  const handleFollowStatusChange = (authorId, isFollowed) => {
    updateSelectedPost((post) => {
      if (
        !post ||
        !post.profile ||
        String(post.profile.id) !== String(authorId)
      )
        return post;
      return { ...post, isFollowed, profile: { ...post.profile, isFollowed } };
    });
  };

  const handlePostUpdated = (updatedPost) => {
    const updatedId = updatedPost?.id || updatedPost?._id;
    if (!updatedId) return;

    setSelectedPost((prev) => {
      if (!prev || String(prev.id) !== String(updatedId)) return prev;

      const mergedAuthor = updatedPost?.author
        ? {
            ...prev.profile,
            id: updatedPost.author._id || updatedPost.author.id,
            _id: updatedPost.author._id || updatedPost.author.id,
            username: updatedPost.author.username || prev.profile?.username,
            avatar: updatedPost.author.avatar || prev.profile?.avatar,
          }
        : prev.profile;

      return {
        ...prev,
        ...updatedPost,
        image: updatedPost?.image || prev.image,
        createdAt: prev.createdAt,
        profile: mergedAuthor,
        comments: prev.comments || [],
        commentsCount: prev.commentsCount,
        likesCount: prev.likesCount,
        isLiked: prev.isLiked,
      };
    });
  };

  const handleEditPost = (postToEdit) => {
    if (!postToEdit?.id) return;

    setEditingPost({
      id: postToEdit.id,
      image: postToEdit.image,
      description:
        postToEdit.descriptionBody ||
        postToEdit.description ||
        postToEdit.captionBody ||
        "",
    });
    setSelectedPost(null);
  };

  const handleEditSuccess = (updatedPost) => {
    handlePostUpdated(updatedPost);
    setEditingPost(null);
  };

  const handleViewPost = (postId, postData) => {
    if (!postId) return;
    navigate(`/posts/${postId}`, { state: { post: postData } });
  };

  const handleToggleFollow = async (post) => {
    const authorId = post.profile?.id;
    if (!authorId) return { error: null };

    const isFollowed = Boolean(post.isFollowed ?? post.profile?.isFollowed);
    const apiCall = isFollowed ? unfollowUserApi : followUserApi;
    const response = await apiCall({ targetUserId: authorId });

    if (!response.error) {
      handleFollowStatusChange(authorId, !isFollowed);
    }

    return response;
  };

  const handleNavigateToProfile = (userId) => {
    if (!userId) return;
    navigate(`/profile/${userId}`);
  };

  return (
    <div className={styles.notificationPanel}>
      <span className={styles.sectionLabel}>New</span>

      {loading && <p className={styles.infoText}>Loading notifications...</p>}
      {displayError && !loading && (
        <LoadingErrorOutput
          error={displayError}
          layout="stacked"
          spacing="sm"
        />
      )}

      <ul className={styles.notificationList}>
        {notifications.map((notification) => (
          <li
            key={notification.id}
            className={styles.notificationItem}
            onClick={() => handleNotificationClick(notification)}
          >
            <div className={styles.leftwrapp}>
              <Avatar
                size="sm"
                src={notification.actor.avatar}
                alt={`${notification.actor.username} avatar`}
              />

              <div className={styles.content}>
                <p>
                  {notification.actor.username}{" "}
                  <span>{notificationTextMap[notification.type]}</span>
                  <span className={styles.timeAgo}>
                    {formatTimeAgo(notification.createdAt)}
                  </span>
                </p>
              </div>
            </div>

            {notification.post?.image && (
              <img
                src={notification.post.image}
                alt="Post preview"
                className={styles.postImage}
              />
            )}
          </li>
        ))}
      </ul>

      {selectedPost && (
        <PostModal
          post={selectedPost}
          onClose={() => {
            setSelectedPost(null);
            setHighlightedCommentId(null);
          }}
          onToggleLike={() => handleToggleLike(selectedPost.id)}
          onAddComment={(text) => handleAddComment(selectedPost.id, text)}
          onToggleCommentLike={(commentId) =>
            handleToggleCommentLike(commentId)
          }
          currentUser={currentUser}
          onFollowStatusChange={(authorId, isFollowed) =>
            handleFollowStatusChange(authorId, isFollowed)
          }
          onToggleFollow={() => handleToggleFollow(selectedPost)}
          onNavigateProfile={handleNavigateToProfile}
          highlightedCommentId={highlightedCommentId}
          onEditPost={handleEditPost}
          onViewPost={handleViewPost}
        />
      )}

      {isPostLoading && !selectedPost && (
        <p className={styles.infoText}>Opening post...</p>
      )}

      {editingPost && (
        <EditPost
          onClose={() => setEditingPost(null)}
          initialValues={editingPost}
          onSubmitForm={(values) => updatePostApi(editingPost.id, values)}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
};

export default Notifications;
