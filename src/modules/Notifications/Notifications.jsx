import testPostImg from "../../assets/images/testPost-img.png";
import testUserImage from "../../assets/images/test-user.jpg";
import Avatar from "../../shared/components/Avatar/Avatar";
import styles from "./Notifications.module.css";

const mockNotifications = [
  {
    id: "1",
    creator: { username: "sashaa", avatar: testUserImage },
    action: "liked your photo",
    timeAgo: "2m",
    post: { image: testPostImg },
  },
  {
    id: "2",
    creator: { username: "sashaa", avatar: testUserImage },
    action: "commented your photo",
    timeAgo: "3m",
    post: { image: testPostImg },
  },
  {
    id: "3",
    creator: { username: "sashaa", avatar: testUserImage },
    action: "started following",
    timeAgo: "5m",
    post: null,
  },
];

const Notifications = () => {
  return (
    <div className={styles.notificationPanel}>
      <span className={styles.sectionLabel}>New</span>

      <ul className={styles.notificationList}>
        {mockNotifications.map((notification) => (
          <li key={notification.id} className={styles.notificationItem}>
            <Avatar
              size="sm"
              src={notification.creator.avatar}
              alt={`${notification.creator.username} avatar`}
              // withGradient
            />

            <div className={styles.content}>
              <p>
                <b>{notification.creator.username}</b>{" "}
                <span>{notification.action}</span>
                <span className={styles.timeAgo}>{notification.timeAgo}</span>
              </p>
            </div>

            {notification.post?.image && (
              <img
                src={notification.post.image}
                alt="Post preview"
                className={styles.postImage}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
