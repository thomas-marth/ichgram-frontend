import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Post from "./Post/Post";
import PostModal from "./PostModal";
import testUserAvatar from "../../assets/images/test-user.jpg";
import doneIcon from "../../assets/icons/done.svg";
import LoadingErrorOutput from "../../shared/components/LoadingErrorOutput/LoadingErrorOutput";
import { getFeedPostsApi } from "../../shared/api/post-api";
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
import { mapPostsWithUserRelations } from "../../shared/utils/postRelations";

import styles from "./PostFeed.module.css";

const adaptFeedPost = (post) => {
  const author = post.author || {};

  const descriptionBody =
    post.description || post.captionBody || post.descriptionBody || "";

  return {
    ...post,
    id: post._id || post.id,
    profile: {
      id: author._id || author.id,
      username: author.username || "Unknown",
      avatar: author.avatar || testUserAvatar,
      isFollowed: post.isFollowed ?? author.isFollowed,
    },
    createdAt: post.createdAt,
    image: post.image,
    likesCount: post.totalLikes ?? post.likesCount ?? 0,
    comments: Array.isArray(post.comments) ? post.comments : [],
    commentsCount: post.totalComments ?? post.commentsCount ?? 0,
    descriptionBody,
    captionBody: descriptionBody,
    isLiked: Boolean(post.isLiked),
  };
};

const adaptComment = (comment, fallbackUser) => {
  const likes = Array.isArray(comment.likes) ? comment.likes : [];

  return {
    ...comment,
    id: comment._id || comment.id,
    user: comment.user || fallbackUser,
    likes,
    likesCount: comment.likesCount ?? likes.length ?? 0,
  };
};

const normalizeLikedPostIds = (likes = []) =>
  (likes || [])
    .map((like) =>
      typeof like === "object" && like !== null ? like.post || like.id : like
    )
    .filter(Boolean)
    .map(String);

const PostFeed = () => {
  const authUser = useSelector((state) => state.auth.user);
  const authUserId = authUser?._id || authUser?.id || null;
  const currentUser = useMemo(
    () => ({
      id: authUserId || "current-user",
      username: authUser?.username || authUser?.name || "You",
      avatar: authUser?.avatar || authUser?.profile_image || testUserAvatar,
    }),
    [authUser, authUserId]
  );

  const [posts, setPosts] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updatePostById = useCallback((postId, updater) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === postId ? updater(post) : post))
    );
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchFeed = async () => {
      setLoading(true);
      try {
        const [feedResponse, likedPostsResponse] = await Promise.all([
          getFeedPostsApi(),
          authUserId
            ? getUserLikedPostsApi(authUserId)
            : Promise.resolve({ data: [] }),
        ]);

        if (!isMounted) return;

        const likedPostIds = normalizeLikedPostIds(likedPostsResponse.data);

        const mappedPosts = mapPostsWithUserRelations(
          (feedResponse.posts || [])
            .map((post) => adaptFeedPost(post))
            .filter((post) => post?.id),
          {
            currentUserId: authUserId,
            likedPostIds,
            defaultIsFollowed: true,
          }
        );

        setPosts(mappedPosts);
        setError(null);
      } catch (fetchError) {
        if (isMounted) {
          setError(fetchError);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFeed();

    return () => {
      isMounted = false;
    };
  }, [authUserId]);

  useEffect(() => {
    if (!selectedPostId) return undefined;

    let isMounted = true;

    const fetchComments = async () => {
      const { data, error: commentsError } = await getPostCommentsApi(
        selectedPostId
      );

      if (!isMounted) return;

      if (commentsError) {
        setError(commentsError);
        return;
      }

      const mappedComments = (data || []).map((comment) =>
        adaptComment(comment, currentUser)
      );

      updatePostById(selectedPostId, (post) => ({
        ...post,
        comments: mappedComments,
        commentsCount: mappedComments.length,
      }));
      setError(null);
    };

    fetchComments();

    return () => {
      isMounted = false;
    };
  }, [currentUser, selectedPostId, updatePostById]);

  const handleToggleLike = async (postId) => {
    const targetPost = posts.find((post) => String(post.id) === String(postId));
    const isLikedNext = targetPost ? !targetPost.isLiked : true;

    const likesDelta = isLikedNext ? 1 : -1;

    updatePostById(postId, (post) => {
      const likesCount = Math.max(0, (post.likesCount || 0) + likesDelta);

      return {
        ...post,
        isLiked: isLikedNext,
        likesCount,
      };
    });

    const apiMethod = isLikedNext ? likePostApi : unlikePostApi;
    const { error: likeError } = await apiMethod(postId);

    if (likeError) {
      const status = likeError?.response?.status;
      const apiMessage = likeError?.response?.data?.message;

      const isAlreadyLiked = isLikedNext && status === 409;
      const isAlreadyUnliked = !isLikedNext && status === 404;

      if (isAlreadyLiked || isAlreadyUnliked) {
        setError(null);
        return;
      }

      updatePostById(postId, (post) => {
        const likesDelta = isLikedNext ? -1 : 1;
        const likesCount = Math.max(0, (post.likesCount || 0) + likesDelta);

        return {
          ...post,
          isLiked: !isLikedNext,
          likesCount,
        };
      });

      setError(apiMessage || likeError);
    }
  };

  const handleAddComment = async (postId, text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const { data, error: commentError } = await createCommentApi(
      postId,
      trimmed
    );

    if (commentError || !data) {
      setError(commentError || new Error("Failed to add comment"));
      return;
    }

    const newComment = adaptComment(data, currentUser);

    updatePostById(postId, (post) => {
      const comments = [...(post.comments || []), newComment];

      return {
        ...post,
        comments,
        commentsCount: comments.length,
      };
    });
  };

  const handleToggleCommentLike = async (postId, commentId) => {
    let isLikedNext = false;

    updatePostById(postId, (post) => {
      const updatedComments = (post.comments || []).map((comment) => {
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

      return { ...post, comments: updatedComments };
    });

    const { data, error: toggleError } = await toggleCommentLikeApi(commentId);

    if (toggleError || !data) {
      updatePostById(postId, (post) => {
        const updatedComments = (post.comments || []).map((comment) => {
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

        return { ...post, comments: updatedComments };
      });
      setError(toggleError || new Error("Unable to toggle comment like"));
      return;
    }

    updatePostById(postId, (post) => {
      const updatedComments = (post.comments || []).map((comment) => {
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

      return { ...post, comments: updatedComments };
    });
  };

  const handleFollowStatusChange = (postId, isFollowed) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id !== postId) return post;

        const updatedProfile = post.profile
          ? { ...post.profile, isFollowed }
          : post.profile;

        return {
          ...post,
          isFollowed,
          profile: updatedProfile,
        };
      })
    );
  };

  const selectedPost = posts.find((post) => post.id === selectedPostId) || null;

  return (
    <section className={styles.feed}>
      <LoadingErrorOutput loading={loading} error={error} />

      <div className={styles.grid}>
        {posts.map((post) => (
          <div className={styles.card} key={post.id}>
            <Post
              post={post}
              onOpen={() => setSelectedPostId(post.id)}
              onToggleLike={() => handleToggleLike(post.id)}
            />
          </div>
        ))}
        {!loading && !error && posts.length === 0 && (
          <p className={styles.emptyState}>Your feed is empty for now.</p>
        )}
      </div>

      <div className={styles.doneWrapper}>
        <img src={doneIcon} alt="All updates viewed" width={83} height={83} />
        <p className={styles.doneTitle}>You've seen all the updates</p>
        <p className={styles.doneSubtitle}>
          You have viewed all new publications
        </p>
      </div>

      {selectedPost && (
        <PostModal
          post={selectedPost}
          onClose={() => setSelectedPostId(null)}
          onToggleLike={() => handleToggleLike(selectedPost.id)}
          onAddComment={(text) => handleAddComment(selectedPost.id, text)}
          onToggleCommentLike={(commentId) =>
            handleToggleCommentLike(selectedPost.id, commentId)
          }
          currentUser={currentUser}
          onFollowStatusChange={(isFollowed) =>
            handleFollowStatusChange(selectedPost.id, isFollowed)
          }
        />
      )}
    </section>
  );
};

export default PostFeed;
