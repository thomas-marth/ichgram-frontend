import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Explore from "../../modules/Explore/Explore";
import LoadingErrorOutput from "../../shared/components/LoadingErrorOutput/LoadingErrorOutput";
import PostModal from "../../modules/PostFeed/PostModal";
import { getPostsApi } from "../../shared/api/post-api.js";
import {
  getPostLikesApi,
  getUserLikedPostsApi,
  likePostApi,
  unlikePostApi,
} from "../../shared/api/like-api";
import {
  createCommentApi,
  getPostCommentsApi,
  toggleCommentLikeApi,
} from "../../shared/api/comment-api";
import {
  followUserApi,
  getUserFollowingApi,
  unfollowUserApi,
} from "../../shared/api/follow-api";
import { mapPostsWithUserRelations } from "../../shared/utils/postRelations";
import {
  adaptComment,
  adaptFeedPost,
  normalizeLikedPostIds,
} from "../../shared/utils/postAdapter";
import testUserAvatar from "../../assets/images/test-user.jpg";

import styles from "./ExplorePage.module.css";

export default function ExplorePage() {
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updatePostById = useCallback((postId, updater) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        String(post.id) === String(postId) ? updater(post) : post
      )
    );
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchExplorePosts = async () => {
      setLoading(true);
      setError(null);

      try {
        const emptyListResponse = Promise.resolve({ data: [] });
        const [exploreResponse, likedPostsResponse, followingResponse] =
          await Promise.all([
            getPostsApi(),
            authUserId ? getUserLikedPostsApi(authUserId) : emptyListResponse,
            authUserId ? getUserFollowingApi(authUserId) : emptyListResponse,
          ]);

        if (!isMounted) return;

        const likedPostIds = normalizeLikedPostIds(likedPostsResponse.data);
        const followedUserIds = (followingResponse.data || [])
          .map((relation) => {
            const followingUser =
              relation.following || relation.user || relation.targetUser;
            return (
              followingUser?._id || followingUser?.id || relation.following
            );
          })
          .filter(Boolean)
          .map(String);
        const mappedPosts = mapPostsWithUserRelations(
          (exploreResponse.posts || [])
            .map((post) => adaptFeedPost(post))
            .filter((post) => post?.id),
          {
            currentUserId: authUserId,
            likedPostIds,
            followedUserIds,
            defaultIsFollowed: false,
          }
        );

        setPosts(mappedPosts);
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

    fetchExplorePosts();

    return () => {
      isMounted = false;
    };
  }, [authUserId]);

  useEffect(() => {
    if (!selectedPostId) return undefined;

    let isMounted = true;

    const fetchCommentsAndLikes = async () => {
      const [commentsResponse, likesResponse] = await Promise.all([
        getPostCommentsApi(selectedPostId),
        getPostLikesApi(selectedPostId),
      ]);

      if (!isMounted) return;

      if (commentsResponse.error || likesResponse.error) {
        setError(commentsResponse.error || likesResponse.error);
        return;
      }

      const mappedComments = (commentsResponse.data || []).map((comment) =>
        adaptComment(comment, currentUser)
      );

      const likes = Array.isArray(likesResponse.data) ? likesResponse.data : [];

      updatePostById(selectedPostId, (post) => ({
        ...post,
        comments: mappedComments,
        commentsCount: mappedComments.length,
        likes,
      }));
      setError(null);
    };

    fetchCommentsAndLikes();

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
      const existingLikes = Array.isArray(post.likes) ? post.likes : [];
      const currentUserId = currentUser.id;

      const likes = isLikedNext
        ? [
            {
              user: currentUserId,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            ...existingLikes,
          ]
        : existingLikes.filter(
            (like) =>
              String(like?.user?._id || like?.user?.id || like?.user) !==
              String(currentUserId)
          );

      return {
        ...post,
        isLiked: isLikedNext,
        likesCount,
        likes,
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
        const likesCount = Math.max(0, (post.likesCount || 0) - likesDelta);
        const existingLikes = Array.isArray(post.likes) ? post.likes : [];
        const currentUserId = currentUser.id;

        const likes = isLikedNext
          ? existingLikes.filter(
              (like) =>
                String(like?.user?._id || like?.user?.id || like?.user) !==
                String(currentUserId)
            )
          : [
              {
                user: currentUserId,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
              ...existingLikes,
            ];

        return {
          ...post,
          isLiked: !isLikedNext,
          likesCount,
          likes,
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

  const handleViewPost = (postId, postData) => {
    if (!postId) return;
    navigate(`/posts/${postId}`, { state: { post: postData } });
  };

  const handlePostDeleted = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.filter((post) => String(post.id) !== String(postId))
    );
    setSelectedPostId(null);
  };

  const selectedPost =
    posts.find((post) => String(post.id) === String(selectedPostId)) || null;

  return (
    <div className={styles.explorePage}>
      <Explore
        posts={posts}
        onPostSelect={(postId) => setSelectedPostId(postId)}
      />
      <LoadingErrorOutput error={error} loading={loading} />
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
          onPostDeleted={handlePostDeleted}
          onViewPost={handleViewPost}
        />
      )}
    </div>
  );
}
