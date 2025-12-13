import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Avatar from "../../shared/components/Avatar/Avatar";
import Button from "../../shared/components/Button/Button";
import instance from "../../shared/api/instance";
import { setCredentials } from "../../redux/auth/authSlice";
import { getCurrentUser } from "../../redux/auth/authThunks";
import noPhoto from "../../assets/images/noPhoto.png";

import styles from "./EditProfileForm.module.css";

const EditProfileFormFields = ({ user, onCredentialsUpdate }) => {
  const [username, setUsername] = useState(user?.username ?? "");
  const [bioWebsite, setBioWebsite] = useState(
    user?.website ?? user?.bio_website ?? ""
  );
  const [bio, setBio] = useState(user?.about ?? user?.bio ?? "");
  const [profileImage, setProfileImage] = useState(
    user?.avatar ?? user?.profile_image ?? ""
  );
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [charCount, setCharCount] = useState(
    (user?.about ?? user?.bio ?? "").length
  );

  const applyUserData = (nextUser) => {
    setUsername(nextUser?.username ?? "");
    setBioWebsite(nextUser?.website ?? nextUser?.bio_website ?? "");

    const updatedBio = nextUser?.about ?? nextUser?.bio ?? "";
    setBio(updatedBio);
    setCharCount(updatedBio.length);

    setProfileImage(nextUser?.avatar ?? nextUser?.profile_image ?? "");
    setProfileImageFile(null);
  };

  const previewImage = useMemo(
    () => profileImage || user?.avatar || user?.profile_image || noPhoto,
    [profileImage, user?.avatar, user?.profile_image]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("website", bioWebsite);
      formData.append("about", bio);

      if (profileImageFile) {
        formData.append("avatar", profileImageFile);
      }

      const { data } = await instance.put("/users/current", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedUser = data?.user ?? data;

      onCredentialsUpdate(updatedUser);
      applyUserData(updatedUser);
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

  const handleBioChange = (event) => {
    const updatedBio = event.target.value;
    setBio(updatedBio);
    setCharCount(updatedBio.length);
  };

  return (
    <form className={styles.editProfileForm} onSubmit={handleSubmit}>
      <h4>Edit profile</h4>

      <div className={styles.imageRow}>
        <Avatar size="lg" src={previewImage} alt={username} />

        <div className={styles.userInfo}>
          <p className={styles.username}>{username || "Username"}</p>
          <p className={styles.userBio}>{bio || "Add a short bio"}</p>
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
          value={bioWebsite}
          onChange={(event) => setBioWebsite(event.target.value)}
          className={styles.inputField}
        />
      </label>

      <label className={styles.fieldLabel}>
        About you
        <textarea
          value={bio}
          onChange={handleBioChange}
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

  useEffect(() => {
    if (!user) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, user]);

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
        user?.about ?? user?.bio ?? "",
        user?.website ?? user?.bio_website ?? "",
        user?.avatar ?? user?.profile_image ?? "",
      ].join("|"),
    [
      user?.about,
      user?.avatar,
      user?.bio,
      user?.bio_website,
      user?.id,
      user?.profile_image,
      user?.username,
      user?.website,
    ]
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
