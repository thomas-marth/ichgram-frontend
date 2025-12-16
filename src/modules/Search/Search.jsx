import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import TextField from "../../shared/components/TextField/TextField";
import Avatar from "../../shared/components/Avatar/Avatar";
import { getUsers } from "../../shared/api/user-api";
import { selectUser } from "../../redux/auth/authSelectors";

import styles from "./Search.module.css";

const STORAGE_KEY_PREFIX = "searchHistory";
const MAX_HISTORY_LENGTH = 10;

const getStorageKey = (userId) => `${STORAGE_KEY_PREFIX}_${userId || "guest"}`;

const normalizeUser = (user = {}) => ({
  id: user.id || user._id,
  username: user.username || "",
  fullname: user.fullname || "",
  avatar: user.avatar || "",
});

const getInitialHistory = (storageKey) => {
  try {
    const savedHistory = localStorage.getItem(storageKey);
    if (!savedHistory) return [];

    const parsedHistory = JSON.parse(savedHistory);
    if (!Array.isArray(parsedHistory)) return [];

    return parsedHistory
      .map(normalizeUser)
      .filter((user) => user.id && user.username)
      .slice(0, MAX_HISTORY_LENGTH);
  } catch {
    return [];
  }
};

const Search = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const currentUser = useSelector(selectUser);
  const storageKey = useMemo(
    () => getStorageKey(currentUser?.id || currentUser?._id),
    [currentUser?.id, currentUser?._id]
  );
  const [searchHistory, setSearchHistory] = useState(() =>
    getInitialHistory(storageKey)
  );
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        if (!isMounted) return;

        const normalizedUsers = (Array.isArray(data) ? data : [])
          .map(normalizeUser)
          .filter((user) => user.id && user.username);

        setUsers(normalizedUsers);
      } catch (error) {
        console.error("Failed to load users for search", error);
      }
    };

    fetchUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setSearchHistory(getInitialHistory(storageKey));
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(searchHistory));
  }, [searchHistory, storageKey]);

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return [];

    return users.filter(
      (user) =>
        user.username.toLowerCase().includes(normalizedQuery) ||
        user.fullname.toLowerCase().includes(normalizedQuery)
    );
  }, [query, users]);

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  const handleClear = () => {
    setQuery("");
  };

  const handleSelectUser = (user) => {
    if (!user?.id) return;

    navigate(`/profile/${user.id}`);
    setQuery("");
    setSearchHistory((prevHistory) => {
      const existingHistory = prevHistory.filter(
        (historyUser) => historyUser.id !== user.id
      );
      const updatedHistory = [user, ...existingHistory];

      return updatedHistory.slice(0, MAX_HISTORY_LENGTH);
    });
  };

  return (
    <div className={styles.searchPanel}>
      <TextField
        className={styles.searchInput}
        placeholder="Search"
        autoComplete="off"
        value={query}
        onChange={handleChange}
        showClearButton
        onClear={handleClear}
      />

      {query.trim() ? (
        <div className={styles.searchResults}>
          <ul className={styles.recentList}>
            {filteredUsers.length ? (
              filteredUsers.map((user) => (
                <li key={user.id} className={styles.recentItem}>
                  <button
                    type="button"
                    className={styles.userButton}
                    onClick={() => handleSelectUser(user)}
                  >
                    <Avatar size="sm" src={user.avatar} alt={user.username} />
                    <div className={styles.userInfo}>
                      <span className={styles.username}>{user.username}</span>
                      {user.fullname ? (
                        <span className={styles.fullname}>{user.fullname}</span>
                      ) : null}
                    </div>
                  </button>
                </li>
              ))
            ) : (
              <li className={styles.emptyState}>No users found</li>
            )}
          </ul>
        </div>
      ) : null}

      <div className={styles.recentSection}>
        <span className={styles.sectionLabel}>Recent</span>

        <ul className={styles.recentList}>
          {searchHistory.length ? (
            searchHistory.map((profile) => (
              <li key={profile.id} className={styles.recentItem}>
                <button
                  type="button"
                  className={styles.userButton}
                  onClick={() => handleSelectUser(profile)}
                >
                  <Avatar
                    size="sm"
                    src={profile.avatar}
                    alt={profile.username}
                  />
                  <div className={styles.userInfo}>
                    <span className={styles.username}>{profile.username}</span>
                    {profile.fullname ? (
                      <span className={styles.fullname}>
                        {profile.fullname}
                      </span>
                    ) : null}
                  </div>
                </button>
              </li>
            ))
          ) : (
            <li className={styles.emptyState}>No recent searches</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Search;
