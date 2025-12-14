import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Upload from "../../shared/components/Upload/Upload";
import TextEditor from "../../shared/components/TextEditor/TextEditor";
import LoadingErrorOutput from "../../shared/components/LoadingErrorOutput/LoadingErrorOutput";
import { createPostApi } from "../../shared/api/post-api";

import { fields, createPostSchema, defaultValues } from "./fields";

import styles from "./CreatePost.module.css";

export default function CreatePost({ onClose }) {
  const { register, handleSubmit, setValue, reset } = useForm({
    resolver: yupResolver(createPostSchema),
    defaultValues,
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resetToggle, setResetToggle] = useState(false);

  const handleOnSubmit = async (values) => {
    setError(null);
    setMessage(null);
    setLoading(true);

    const { data, error: requestError } = await createPostApi(values);

    setLoading(false);

    if (requestError) {
      setError(requestError.response?.data?.message || requestError.message);
      return;
    }

    setMessage(data?.message || "Post created successfully.");
    setResetToggle((prev) => !prev);
    reset(defaultValues);
    onClose?.();
  };

  return (
    <div
      className={styles.createPostModal}
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
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
          <LoadingErrorOutput
            loading={loading}
            error={error}
            message={message}
          />
        </div>
      </form>
    </div>
  );
}
