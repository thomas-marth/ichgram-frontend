import testUserAvatar from "../../assets/images/test-user.jpg";

export const adaptFeedPost = (post) => {
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

export const adaptComment = (comment, fallbackUser) => {
  const likes = Array.isArray(comment.likes) ? comment.likes : [];

  return {
    ...comment,
    id: comment._id || comment.id,
    user: comment.user || fallbackUser,
    likes,
    likesCount: comment.likesCount ?? likes.length ?? 0,
  };
};

export const normalizeLikedPostIds = (likes = []) =>
  (likes || [])
    .map((like) =>
      typeof like === "object" && like !== null ? like.post || like.id : like
    )
    .filter(Boolean)
    .map(String);
