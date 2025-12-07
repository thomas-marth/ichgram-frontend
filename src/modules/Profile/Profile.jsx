import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMemo, useState } from "react";

import Avatar from "../../shared/components/Avatar/Avatar";
import Button from "../../shared/components/Button/Button";
import LoadingErrorOutput from "../../shared/components/LoadingErrorOutput/LoadingErrorOutput";

import { selectUser } from "../../redux/auth/authSelectors";
import { followUserApi } from "../../shared/api/follow-api";
import fallbackAvatar from "../../assets/images/ich-profile-logo.png";

import styles from "./Profile.module.css";

const { VITE_API_URL: baseURL } = import.meta.env;

const defaultCurrentUser = {
  id: 1,
  username: "itcareerhub",
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
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);

  const isOwner = authorizedUser?.id === profileData?.id;

  const avatarUrl = useMemo(
    () => buildAvatar(profileData?.avatar),
    [profileData?.avatar]
  );

  const aboutText = useMemo(() => {
    const rawAbout = profileData?.about ?? "";
    return rawAbout
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .join("\n");
  }, [profileData?.about]);
  const shouldTruncateAbout = aboutText.length > 108;
  const displayedAbout = useMemo(() => {
    if (!shouldTruncateAbout || isAboutExpanded) return aboutText;

    return `${aboutText.slice(0, 108)}...`;
  }, [aboutText, isAboutExpanded, shouldTruncateAbout]);

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
          <Avatar size="xl" src={avatarUrl} alt="User avatar" withGradient />
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
              <Link to={`/messages/${profileData?.id}`}>
                <Button variant="gray" className={styles.actionButton}>
                  Message
                </Button>
              </Link>
            ) : (
              <Link to="edit">
                <Button variant="gray" className={styles.actionButton}>
                  Edit profile
                </Button>
              </Link>
            )}
          </div>
          <div className={styles.stats}>
            <div className={styles.statsItem}>
              <span className={styles.statsNumber}>
                {profileData?.totalPosts}{" "}
              </span>
              <span>posts</span>
            </div>
            <div className={styles.statsItem}>
              <span className={styles.statsNumber}>
                {profileData?.totalFollowers}{" "}
              </span>
              <span>followers</span>
            </div>
            <div className={styles.statsItem}>
              <span className={styles.statsNumber}>
                {profileData?.totalFollows}{" "}
              </span>
              <span>following</span>
            </div>
          </div>
          <div>
            <p className={styles.about}>
              {displayedAbout}
              {shouldTruncateAbout && (
                <>
                  {" "}
                  <button
                    type="button"
                    className={styles.toggleAbout}
                    onClick={() => setIsAboutExpanded((prev) => !prev)}
                  >
                    {isAboutExpanded ? "less" : "more"}
                  </button>
                </>
              )}
            </p>
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
