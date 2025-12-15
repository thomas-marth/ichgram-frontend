import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux";

import Upload from "../../shared/components/Upload/Upload";
import TextEditor from "../../shared/components/TextEditor/TextEditor";
import LoadingErrorOutput from "../../shared/components/LoadingErrorOutput/LoadingErrorOutput";
import { createPostApi } from "../../shared/api/post-api";
import { emitPostCreated } from "../../shared/utils/postEvents";
import { selectUser } from "../../redux/auth/authSelectors";

import { fields, createPostSchema, defaultValues } from "./fields";

import styles from "./CreatePost.module.css";

export default function CreatePost({ onClose }) {
  const { register, handleSubmit, setValue, reset } = useForm({
    resolver: yupResolver(createPostSchema),
    defaultValues,
  });
  const currentUser = useSelector(selectUser);
  const currentUserProfile = useMemo(
    () => ({
      id: currentUser?._id || currentUser?.id,
      username: currentUser?.username || currentUser?.name || "",
      avatar: currentUser?.avatar || currentUser?.profile_image || "",
    }),
    [
      currentUser?._id,
      currentUser?.avatar,
      currentUser?.id,
      currentUser?.name,
      currentUser?.profile_image,
      currentUser?.username,
    ]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resetToggle, setResetToggle] = useState(false);

  useEffect(() => {
    const handleOnKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleOnKeyDown);

    return () => {
      document.removeEventListener("keydown", handleOnKeyDown);
    };
  }, [onClose]);

  const handleOnBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose?.();
    }
  };

  const handleOnSubmit = async (values) => {
    setError(null);
    setLoading(true);

    const { data: createdPost, error: requestError } = await createPostApi(
      values
    );

    setLoading(false);

    if (requestError) {
      setError(requestError.response?.data?.message || requestError.message);
      return;
    }

    const ownerId =
      createdPost?.author?._id ||
      createdPost?.author?.id ||
      createdPost?.author ||
      currentUserProfile.id;

    emitPostCreated({
      comments: [],
      totalLikes: createdPost?.totalLikes ?? 0,
      ...createdPost,
      author: {
        _id: ownerId,
        id: ownerId,
        username:
          createdPost?.author?.username || currentUserProfile.username || "",
        avatar: createdPost?.author?.avatar || currentUserProfile.avatar || "",
        isFollowed: currentUserProfile.isFollowed,
      },
      createdAt: createdPost?.createdAt || new Date().toISOString(),
      updatedAt:
        createdPost?.updatedAt ||
        createdPost?.createdAt ||
        new Date().toISOString(),
    });

    setResetToggle((prev) => !prev);
    reset(defaultValues);
    onClose?.();
  };

  return (
    <div className={styles.createPostModal} onClick={handleOnBackdropClick}>
      <form
        onSubmit={handleSubmit(handleOnSubmit)}
        className={styles.form}
        id="postForm"
      >
        <div className={styles.header}>
          <h1 className={styles.title}>Create new post</h1>
          <button type="submit" className={styles.submit} disabled={loading}>
            Share
          </button>
        </div>
        <div className={styles.uploadWrapper}>
          <Upload
            {...fields.image}
            setValue={setValue}
            reset={resetToggle}
            form="postForm"
          />
        </div>
        <div className={styles.textEditorWrapper}>
          <div className={styles.textEditorTop}>
            <TextEditor
              key={resetToggle}
              register={register}
              {...fields.description}
            />
          </div>
          <div className={styles.textEditorBottom} />
        </div>
        <div className={styles.messageWrapper}>
          <LoadingErrorOutput loading={loading} error={error} />
        </div>
      </form>
    </div>
  );
}
