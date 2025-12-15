import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Post from "./Post/Post";
import PostModal from "./PostModal";
import postImage from "../../assets/images/test-post-large.jpg";
import testUserAvatar from "../../assets/images/test-user.jpg";
import doneIcon from "../../assets/icons/done.svg";

import styles from "./PostFeed.module.css";

const buildInitialPosts = () => [
  {
    id: 1,
    profile: { username: "sashaa", avatar: testUserAvatar },
    timeAgo: "2 week",
    createdAt: "2024-12-10T08:30:00Z",
    image: postImage,
    likesCount: 101824,
    captionBody:
      "It’s golden, Ponyboy! | heyyyyy \n| Morning view is just amazing!",
    comments: [
      {
        id: "c-1",
        user: { username: "olivia", avatar: testUserAvatar },
        text: "Love this view!",
        createdAt: "2024-12-11T12:00:00Z",
        likes: ["friend-1"],
      },
      {
        id: "c-2",
        user: { username: "mike", avatar: testUserAvatar },
        text: "Looks amazing 🤩",
        createdAt: "2024-12-12T15:40:00Z",
        likes: [],
      },
    ],
    isLiked: true,
  },
  {
    id: 2,
    profile: { username: "sashaa", avatar: testUserAvatar },
    timeAgo: "1 week",
    createdAt: "2024-12-15T10:00:00Z",
    image: postImage,
    likesCount: 21824,
    captionBody:
      "It’s golden, Ponyboy! | heyyyyy  \n| Morning view is just amazing!",
    comments: [
      {
        id: "c-3",
        user: { username: "lisa", avatar: testUserAvatar },
        text: "So much color in this shot!",
        createdAt: "2024-12-16T08:15:00Z",
        likes: [],
      },
    ],
    isLiked: false,
  },
  {
    id: 3,
    profile: { username: "sashaa", avatar: testUserAvatar },
    timeAgo: "5 days",
    createdAt: "2024-12-18T09:00:00Z",
    image: postImage,
    likesCount: 91824,
    captionBody:
      "It’s golden, Ponyboy! | heyyyyy \n| Morning view is just amazing!",
    comments: [],
    isLiked: false,
  },
  {
    id: 4,
    profile: { username: "sashaa", avatar: testUserAvatar },
    timeAgo: "2 days",
    createdAt: "2024-12-20T14:20:00Z",
    image: postImage,
    likesCount: 45824,
    captionBody:
      "It’s golden, Ponyboy! | heyyyyy \n| Morning view is just amazing!",
    comments: [
      {
        id: "c-4",
        user: { username: "katya", avatar: testUserAvatar },
        text: "Bring me there, please!",
        createdAt: "2024-12-21T07:50:00Z",
        likes: ["friend-2", "friend-3"],
      },
    ],
    isLiked: true,
  },
];

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

  const [posts, setPosts] = useState(buildInitialPosts);
  const [selectedPostId, setSelectedPostId] = useState(null);

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
      <div className={styles.grid}>
        {posts.map((post) => (
          <div className={styles.card} key={post.id}>
            <Post
              post={post}
              onOpen={() => setSelectedPostId(post.id)}
              onFollowStatusChange={(isFollowed) =>
                handleFollowStatusChange(selectedPost.id, isFollowed)
              }
            />
          </div>
        ))}
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
