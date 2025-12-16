import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Post from "./Post/Post";
import PostModal from "./PostModal";
import testUserAvatar from "../../assets/images/test-user.jpg";
import doneIcon from "../../assets/icons/done.svg";
import LoadingErrorOutput from "../../shared/components/LoadingErrorOutput/LoadingErrorOutput";
import { getFeedPostsApi } from "../../shared/api/post-api";

import styles from "./PostFeed.module.css";

const adaptFeedPost = (post) => {
  const author = post.author || {};

  const descriptionBody =
    post.description || post.captionBody || post.descriptionBody || "";

  return {
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

const PostFeed = () => {
  const authUser = useSelector((state) => state.auth.user);
  const currentUser = useMemo(
    () => ({
      id: authUser?._id || authUser?.id || "current-user",
      username: authUser?.username || authUser?.name || "You",
      avatar: authUser?.avatar || authUser?.profile_image || testUserAvatar,
    }),
    [authUser]
  );

  const [posts, setPosts] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchFeed = async () => {
      setLoading(true);
      try {
        const { posts: feedPosts } = await getFeedPostsApi();
        if (!isMounted) return;

        const mappedPosts = (feedPosts || [])
          .map((post) => adaptFeedPost(post))
          .filter((post) => post?.id);

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
  }, []);

  const handleToggleLike = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id !== postId) return post;
        const nextLiked = !post.isLiked;
        return {
          ...post,
          isLiked: nextLiked,
          likesCount: post.likesCount + (nextLiked ? 1 : -1),
        };
      })
    );
  };

  const handleAddComment = (postId, text) => {
    const newComment = {
      id: `c-${postId}-${Date.now()}`,
      user: currentUser,
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
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id !== postId) return post;

        const updatedComments = (post.comments || []).map((comment) => {
          if (comment.id !== commentId) return comment;
          const hasLiked = comment.likes?.includes(currentUser.id);
          const nextLikes = hasLiked
            ? comment.likes.filter((id) => id !== currentUser.id)
            : [...(comment.likes || []), currentUser.id];

          return { ...comment, likes: nextLikes };
        });

        return { ...post, comments: updatedComments };
      })
    );
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
