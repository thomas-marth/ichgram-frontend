import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import TextEditor from "../../shared/components/TextEditor/TextEditor";
import LoadingErrorOutput from "../../shared/components/LoadingErrorOutput/LoadingErrorOutput";
import { updatePostApi } from "../../shared/api/post-api";

import styles from "./EditPost.module.css";

const descriptionSchema = yup.object({
  description: yup.string().max(2200, "Description is too long"),
});

const { VITE_API_URL: baseURL } = import.meta.env;

const buildAbsoluteUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("/")) return path;
  if (baseURL) return `${baseURL}/${path}`;
  return path;
};

const EditPost = ({
  onClose,
  initialValues = { description: "", image: "" },
  title = "Edit post",
  submitLabel = "Edit",
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formDefaults = useMemo(() => {
    return {
      description:
        initialValues.description ||
        initialValues.descriptionBody ||
        initialValues.captionBody ||
        "",
      image: initialValues.image || "",
    };
  }, [initialValues]);

  const previewUrl = useMemo(
    () => buildAbsoluteUrl(formDefaults.image),
    [formDefaults.image]
  );

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(descriptionSchema),
    defaultValues: {
      description: formDefaults.description,
    },
  });

  useEffect(() => {
    reset({ description: formDefaults.description });
  }, [formDefaults.description, reset]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose?.();
    }
  };

  const onSubmit = async (values) => {
    setLoading(true);
    setError(null);

    const { data, error: requestError } = await updatePostApi(
      initialValues.id,
      { description: values.description }
    );

    setLoading(false);

    if (requestError) {
      setError(requestError.response?.data?.message || requestError.message);
      return;
    }

    onSuccess?.(data);
    onClose?.();
  };

  return (
    <div className={styles.editPostModal} onClick={handleBackdropClick}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
          <button type="submit" className={styles.submit} disabled={loading}>
            {submitLabel}
          </button>
        </div>

        <div className={styles.previewWrapper}>
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Post preview"
              className={styles.previewImage}
            />
          ) : (
            <div className={styles.emptyPreview}>No image available</div>
          )}
        </div>

        <div className={styles.textEditorWrapper}>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextEditor
                value={field.value}
                onChange={field.onChange}
                placeholder="Input description text here..."
              />
            )}
          />
        </div>

        <div className={styles.messageWrapper}>
          <LoadingErrorOutput loading={loading} error={error} />
        </div>
      </form>
    </div>
  );
};

export default EditPost;
