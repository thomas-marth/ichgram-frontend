import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Post from "./Post/Post";
import PostModal from "./PostModal";
import CreatePost from "../CreatePost/CreatePost";
import testUserAvatar from "../../assets/images/test-user.jpg";
import doneIcon from "../../assets/icons/done.svg";
import LoadingErrorOutput from "../../shared/components/LoadingErrorOutput/LoadingErrorOutput";
import { getFeedPostsApi, updatePostApi } from "../../shared/api/post-api";
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
import { mapPostsWithUserRelations } from "../../shared/utils/postRelations";
import {
  adaptComment,
  adaptFeedPost,
  normalizeLikedPostIds,
} from "../../shared/utils/postAdapter";

import styles from "./PostFeed.module.css";

const PostFeed = () => {
  const navigate = useNavigate();
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
  const [editingPost, setEditingPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasFetchedFeed, setHasFetchedFeed] = useState(false);

  const updatePostById = useCallback((postId, updater) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === postId ? updater(post) : post))
    );
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchFeed = async () => {
      setLoading(true);
      setError(null);
      setHasFetchedFeed(false);
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
        setHasFetchedFeed(true);
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

  const handleNavigateToProfile = (userId) => {
    if (!userId) return;
    navigate(`/profile/${userId}`);
  };

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

  const handleFollowStatusChange = (authorId, isFollowed) => {
    if (!authorId) return;

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        const postAuthorId = post.profile?._id || post.profile?.id;
        if (String(postAuthorId) !== String(authorId)) return post;

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
    setSelectedPostId(null);
  };

  const handleEditSuccess = (updatedPost) => {
    const updatedId = updatedPost?.id || updatedPost?._id || editingPost?.id;
    if (!updatedId) return;

    updatePostById(updatedId, (post) => ({
      ...post,
      ...updatedPost,
      comments: post.comments || [],
      commentsCount: post.commentsCount,
      likesCount: post.likesCount,
      isLiked: post.isLiked,
      profile: updatedPost?.author
        ? {
            ...post.profile,
            id: updatedPost.author._id || updatedPost.author.id,
            _id: updatedPost.author._id || updatedPost.author.id,
            username: updatedPost.author.username || post.profile?.username,
            avatar: updatedPost.author.avatar || post.profile?.avatar,
          }
        : post.profile,
    }));

    setEditingPost(null);
  };

  const handlePostDeleted = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.filter((post) => String(post.id) !== String(postId))
    );
    setSelectedPostId(null);
  };

  const handleViewPost = (postId) => {
    if (!postId) return;
    navigate(`/posts/${postId}`);
  };

  const handleToggleFollow = async (post) => {
    const authorId = post?.profile?._id || post?.profile?.id;
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

  const selectedPost = posts.find((post) => post.id === selectedPostId) || null;

  if (!hasFetchedFeed) {
    return (
      <section className={styles.feed}>
        <LoadingErrorOutput loading={loading} error={error} />
      </section>
    );
  }

  return (
    <section className={styles.feed}>
      <LoadingErrorOutput loading={loading} error={error} />

      {posts.length > 0 && (
        <div className={styles.grid}>
          {posts.map((post) => (
            <div className={styles.card} key={post.id}>
              <Post
                post={post}
                onOpen={() => setSelectedPostId(post.id)}
                onToggleLike={() => handleToggleLike(post.id)}
                onToggleFollow={() => handleToggleFollow(post)}
                onNavigateProfile={handleNavigateToProfile}
              />
            </div>
          ))}
        </div>
      )}

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
          onFollowStatusChange={(authorId, isFollowed) =>
            handleFollowStatusChange(authorId, isFollowed)
          }
          onToggleFollow={() => handleToggleFollow(selectedPost)}
          onNavigateProfile={handleNavigateToProfile}
          onEditPost={handleEditPost}
          onPostDeleted={handlePostDeleted}
          onViewPost={handleViewPost}
        />
      )}

      {editingPost && (
        <CreatePost
          onClose={() => setEditingPost(null)}
          mode="edit"
          initialValues={{
            description: editingPost.description || "",
            image: editingPost.image,
          }}
          title="Edit post"
          submitLabel="Edit"
          onSubmitForm={(values) => updatePostApi(editingPost.id, values)}
          onSuccess={handleEditSuccess}
        />
      )}
    </section>
  );
};

export default PostFeed;
