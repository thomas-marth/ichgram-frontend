import { useMemo } from "react";
import { useParams } from "react-router-dom";
// import { Link } from "react-router-dom";

import Profile from "../../modules/Profile/Profile";
import profileLogo from "../../assets/images/ich-profile-logo.png";

// import Button from "./../../shared/components/Button/Button";
import styles from "./ProfilePage.module.css";

const mockProfiles = {
  1: {
    id: 1,
    username: "ichgram",
    website: "https://ichgram.com",
    about: "Photography, travel, and everyday inspirations.",
    totalPosts: 24,
    totalFollowers: 1250,
    totalFollows: 410,
    avatar: profileLogo,
    isFollowed: true,
  },
  2: {
    id: 2,
    username: "ichgram-friend",
    website: "https://friend.ichgram.com",
    about: "Capturing city lights, coding, and coffee.",
    totalPosts: 18,
    totalFollowers: 960,
    totalFollows: 310,
    avatar: profileLogo,
    isFollowed: false,
  },
};

const ProfilePage = () => {
  const { id } = useParams();
  const activeProfileId = id ?? "1";

  const profileData = useMemo(
    () => mockProfiles[activeProfileId] ?? mockProfiles[2],
    [activeProfileId]
  );

  return (
    <div className={styles.profilePage}>
      <Profile user={profileData} />
    </div>
  );
};

export default ProfilePage;
