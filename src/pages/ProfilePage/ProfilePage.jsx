import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Profile from "../../modules/Profile/Profile";
import Explore from "../../modules/Explore/Explore";
import LoadingErrorOutput from "../../shared/components/LoadingErrorOutput/LoadingErrorOutput";
import PostModal from "../../modules/PostFeed/PostModal";
import { getUserPostsApi } from "../../shared/api/post-api";
import { getUserById } from "../../shared/api/user-api";
import { selectUser } from "../../redux/auth/authSelectors";
import { subscribeToPostCreated } from "../../shared/utils/postEvents";

import styles from "./ProfilePage.module.css";

const normalizePosts = (posts = []) =>
  posts.map((post) => {
    const author = post.author || post.profile || {};
    const authorId = author._id || author.id || author;

    return {
      id: post._id || post.id,
      image: post.image,
      alt: post.description || "Post image",
      descriptionBody: post.description || "",
      likesCount: post.totalLikes ?? post.likesCount ?? 0,
      comments: post.comments ?? [],
      isLiked: Boolean(post.isLiked),
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

const ProfilePage = () => {
  const { id } = useParams();
  const currentUser = useSelector(selectUser);

  const activeProfileId = useMemo(
    () => id ?? currentUser?.id ?? null,
    [currentUser?.id, id]
  );

  const [profileData, setProfileData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

      try {
        const [userInfo, userPosts] = await Promise.all([
          getUserById(activeProfileId),
          getUserPostsApi(activeProfileId),
        ]);

        if (!isMounted) return;

        setProfileData({ ...userInfo, id: userInfo.id || userInfo._id });
        setPosts(normalizePosts(userPosts));
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
  }, [activeProfileId]);

  useEffect(() => {
    const unsubscribe = subscribeToPostCreated((newPost) => {
      const ownerId =
        newPost?.profile?.id ||
        newPost?.profile?._id ||
        newPost?.author?._id ||
        newPost?.author?.id ||
        newPost?.author;

      if (!ownerId || String(ownerId) !== String(activeProfileId)) return;

      const normalizedPost = normalizePosts([newPost])[0];
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
  }, [activeProfileId]);

  const handleToggleLike = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id !== postId) return post;

        const nextLiked = !post.isLiked;
        const nextLikesCount = (post.likesCount ?? 0) + (nextLiked ? 1 : -1);

        return {
          ...post,
          isLiked: nextLiked,
          likesCount: Math.max(0, nextLikesCount),
        };
      })
    );
  };

  const handleAddComment = (postId, text) => {
    const newComment = {
      id: `c-${postId}-${Date.now()}`,
      user: currentUserProfile,
      text,
      createdAt: new Date().toISOString(),
      likes: [],
    };

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, comments: [...(post.comments || []), newComment] }
          : post
      )
    );
  };

  const handleToggleCommentLike = (postId, commentId) => {
    if (!currentUserProfile?.id) return;

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id !== postId) return post;

        const updatedComments = (post.comments || []).map((comment) => {
          if (comment.id !== commentId) return comment;

          const hasLiked = comment.likes?.includes(currentUserProfile.id);
          const nextLikes = hasLiked
            ? comment.likes.filter((id) => id !== currentUserProfile.id)
            : [...(comment.likes || []), currentUserProfile.id];

          return { ...comment, likes: nextLikes };
        });

        return { ...post, comments: updatedComments };
      })
    );
  };

  const selectedPost = posts.find((post) => post.id === selectedPostId) || null;

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

  return (
    <div className={styles.profilePage}>
      <Profile
        key={profileData?.id ?? activeProfileId}
        user={profileData}
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
        />
      )}
      <LoadingErrorOutput loading={loading} error={error} />
    </div>
  );
};

export default ProfilePage;
