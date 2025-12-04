import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";

import Button from "../../shared/components/Button/Button";
import LoadingErrorOutput from "../../shared/components/LoadingErrorOutput/LoadingErrorOutput";

import { selectUser } from "../../redux/auth/authSelectors";
import { followUserApi } from "../../shared/api/follow-api";
import fallbackAvatar from "../../assets/images/ich-profile-logo.png";

import styles from "./Profile.module.css";

const { VITE_API_URL: baseURL } = import.meta.env;

const defaultCurrentUser = {
  id: 1,
  username: "ichgram",
  website: "https://ichgram.com",
  about: "Photographer, traveler, and coffee lover.",
  totalPosts: 12,
  totalFollowers: 845,
  totalFollows: 379,
  avatar: fallbackAvatar,
};

const buildAvatar = (avatar) => {
  if (!avatar) return "";
  if (avatar.startsWith("http") || avatar.startsWith("/")) return avatar;
  if (baseURL) return `${baseURL}/${avatar}`;
  return avatar;
};

const Profile = ({ user }) => {
  const authorizedUser = useSelector(selectUser) ?? defaultCurrentUser;

  const [profileData, setProfileData] = useState(user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    setProfileData(user);
  }, [user]);

  const isOwner = authorizedUser?.id === profileData?.id;

  const avatarUrl = useMemo(
    () => buildAvatar(profileData?.avatar),
    [profileData?.avatar]
  );

  const handleFollow = async () => {
    if (!profileData) return;

    setLoading(true);
    setError(null);

    const { data, error: apiError } = await followUserApi({
      targetUserId: profileData.id,
    });

    setLoading(false);

    if (apiError) {
      const apiMessage = apiError.response?.data?.message || apiError.message;
      setError(apiMessage);
      return;
    }

    setMessage(data.message);
    setProfileData((prev) => ({ ...prev, isFollowed: true }));

    setTimeout(() => setMessage(null), 5000);
  };

  return (
    <div className={styles.profileSection}>
      <LoadingErrorOutput loading={loading} error={error} message={message} />
      <div className={styles.profileTop}>
        <div className={styles.avatarWrapper}>
          <img src={avatarUrl} alt="" className={styles.avatar} />
        </div>
        <div className={styles.contentArea}>
          <div className={styles.headline}>
            <Link
              to={profileData?.website}
              target="_blank"
              className={styles.handle}
            >
              {profileData?.username}
            </Link>
            {!isOwner && !profileData?.isFollowed && (
              <Button
                variant="contained"
                className={styles.followButton}
                onClick={handleFollow}
              >
                Follow
              </Button>
            )}
            {!isOwner ? (
              <Link
                to={`/messages/${profileData?.id}`}
                className={styles.actionLink}
              >
                Message
              </Link>
            ) : (
              <Link to="edit" className={styles.actionLink}>
                Edit profile
              </Link>
            )}
          </div>
          <div className={styles.stats}>
            <span
              className={styles.statsItem}
            >{`${profileData?.totalPosts} posts`}</span>
            <span
              className={styles.statsItem}
            >{`${profileData?.totalFollowers} followers`}</span>
            <span
              className={styles.statsItem}
            >{`${profileData?.totalFollows} following`}</span>
          </div>
          <div>
            <p className={styles.about}>{profileData?.about}</p>
          </div>
          <div>
            <Link
              to={profileData?.website}
              target="_blank"
              className={styles.websiteLink}
            >
              {profileData?.website}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
