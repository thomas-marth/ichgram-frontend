const toStringId = (value) =>
  value === undefined || value === null ? "" : String(value);

const getPostId = (post = {}) => post._id || post.id;

const getAuthorData = (post = {}) => {
  const author = post.author || post.profile || {};

  return {
    id: author._id || author.id,
    username: author.username,
    avatar: author.avatar,
    isFollowed: author.isFollowed,
  };
};

export const mapPostsWithUserRelations = (
  posts = [],
  {
    currentUserId,
    likedPostIds = [],
    followedUserIds = [],
    defaultIsFollowed = false,
  } = {}
) => {
  const likedIdsSet = new Set((likedPostIds || []).map(toStringId));
  const followedIdsSet = new Set(
    (followedUserIds || []).map(toStringId).filter(Boolean)
  );
  const hasFollowedIds = followedIdsSet.size > 0;
  const currentIdStr = toStringId(currentUserId);

  return (posts || []).map((post = {}) => {
    const postId = getPostId(post);
    const author = getAuthorData(post);
    const authorIdStr = toStringId(author.id);

    const isLiked =
      Boolean(post.isLiked) || (postId && likedIdsSet.has(toStringId(postId)));

    let isFollowed = post.isFollowed ?? author.isFollowed;

    if (isFollowed === undefined || isFollowed === null) {
      if (authorIdStr && hasFollowedIds) {
        isFollowed = followedIdsSet.has(authorIdStr);
      } else {
        isFollowed = Boolean(authorIdStr && defaultIsFollowed);
      }
    }

    const isOwnedByCurrentUser =
      Boolean(currentIdStr) && authorIdStr === currentIdStr;

    return {
      ...post,
      id: postId,
      profile: author,
      isLiked,
      isFollowed,
      isOwnedByCurrentUser,
      profileId: author.id,
      profileUsername: author.username,
    };
  });
};

export default mapPostsWithUserRelations;
