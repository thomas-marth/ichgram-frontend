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

import {
  fields,
  createPostSchema,
  defaultValues,
  editPostSchema,
} from "./fields";

import styles from "./CreatePost.module.css";

const { VITE_API_URL: baseURL } = import.meta.env;

const buildAbsoluteUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("/")) return path;
  if (baseURL) return `${baseURL}/${path}`;
  return path;
};

export default function CreatePost({
  onClose,
  mode = "create",
  initialValues = defaultValues,
  onSubmitForm,
  title,
  submitLabel,
  onSuccess,
}) {
  const isEditMode = mode === "edit";

  const formDefaults = useMemo(
    () => ({ ...defaultValues, ...initialValues }),
    [initialValues]
  );

  const modalTitle = title || (isEditMode ? "Edit post" : "Create new post");
  const submitText = submitLabel || (isEditMode ? "Edit" : "Share");

  const { register, handleSubmit, setValue, reset } = useForm({
    resolver: yupResolver(isEditMode ? editPostSchema : createPostSchema),
    defaultValues: formDefaults,
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

  const initialImageUrl = useMemo(
    () => buildAbsoluteUrl(formDefaults.image),
    [formDefaults.image]
  );

  const formKey = useMemo(
    () =>
      `${resetToggle}-${formDefaults.description || ""}-${
        formDefaults.image || ""
      }`,
    [formDefaults.description, formDefaults.image, resetToggle]
  );

  useEffect(() => {
    reset(formDefaults);
  }, [formDefaults, reset]);

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

    const submitPost = onSubmitForm || createPostApi;
    const { data: createdPost, error: requestError } = await submitPost(values);

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

    if (!isEditMode && !onSubmitForm) {
      emitPostCreated({
        comments: [],
        totalLikes: createdPost?.totalLikes ?? 0,
        ...createdPost,
        author: {
          _id: ownerId,
          id: ownerId,
          username:
            createdPost?.author?.username || currentUserProfile.username || "",
          avatar:
            createdPost?.author?.avatar || currentUserProfile.avatar || "",
          isFollowed: currentUserProfile.isFollowed,
        },
        createdAt: createdPost?.createdAt || new Date().toISOString(),
        updatedAt:
          createdPost?.updatedAt ||
          createdPost?.createdAt ||
          new Date().toISOString(),
      });
    }

    onSuccess?.({
      ...createdPost,
      author: createdPost?.author || currentUserProfile,
    });

    if (!isEditMode) {
      setResetToggle((prev) => !prev);
      reset(defaultValues);
    }
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
          <h1 className={styles.title}>{modalTitle}</h1>
          <button type="submit" className={styles.submit} disabled={loading}>
            {submitText}
          </button>
        </div>
        <div className={styles.uploadWrapper}>
          <Upload
            {...fields.image}
            setValue={setValue}
            reset={formKey}
            initialImage={initialImageUrl}
            form="postForm"
          />
        </div>
        <div className={styles.textEditorWrapper}>
          <div className={styles.textEditorTop}>
            <TextEditor
              key={formKey}
              register={register}
              {...fields.description}
              initialValue={formDefaults.description}
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
