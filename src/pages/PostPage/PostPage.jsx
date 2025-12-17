import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import PostModal from "../../modules/PostFeed/PostModal";
import LoadingErrorOutput from "../../shared/components/LoadingErrorOutput/LoadingErrorOutput";
import { getPostByIdApi } from "../../shared/api/post-api";
import {
  getUserLikedPostsApi,
  likePostApi,
  unlikePostApi,
} from "../../shared/api/like-api";
import {
  createCommentApi,
  getPostCommentsApi,
  toggleCommentLikeApi,
} from "../../shared/api/comment-api";
import { followUserApi, unfollowUserApi } from "../../shared/api/follow-api";
import { selectUser } from "../../redux/auth/authSelectors";
import {
  adaptComment,
  adaptFeedPost,
  normalizeLikedPostIds,
} from "../../shared/utils/postAdapter";

import styles from "./PostPage.module.css";

const PostPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const locationPost = location.state?.post;

  const authUser = useSelector(selectUser);
  const currentUserId = authUser?._id || authUser?.id || null;
  const currentUser = useMemo(
    () => ({
      id: currentUserId || "current-user",
      username: authUser?.username || authUser?.name || "You",
      avatar: authUser?.avatar || authUser?.profile_image,
    }),
    [authUser, currentUserId]
  );

  const [post, setPost] = useState(locationPost || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updatePostState = (updater) => {
    setPost((prev) => (prev ? updater(prev) : prev));
  };

  useEffect(() => {
    if (!postId || locationPost) return;

    let isMounted = true;

    const fetchPost = async () => {
      setLoading(true);
      setError(null);

      const [postResponse, likedResponse, commentsResponse] = await Promise.all(
        [
          getPostByIdApi(postId),
          currentUserId
            ? getUserLikedPostsApi(currentUserId)
            : Promise.resolve({ data: [] }),
          getPostCommentsApi(postId),
        ]
      );

      if (!isMounted) return;

      setLoading(false);

      if (postResponse.error) {
        setError(postResponse.error);
        return;
      }

      const likedIds = normalizeLikedPostIds(likedResponse.data);
      const mappedPost = adaptFeedPost(postResponse.data || {});
      const mappedComments = (commentsResponse.data || []).map((comment) =>
        adaptComment(comment, currentUser)
      );

      setPost({
        ...mappedPost,
        isLiked: likedIds.includes(String(mappedPost.id)),
        comments: mappedComments,
        commentsCount: mappedComments.length,
      });
    };

    fetchPost();

    return () => {
      isMounted = false;
    };
  }, [currentUser, currentUserId, locationPost, postId]);

  const handleToggleLike = async () => {
    if (!post) return;

    const isLikedNext = !post.isLiked;
    const likesDelta = isLikedNext ? 1 : -1;

    updatePostState((currentPost) => ({
      ...currentPost,
      isLiked: isLikedNext,
      likesCount: Math.max(0, (currentPost.likesCount || 0) + likesDelta),
    }));

    const apiMethod = isLikedNext ? likePostApi : unlikePostApi;
    const { error: likeError } = await apiMethod(post.id || post._id);

    if (likeError) {
      updatePostState((currentPost) => ({
        ...currentPost,
        isLiked: !isLikedNext,
        likesCount: Math.max(0, (currentPost.likesCount || 0) - likesDelta),
      }));
      setError(likeError);
    }
  };

  const handleAddComment = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || !post) return;

    const { data, error: commentError } = await createCommentApi(
      post.id,
      trimmed
    );

    if (commentError || !data) {
      setError(commentError || new Error("Failed to add comment"));
      return;
    }

    const newComment = adaptComment(data, currentUser);

    updatePostState((currentPost) => {
      const comments = [...(currentPost.comments || []), newComment];
      return { ...currentPost, comments, commentsCount: comments.length };
    });
  };

  const handleToggleCommentLike = async (commentId) => {
    if (!post) return;
    let isLikedNext = false;

    updatePostState((currentPost) => {
      const updatedComments = (currentPost.comments || []).map((comment) => {
        const commentKey = comment.id || comment._id;
        if (String(commentKey) !== String(commentId)) return comment;

        const hasLiked =
          comment.isLiked ??
          comment.likes?.some((id) => String(id) === String(currentUser.id));
        isLikedNext = !hasLiked;
        const likesCount = comment.likesCount ?? comment.likes?.length ?? 0;
        const nextLikesCount = Math.max(0, likesCount + (isLikedNext ? 1 : -1));

        const likesArray = Array.isArray(comment.likes)
          ? isLikedNext
            ? Array.from(new Set([...comment.likes, currentUser.id]))
            : comment.likes.filter(
                (id) => String(id) !== String(currentUser.id)
              )
          : comment.likes;

        return {
          ...comment,
          isLiked: isLikedNext,
          likes: likesArray,
          likesCount: nextLikesCount,
        };
      });

      return { ...currentPost, comments: updatedComments };
    });

    const { data, error: toggleError } = await toggleCommentLikeApi(commentId);

    if (toggleError || !data) {
      updatePostState((currentPost) => {
        const updatedComments = (currentPost.comments || []).map((comment) => {
          const commentKey = comment.id || comment._id;
          if (String(commentKey) !== String(commentId)) return comment;

          const likesCount = comment.likesCount ?? comment.likes?.length ?? 0;
          const revertedLikesCount = Math.max(
            0,
            likesCount + (isLikedNext ? -1 : 1)
          );

          const likesArray = Array.isArray(comment.likes)
            ? isLikedNext
              ? comment.likes.filter(
                  (id) => String(id) !== String(currentUser.id)
                )
              : Array.from(new Set([...comment.likes, currentUser.id]))
            : comment.likes;

          return {
            ...comment,
            isLiked: !isLikedNext,
            likes: likesArray,
            likesCount: revertedLikesCount,
          };
        });

        return { ...currentPost, comments: updatedComments };
      });
      setError(toggleError || new Error("Unable to toggle comment like"));
      return;
    }

    updatePostState((currentPost) => {
      const updatedComments = (currentPost.comments || []).map((comment) => {
        const commentKey = comment.id || comment._id;
        if (String(commentKey) !== String(commentId)) return comment;

        const likesArray = Array.isArray(comment.likes)
          ? data.isLiked
            ? Array.from(new Set([...comment.likes, currentUser.id]))
            : comment.likes.filter(
                (id) => String(id) !== String(currentUser.id)
              )
          : comment.likes;

        return {
          ...comment,
          isLiked: data.isLiked,
          likesCount: data.likesCount,
          likes: likesArray,
        };
      });

      return { ...currentPost, comments: updatedComments };
    });
  };

  const handleFollowStatusChange = (authorId, isFollowed) => {
    updatePostState((currentPost) => {
      const profile = currentPost.profile || {};
      const isTarget = String(profile._id || profile.id) === String(authorId);
      if (!isTarget) return currentPost;

      return {
        ...currentPost,
        isFollowed,
        profile: { ...profile, isFollowed },
      };
    });
  };

  const handleToggleFollow = async () => {
    if (!post) return { error: null };
    const authorId = post.profile?._id || post.profile?.id;
    if (!authorId) return { error: null };

    const isFollowed = post.isFollowed ?? post.profile?.isFollowed ?? false;
    const nextFollowed = !isFollowed;

    handleFollowStatusChange(authorId, nextFollowed);

    const apiMethod = isFollowed ? unfollowUserApi : followUserApi;
    const { error: followError } = await apiMethod({ targetUserId: authorId });

    if (followError) {
      handleFollowStatusChange(authorId, isFollowed);
      const apiMessage =
        followError.response?.data?.message || followError.message;
      setError(apiMessage || followError);
      return {
        error:
          apiMessage ||
          followError?.message ||
          "Unable to update follow status",
      };
    }

    setError(null);
    return { error: null };
  };

  const handlePostUpdated = (updatedPost) => {
    setPost((prev) => ({
      ...(prev || {}),
      ...updatedPost,
    }));
  };

  const handlePostDeleted = () => {
    navigate("/", { replace: true });
  };

  const handleClose = () => {
    navigate(-1);
  };

  if (!post && loading) {
    return (
      <section className={styles.page}>
        <LoadingErrorOutput loading={loading} error={error} />
      </section>
    );
  }

  if (!post) {
    return (
      <section className={styles.page}>
        <LoadingErrorOutput
          loading={loading}
          error={error || new Error("Post not found")}
        />
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <PostModal
        post={post}
        onClose={handleClose}
        onToggleLike={handleToggleLike}
        onAddComment={handleAddComment}
        onToggleCommentLike={handleToggleCommentLike}
        currentUser={currentUser}
        onFollowStatusChange={handleFollowStatusChange}
        onToggleFollow={handleToggleFollow}
        onNavigateProfile={(userId) => navigate(`/profile/${userId}`)}
        isPageView
        onPostUpdated={handlePostUpdated}
        onPostDeleted={handlePostDeleted}
      />
    </section>
  );
};

export default PostPage;
