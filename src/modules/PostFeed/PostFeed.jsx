import Post from "./Post/Post";
import postImage from "../../assets/images/test-post-large.jpg";
import testUserAvatar from "../../assets/images/test-user.jpg";
import doneIcon from "../../assets/icons/done.svg";

import styles from "./PostFeed.module.css";

const mockPosts = [
  {
    id: 1,
    profile: { username: "sashaa", avatar: testUserAvatar },
    timeAgo: "2 week",
    image: postImage,
    likesCount: 101824,
    captionBody:
      "𝘐𝘵’𝘴 𝒈𝒐𝒍𝒅𝒆𝒏, 𝘗𝘰𝘯𝘺𝘣𝘰𝘺! \nheyyyyy | Morning view is just amazing!",
    commentsCount: 732,
    isLiked: true,
  },
  {
    id: 2,
    profile: { username: "sashaa", avatar: testUserAvatar },
    timeAgo: "2 week",
    image: postImage,
    likesCount: 101824,
    captionBody:
      "𝘐𝘵’𝘴 𝒈𝒐𝒍𝒅𝒆𝒏, 𝘗𝘰𝘯𝘺𝘣𝘰𝘺! \nheyyyyy | Morning view is just amazing!",
    commentsCount: 732,
    isLiked: false,
  },
  {
    id: 3,
    profile: { username: "sashaa", avatar: testUserAvatar },
    timeAgo: "2 week",
    image: postImage,
    likesCount: 101824,
    captionBody:
      "𝘐𝘵’𝘴 𝒈𝒐𝒍𝒅𝒆𝒏, 𝘗𝘰𝘯𝘺𝘣𝘰𝘺! \nheyyyyy | Morning view is just amazing!",
    commentsCount: 732,
    isLiked: false,
  },
  {
    id: 4,
    profile: { username: "sashaa", avatar: testUserAvatar },
    timeAgo: "2 week",
    image: postImage,
    likesCount: 101824,
    captionBody:
      "𝘐𝘵’𝘴 𝒈𝒐𝒍𝒅𝒆𝒏, 𝘗𝘰𝘯𝘺𝘣𝘰𝘺! \n heyyyyy | Morning view is just amazing!",
    commentsCount: 732,
    isLiked: true,
  },
];

const PostFeed = () => {
  return (
    <section className={styles.feed}>
      <div className={styles.grid}>
        {mockPosts.map((post) => (
          <div className={styles.card} key={post.id}>
            <Post post={post} />
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
    </section>
  );
};

export default PostFeed;
