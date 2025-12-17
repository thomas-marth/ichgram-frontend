import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import Profile from "../../modules/Profile/Profile";
import Explore from "../../modules/Explore/Explore";
import LoadingErrorOutput from "../../shared/components/LoadingErrorOutput/LoadingErrorOutput";
import PostModal from "../../modules/PostFeed/PostModal";
import EditPost from "../../modules/EditPost/EditPost";
import { getUserPostsApi, updatePostApi } from "../../shared/api/post-api";
import { getUserById } from "../../shared/api/user-api";
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
import { selectUser } from "../../redux/auth/authSelectors";
import { subscribeToPostCreated } from "../../shared/utils/postEvents";

import styles from "./ProfilePage.module.css";

const normalizeComment = (comment = {}, currentUserId) => {
  const likesArray = comment.likes || [];
  const likesCount =
    comment.likesCount ?? (Array.isArray(likesArray) ? likesArray.length : 0);

  const commentUser = comment.user || comment.author || {};

  const isLiked =
    comment.isLiked ??
    likesArray.some((id) => String(id) === String(currentUserId));

  return {
    id: comment._id || comment.id,
    text: comment.text,
    createdAt: comment.createdAt,
    likes: Array.isArray(likesArray) ? likesArray : [],
    likesCount,
    isLiked,
    user: {
      id: commentUser._id || commentUser.id,
      username: commentUser.username,
      avatar: commentUser.avatar,
    },
  };
};

const normalizePosts = (posts = [], likedPostIds = [], currentUserId) =>
  posts.map((post) => {
    const author = post.author || post.profile || {};
    const authorId = author._id || author.id || author;
    const postId = post._id || post.id;
    const postComments = Array.isArray(post.comments) ? post.comments : [];
    const normalizedComments = postComments.map((comment) =>
      normalizeComment(comment, currentUserId)
    );

    return {
      id: postId,
      image: post.image,
      alt: post.description || "Post image",
      descriptionBody: post.description || "",
      likesCount: post.totalLikes ?? post.likesCount ?? 0,
      comments: normalizedComments,
      commentsCount:
        post.totalComments ?? post.commentsCount ?? normalizedComments.length,
      isLiked:
        likedPostIds.includes(String(postId)) || Boolean(post.isLiked ?? false),
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      profile: {
        id: authorId,
        username: author.username,
        avatar: author.avatar,
        isFollowed: author.isFollowed,
      },
      isFollowed: post.isFollowed,
    };
  });

const normalizeLikedPostIds = (likes = []) =>
  (likes || [])
    .map((like) =>
      typeof like === "object" && like !== null ? like.post || like.id : like
    )
    .filter(Boolean)
    .map(String);

const ProfilePage = () => {
  const { id } = useParams();
  const currentUser = useSelector(selectUser);
  const navigate = useNavigate();

  const activeProfileId = useMemo(
    () => id ?? currentUser?.id ?? null,
    [currentUser?.id, id]
  );

  const [profileData, setProfileData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleNavigateToProfile = (userId) => {
    if (!userId) return;
    navigate(`/profile/${userId}`);
  };

  const currentUserProfile = useMemo(
    () => ({
      id: currentUser?._id || currentUser?.id,
      username: currentUser?.username || currentUser?.name || "You",
      avatar: currentUser?.avatar || currentUser?.profile_image,
    }),
    [
      currentUser?._id,
      currentUser?.avatar,
      currentUser?.id,
      currentUser?.name,
      currentUser?.profile_image,
      currentUser?.username,
    ]
  );

  useEffect(() => {
    if (!profileData?.id) return;

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        const ownerId = post.profile?.id || post.profile?._id;
        if (!ownerId || String(ownerId) !== String(profileData.id)) return post;

        const nextFollowed = Boolean(profileData.isFollowed);
        const nextProfile = post.profile
          ? { ...post.profile, isFollowed: nextFollowed }
          : post.profile;

        return {
          ...post,
          isFollowed: nextFollowed,
          profile: nextProfile,
        };
      })
    );
  }, [profileData?.id, profileData?.isFollowed]);

  useEffect(() => {
    if (!activeProfileId) return undefined;

    let isMounted = true;

    const fetchProfileData = async () => {
      setLoading(true);
      setError(null);
      setProfileData(null);
      setPosts([]);

      try {
        const [userInfo, userPosts, likedPostsResult] = await Promise.all([
          getUserById(activeProfileId),
          getUserPostsApi(activeProfileId),
          currentUserProfile.id
            ? getUserLikedPostsApi(currentUserProfile.id)
            : Promise.resolve({ data: [] }),
        ]);

        if (!isMounted) return;

        setProfileData({ ...userInfo, id: userInfo.id || userInfo._id });
        const likedPostIds = normalizeLikedPostIds(likedPostsResult.data);
        setPosts(
          normalizePosts(userPosts, likedPostIds, currentUserProfile.id)
        );
      } catch (err) {
        if (!isMounted) return;

        const message = err?.response?.data?.message || err.message;
        setError(message);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProfileData();

    return () => {
      isMounted = false;
    };
  }, [activeProfileId, currentUserProfile.id]);

  useEffect(() => {
    const unsubscribe = subscribeToPostCreated((newPost) => {
      const ownerId =
        newPost?.profile?.id ||
        newPost?.profile?._id ||
        newPost?.author?._id ||
        newPost?.author?.id ||
        newPost?.author;

      if (!ownerId || String(ownerId) !== String(activeProfileId)) return;

      const normalizedPost = normalizePosts(
        [newPost],
        [],
        currentUserProfile.id
      )[0];
      if (!normalizedPost) return;

      setPosts((prevPosts) => {
        const alreadyExists = prevPosts.some(
          (post) => String(post.id) === String(normalizedPost.id)
        );
        if (alreadyExists) return prevPosts;

        return [normalizedPost, ...prevPosts];
      });

      setProfileData((prevProfile) => {
        if (!prevProfile) return prevProfile;

        return {
          ...prevProfile,
          totalPosts: Math.max(0, (prevProfile.totalPosts ?? 0) + 1),
        };
      });
    });

    return () => {
      unsubscribe?.();
    };
  }, [activeProfileId, currentUserProfile.id]);

  useEffect(() => {
    if (!selectedPostId) return undefined;

    let isMounted = true;

    const loadComments = async () => {
      const { data, error } = await getPostCommentsApi(selectedPostId);
      if (error || !isMounted) return;

      const normalized = (data || []).map((comment) =>
        normalizeComment(comment, currentUserProfile.id)
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === selectedPostId
            ? {
                ...post,
                comments: normalized,
                commentsCount: normalized.length,
              }
            : post
        )
      );
    };

    loadComments();

    return () => {
      isMounted = false;
    };
  }, [currentUserProfile.id, selectedPostId]);

  const handleToggleLike = async (postId) => {
    const targetPost = posts.find((post) => post.id === postId);
    if (!targetPost) return;

    const wasLiked = Boolean(targetPost.isLiked);
    const prevLikesCount = targetPost.likesCount ?? 0;
    const nextLiked = !wasLiked;
    const nextLikesCount = Math.max(0, prevLikesCount + (nextLiked ? 1 : -1));

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, isLiked: nextLiked, likesCount: nextLikesCount }
          : post
      )
    );

    const { error } = nextLiked
      ? await likePostApi(postId)
      : await unlikePostApi(postId);

    if (error) {
      const message = error?.response?.data?.message || error.message;
      setError(message);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, isLiked: wasLiked, likesCount: prevLikesCount }
            : post
        )
      );
    }
  };

  const handleAddComment = async (postId, text) => {
    const trimmed = text.trim();
    if (!trimmed || !currentUserProfile?.id) return;

    const tempCommentId = `temp-${postId}-${Date.now()}`;
    const optimisticComment = {
      id: tempCommentId,
      text: trimmed,
      createdAt: new Date().toISOString(),
      likes: [],
      likesCount: 0,
      isLiked: false,
      user: currentUserProfile,
    };

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [...(post.comments || []), optimisticComment],
              commentsCount:
                (post.commentsCount ?? post.comments?.length ?? 0) + 1,
            }
          : post
      )
    );

    const { data, error } = await createCommentApi(postId, trimmed);

    if (error) {
      const message = error?.response?.data?.message || error.message;
      setError(message);
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id !== postId) return post;

          const filteredComments = (post.comments || []).filter(
            (comment) => comment.id !== tempCommentId
          );

          return {
            ...post,
            comments: filteredComments,
            commentsCount: Math.max(
              0,
              (post.commentsCount ?? filteredComments.length) - 1
            ),
          };
        })
      );
      return;
    }

    const savedComment = normalizeComment(data, currentUserProfile.id);

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id !== postId) return post;

        const updatedComments = (post.comments || []).map((comment) =>
          comment.id === tempCommentId ? savedComment : comment
        );

        return {
          ...post,
          comments: updatedComments,
          commentsCount: post.commentsCount ?? updatedComments.length,
        };
      })
    );
  };

  const handleToggleCommentLike = async (postId, commentId) => {
    if (!currentUserProfile?.id) return;

    const targetPost = posts.find((post) => post.id === postId);
    const targetComment = targetPost?.comments?.find(
      (comment) => comment.id === commentId
    );

    if (!targetComment) return;

    const hasLiked = Boolean(
      targetComment.isLiked ??
        targetComment.likes?.includes(currentUserProfile.id)
    );
    const prevLikesCount =
      targetComment.likesCount ?? targetComment.likes?.length ?? 0;
    const nextLikesCount = Math.max(0, prevLikesCount + (hasLiked ? -1 : 1));

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id !== postId) return post;

        const updatedComments = (post.comments || []).map((comment) => {
          if (comment.id !== commentId) return comment;

          const updatedLikes = hasLiked
            ? (comment.likes || []).filter((id) => id !== currentUserProfile.id)
            : [...(comment.likes || []), currentUserProfile.id];

          return {
            ...comment,
            likes: updatedLikes,
            likesCount: nextLikesCount,
            isLiked: !hasLiked,
          };
        });

        return { ...post, comments: updatedComments };
      })
    );

    const { data, error } = await toggleCommentLikeApi(commentId);
    if (error) {
      const message = error?.response?.data?.message || error.message;
      setError(message);
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id !== postId) return post;

          const revertedComments = (post.comments || []).map((comment) => {
            if (comment.id !== commentId) return comment;

            return {
              ...comment,
              likes: hasLiked
                ? [...(comment.likes || []), currentUserProfile.id]
                : (comment.likes || []).filter(
                    (id) => id !== currentUserProfile.id
                  ),
              likesCount: prevLikesCount,
              isLiked: hasLiked,
            };
          });

          return { ...post, comments: revertedComments };
        })
      );
      return;
    }

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id !== postId) return post;

        const syncedComments = (post.comments || []).map((comment) => {
          if (comment.id !== commentId) return comment;

          const isLiked = Boolean(data?.isLiked);
          const likesCount = data?.likesCount ?? comment.likesCount;

          const normalizedLikes = isLiked
            ? [...new Set([...(comment.likes || []), currentUserProfile.id])]
            : (comment.likes || []).filter(
                (id) => id !== currentUserProfile.id
              );

          return {
            ...comment,
            likes: normalizedLikes,
            likesCount,
            isLiked,
          };
        });

        return { ...post, comments: syncedComments };
      })
    );
  };

  const selectedPost = posts.find((post) => post.id === selectedPostId) || null;

  const handlePostUpdated = (updatedPost) => {
    const updatedId = updatedPost?.id || updatedPost?._id;
    if (!updatedId) return;

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === updatedId
          ? {
              ...post,
              ...updatedPost,
              image: updatedPost?.image || post.image,
              createdAt: post.createdAt,
              profile: updatedPost?.author
                ? {
                    ...post.profile,
                    id: updatedPost.author._id || updatedPost.author.id,
                    _id: updatedPost.author._id || updatedPost.author.id,
                    username:
                      updatedPost.author.username || post.profile?.username,
                    avatar: updatedPost.author.avatar || post.profile?.avatar,
                  }
                : post.profile,
            }
          : post
      )
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
    handlePostUpdated(updatedPost);
    setEditingPost(null);
  };

  const syncPostsFollowState = (nextIsFollowed) =>
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        const ownerId = post.profile?.id || post.profile?._id;
        if (!ownerId || String(ownerId) !== String(activeProfileId))
          return post;

        const nextProfile = post.profile
          ? { ...post.profile, isFollowed: nextIsFollowed }
          : post.profile;

        return { ...post, isFollowed: nextIsFollowed, profile: nextProfile };
      })
    );

  const handleProfileFollowChange = (nextProfile) => {
    if (!nextProfile) return;

    const nextIsFollowed = Boolean(nextProfile.isFollowed);
    setProfileData(nextProfile);
    syncPostsFollowState(nextIsFollowed);
  };

  const handleModalFollowChange = (nextIsFollowed) => {
    syncPostsFollowState(nextIsFollowed);

    setProfileData((prevProfile) => {
      if (!prevProfile) return prevProfile;

      const isCurrentlyFollowed = Boolean(prevProfile.isFollowed);
      if (isCurrentlyFollowed === nextIsFollowed) return prevProfile;

      const followersDelta = nextIsFollowed ? 1 : -1;
      return {
        ...prevProfile,
        isFollowed: nextIsFollowed,
        followers: Math.max(0, (prevProfile.followers ?? 0) + followersDelta),
      };
    });
  };

  const handleViewPost = (postId, postData) => {
    if (!postId) return;
    navigate(`/posts/${postId}`, { state: { post: postData } });
  };

  if (!profileData) {
    return (
      <div className={styles.profilePage}>
        <LoadingErrorOutput loading={loading} error={error} />
      </div>
    );
  }

  return (
    <div className={styles.profilePage}>
      <Profile
        key={profileData?.id ?? activeProfileId}
        user={profileData}
        postsCount={posts.length}
        onFollowChange={handleProfileFollowChange}
      />
      <Explore
        posts={posts}
        variant="profile"
        onPostSelect={(postId) => setSelectedPostId(postId)}
      />
      {selectedPost && (
        <PostModal
          post={selectedPost}
          onClose={() => setSelectedPostId(null)}
          onToggleLike={() => handleToggleLike(selectedPost.id)}
          onAddComment={(text) => handleAddComment(selectedPost.id, text)}
          onToggleCommentLike={(commentId) =>
            handleToggleCommentLike(selectedPost.id, commentId)
          }
          currentUser={currentUserProfile}
          onFollowStatusChange={handleModalFollowChange}
          onNavigateProfile={handleNavigateToProfile}
          onEditPost={handleEditPost}
          onViewPost={handleViewPost}
        />
      )}
      <LoadingErrorOutput loading={loading} error={error} />

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

export default ProfilePage;
