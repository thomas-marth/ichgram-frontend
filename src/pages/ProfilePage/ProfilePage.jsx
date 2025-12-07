import { useMemo } from "react";
import { useParams } from "react-router-dom";
// import { Link } from "react-router-dom";

import Profile from "../../modules/Profile/Profile";
import Explore from "../../modules/Explore/Explore";
import profileLogo from "../../assets/images/ich-profile-logo.png";
import postImage1 from "../../assets/images/post-image1.jpg";
import postImage2 from "../../assets/images/post-image2.jpg";
import postImage3 from "../../assets/images/post-image3.jpg";
import postImage4 from "../../assets/images/post-image4.jpg";
import postImage5 from "../../assets/images/post-image5.jpg";
import postImage6 from "../../assets/images/post-image6.jpg";

// import Button from "./../../shared/components/Button/Button";
import styles from "./ProfilePage.module.css";

const mockProfiles = {
  1: {
    id: 1,
    username: "itcareerhub",
    website: "bit.ly/3rpiIbh",
    about: `• Гарантия помощи с трудоустройством в ведущие IT-компании  \n
      • Выпускники зарабатывают от 45к евро \n БЕСПЛАТНАЯ консультация`,
    totalPosts: 129,
    totalFollowers: 9993,
    totalFollows: 59,
    avatar: profileLogo,
    isFollowed: true,
  },
  2: {
    id: 2,
    username: "ichgram-friend",
    website: "bit.ly/3rpiIbh",
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

  const explorePosts = useMemo(
    () => [
      { id: 1, image: postImage1, alt: "Post 1" },
      { id: 2, image: postImage2, alt: "Post 2" },
      { id: 3, image: postImage3, alt: "Post 3" },
      { id: 4, image: postImage4, alt: "Post 4" },
      { id: 5, image: postImage5, alt: "Post 5" },
      { id: 6, image: postImage6, alt: "Post 6" },
    ],
    []
  );

  return (
    <div className={styles.profilePage}>
      <Profile key={profileData?.id ?? "profile"} user={profileData} />
      <Explore posts={explorePosts} variant="profile" />
    </div>
  );
};

export default ProfilePage;
