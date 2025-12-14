import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Profile from "../../modules/Profile/Profile";
import Explore from "../../modules/Explore/Explore";
import LoadingErrorOutput from "../../shared/components/LoadingErrorOutput/LoadingErrorOutput";
import { getUserPostsApi } from "../../shared/api/post-api";
import { getUserById } from "../../shared/api/user-api";
import { selectUser } from "../../redux/auth/authSelectors";

import styles from "./ProfilePage.module.css";

const normalizePosts = (posts = []) =>
  posts.map((post) => ({
    id: post._id || post.id,
    image: post.image,
    alt: post.description || "Post image",
  }));

const ProfilePage = () => {
  const { id } = useParams();
  const currentUser = useSelector(selectUser);

  const activeProfileId = useMemo(
    () => id ?? currentUser?.id ?? null,
    [currentUser?.id, id]
  );

  const [profileData, setProfileData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!activeProfileId) return undefined;

    let isMounted = true;

    const fetchProfileData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [userInfo, userPosts] = await Promise.all([
          getUserById(activeProfileId),
          getUserPostsApi(activeProfileId),
        ]);

        if (!isMounted) return;

        setProfileData({ ...userInfo, id: userInfo.id || userInfo._id });
        setPosts(normalizePosts(userPosts));
      } catch (err) {
        if (!isMounted) return;

        const message = err?.response?.data?.message || err.message;
        setError(message);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProfileData();

    return () => {
      isMounted = false;
    };
  }, [activeProfileId]);

  return (
    <div className={styles.profilePage}>
      <Profile key={profileData?.id ?? activeProfileId} user={profileData} />
      <Explore posts={posts} variant="profile" />
      <LoadingErrorOutput loading={loading} error={error} />
    </div>
  );
};

export default ProfilePage;
