import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Avatar from "../../shared/components/Avatar/Avatar";
import Button from "../../shared/components/Button/Button";
import instance from "../../shared/api/instance";
import { setCredentials } from "../../redux/auth/authSlice";
import noPhoto from "../../assets/images/noPhoto.png";
import WebsiteLinkIcon from "../../assets/icons/WebsiteLinkIcon";

import styles from "./EditProfileForm.module.css";

const EditProfileFormFields = ({ user, accessToken, onCredentialsUpdate }) => {
  const [username, setUsername] = useState(user?.username ?? "");
  const [website, setWebsite] = useState(user?.website ?? "");
  const [about, setAbout] = useState(user?.about ?? "");
  const [profileImage, setProfileImage] = useState(user?.avatar ?? "");
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [charCount, setCharCount] = useState((user?.about ?? "").length);

  const previewImage = useMemo(
    () => profileImage || user?.avatar || noPhoto,
    [profileImage, user?.avatar]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("website", website);
      formData.append("about", about);

      if (profileImageFile) {
        formData.append("avatar", profileImageFile);
      }

      const { data } = await instance.put("/users/current", formData, {
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedUser = data?.user ?? data;

      onCredentialsUpdate(updatedUser);
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAboutChange = (event) => {
    const updatedAbout = event.target.value;
    setAbout(updatedAbout);
    setCharCount(updatedAbout.length);
  };

  const displayedAbout = about
    ? about.length > 59
      ? about.slice(0, 59)
      : about
    : "Add a short about";

  return (
    <form className={styles.editProfileForm} onSubmit={handleSubmit}>
      <h1>Edit profile</h1>

      <div className={styles.imageRow}>
        <Avatar size="m" src={previewImage} alt={username} />

        <div className={styles.userInfo}>
          <p className={styles.username}>{username || "Username"}</p>
          <p className={styles.userAbout}>{displayedAbout}</p>
        </div>

        <label className={styles.uploadButton}>
          New photo
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            style={{ display: "none" }}
          />
        </label>
      </div>

      <label className={styles.fieldLabel}>
        Username
        <input
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className={styles.inputField}
        />
      </label>

      <label className={styles.fieldLabel}>
        Website
        <div className={styles.inputWithIcon}>
          <WebsiteLinkIcon className={styles.inputIcon} />
          <input
            type="text"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
            className={`${styles.inputField} ${styles.websiteInput}`}
          />
        </div>
      </label>

      <label className={styles.fieldLabel}>
        About you
        <textarea
          value={about}
          onChange={handleAboutChange}
          className={styles.textareaField}
          maxLength={150}
        />
        <div className={styles.charCount}>{charCount} / 150</div>
      </label>

      <Button type="submit" className={styles.saveButton}>
        Save
      </Button>
    </form>
  );
};

const EditProfileForm = () => {
  const dispatch = useDispatch();
  const { user, accessToken, refreshToken } = useSelector(
    (state) => state.auth
  );

  const handleCredentialsUpdate = (updatedUser) => {
    dispatch(
      setCredentials({
        user: updatedUser,
        accessToken,
        refreshToken,
      })
    );
  };

  const formKey = useMemo(
    () =>
      [
        user?.id ?? "current-user",
        user?.username ?? "",
        user?.about ?? "",
        user?.website ?? "",
        user?.avatar ?? "",
      ].join("|"),
    [user?.about, user?.website, user?.id, user?.avatar, user?.username]
  );

  return (
    <EditProfileFormFields
      key={formKey}
      user={user}
      accessToken={accessToken}
      onCredentialsUpdate={handleCredentialsUpdate}
    />
  );
};

export default EditProfileForm;
