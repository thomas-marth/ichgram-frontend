import testPostImg from "../../assets/images/testPost-img.png";
import styles from "./Notifications.module.css";

const mockNotifications = [
  {
    id: "1",
    actor: { username: "sashaa" },
    action: "liked your photo",
    timeAgo: "2m",
    post: { image: testPostImg },
  },
  {
    id: "2",
    actor: { username: "sashaa" },
    action: "commented your photo",
    timeAgo: "3m",
    post: { image: testPostImg },
  },
  {
    id: "3",
    actor: { username: "sashaa" },
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
            <div className={styles.avatarWrapper}>
              <div className={styles.avatar} />
            </div>

            <div className={styles.content}>
              <p>
                <strong>{notification.actor.username}</strong>{" "}
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
