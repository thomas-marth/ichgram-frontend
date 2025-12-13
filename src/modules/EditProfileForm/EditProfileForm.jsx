import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Avatar from "../../shared/components/Avatar/Avatar";
import Button from "../../shared/components/Button/Button";
import instance from "../../shared/api/instance";
import { setCredentials } from "../../redux/auth/authSlice";
import noPhoto from "../../assets/images/noPhoto.png";

import styles from "./EditProfileForm.module.css";

const EditProfileFormFields = ({ user, onCredentialsUpdate }) => {
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

      const { data } = await instance.put("/user/current", formData, {
        headers: {
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

  return (
    <form className={styles.editProfileForm} onSubmit={handleSubmit}>
      <h4>Edit profile</h4>

      <div className={styles.imageRow}>
        <Avatar size="m" src={previewImage} alt={username} />

        <div className={styles.userInfo}>
          <p className={styles.username}>{username || "Username"}</p>
          <p className={styles.userAbout}>{about || "Add a short about"}</p>
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
        <input
          type="text"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
          className={styles.inputField}
        />
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
      onCredentialsUpdate={handleCredentialsUpdate}
    />
  );
};

export default EditProfileForm;
