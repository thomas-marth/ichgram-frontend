import { useState } from "react";

import TextField from "../../shared/components/TextField/TextField";
import Avatar from "../../shared/components/Avatar/Avatar";
import testUserAvatar from "../../assets/images/test-user.jpg";

import styles from "./Search.module.css";

const recentProfiles = [
  {
    username: "sashaa",
    avatar: testUserAvatar,
  },
];

const Search = () => {
  const [query, setQuery] = useState("");

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  const handleClear = () => {
    setQuery("");
  };

  return (
    <div className={styles.searchPanel}>
      <TextField
        className={styles.searchInput}
        placeholder="Search"
        value={query}
        onChange={handleChange}
        showClearButton
        onClear={handleClear}
      />

      <div className={styles.recentSection}>
        <span className={styles.sectionLabel}>Recent</span>

        <ul className={styles.recentList}>
          {recentProfiles.map((profile) => (
            <li key={profile.username} className={styles.recentItem}>
              <Avatar size="sm" src={profile.avatar} alt={profile.username} />
              <div className={styles.userInfo}>
                <span className={styles.username}>{profile.username}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Search;
