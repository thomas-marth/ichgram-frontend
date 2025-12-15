import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";

import Avatar from "../../shared/components/Avatar/Avatar";
import Button from "../../shared/components/Button/Button";
import WebsiteLinkIcon from "../../assets/icons/WebsiteLinkIcon";
import LoadingErrorOutput from "../../shared/components/LoadingErrorOutput/LoadingErrorOutput";
import { selectUser } from "../../redux/auth/authSelectors";
import { followUserApi, unfollowUserApi } from "../../shared/api/follow-api";

import styles from "./Profile.module.css";

const { VITE_API_URL: baseURL } = import.meta.env;

const buildAvatar = (avatar) => {
  if (!avatar) return "";
  if (avatar.startsWith("http") || avatar.startsWith("/")) return avatar;
  if (baseURL) return `${baseURL}/${avatar}`;
  return avatar;
};

const buildExternalLink = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
};

const Profile = ({ user }) => {
  const authorizedUser = useSelector(selectUser);

  const [profileData, setProfileData] = useState(user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);

  useEffect(() => {
    setProfileData(user);
  }, [user]);

  const isOwner =
    String(authorizedUser?.id ?? "") === String(profileData?.id ?? "");

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

  const websiteUrl = useMemo(
    () => buildExternalLink(profileData?.website),
    [profileData?.website]
  );

  const handleFollowToggle = async () => {
    if (!profileData) return;

    setLoading(true);
    setError(null);

    const isCurrentlyFollowed = Boolean(profileData?.isFollowed);

    const { data, error: apiError } = await (isCurrentlyFollowed
      ? unfollowUserApi
      : followUserApi)({
      targetUserId: profileData.id,
    });

    setLoading(false);

    if (apiError) {
      const apiMessage = apiError.response?.data?.message || apiError.message;
      setError(apiMessage);
      return;
    }

    const followersDelta = isCurrentlyFollowed ? -1 : 1;

    setMessage(data?.message);
    setProfileData((prev) => ({
      ...prev,
      isFollowed: !isCurrentlyFollowed,
      followers: Math.max(0, (prev?.followers ?? 0) + followersDelta),
    }));

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
            <h1 className={styles.handle}>{profileData?.username}</h1>
            {!isOwner &&
              (profileData?.isFollowed ? (
                <button
                  type="button"
                  className={styles.unfollowButton}
                  onClick={handleFollowToggle}
                  disabled={loading}
                >
                  unfollow
                </button>
              ) : (
                <Button
                  variant="contained"
                  className={styles.followButton}
                  onClick={handleFollowToggle}
                  disabled={loading}
                >
                  Follow
                </Button>
              ))}
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
            <Link to="/logout" className={styles.logout}>
              Logout
            </Link>
          </div>
          <div className={styles.stats}>
            <div className={styles.statsItem}>
              <span className={styles.statsNumber}>
                {profileData?.totalPosts ?? 0}{" "}
              </span>
              <span>posts</span>
            </div>
            <div className={styles.statsItem}>
              <span className={styles.statsNumber}>
                {profileData?.followers ?? 0}{" "}
              </span>
              <span>followers</span>
            </div>
            <div className={styles.statsItem}>
              <span className={styles.statsNumber}>
                {profileData?.following ?? 0}{" "}
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
          <div className={styles.websiteLinkWrapp}>
            <WebsiteLinkIcon />
            <a
              href={websiteUrl || undefined}
              target="_blank"
              rel="noreferrer"
              className={styles.websiteLink}
            >
              {profileData?.website}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
