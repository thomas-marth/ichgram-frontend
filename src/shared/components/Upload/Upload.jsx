import { useEffect, useRef } from "react";

import uploadIcon from "/src/assets/icons/upload.svg";

import styles from "./Upload.module.css";

export default function Upload({
  className = "",
  name,
  setValue,
  reset = true,
  ...props
}) {
  const fullClassName = `${styles.upload} ${className}`.trim();

  const imageRef = useRef(null);

  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.src = "";
    }
  }, [reset]);

  const handleOnFileUploadChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setValue(name, null);
      return;
    }

    if (imageRef.current) {
      imageRef.current.src = URL.createObjectURL(file);
    }

    setValue(name, file);
  };

  return (
    <div className={fullClassName}>
      <img src="" alt="" className={styles.preview} ref={imageRef} />
      <div className={styles.modal}>
        <img src={uploadIcon} alt="Upload" className={styles.icon} />

        <input
          {...props}
          name={name}
          onChange={handleOnFileUploadChange}
          className={styles.input}
        />
      </div>
    </div>
  );
}
