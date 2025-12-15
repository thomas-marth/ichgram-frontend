import { createPortal } from "react-dom";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import styles from "./LoadingErrorOutput.module.css";

export default function LoadingErrorOutput({ loading, error }) {
  const closeButtonRef = useRef(null);
  const [dismissedKey, setDismissedKey] = useState("");

  const statusSignature = useMemo(
    () => JSON.stringify({ loading, error }),
    [error, loading]
  );

  const statusContent = useMemo(() => {
    if (error) {
      return {
        variant: "error",
        title: "Error",
        body:
          typeof error === "string"
            ? error
            : "Something went wrong. Please try again.",
        role: "alert",
        dismissible: true,
      };
    }

    return null;
  }, [error]);

  const contentKey = useMemo(() => {
    if (!statusContent) return "";
    return `${statusContent.variant}-${statusSignature}`;
  }, [statusContent, statusSignature]);

  const shouldShowToast = Boolean(statusContent) && dismissedKey !== contentKey;

  const shouldShowProgressBar = Boolean(loading);

  useEffect(() => {
    if (!contentKey) return undefined;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDismissedKey("");
    return undefined;
  }, [contentKey]);

  const handleClose = useCallback(() => {
    setDismissedKey(contentKey);
  }, [contentKey]);

  useEffect(() => {
    if (!shouldShowToast) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") handleClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleClose, shouldShowToast]);

  useEffect(() => {
    if (shouldShowToast && closeButtonRef.current) {
      closeButtonRef.current.focus({ preventScroll: true });
    }
  }, [shouldShowToast]);

  if (!shouldShowToast && !shouldShowProgressBar) return null;

  const progressBarClassNames = `${styles.progressBar} ${
    loading ? styles.progressBarIndeterminate : styles.progressBarCountdown
  }`;

  const content = (
    <>
      {shouldShowProgressBar && (
        <div className={progressBarClassNames} aria-hidden="true" />
      )}
      {shouldShowToast && statusContent && (
        <div className={styles.toastRegion} role="presentation">
          <section
            className={`${styles.toast} ${styles[statusContent.variant]}`}
            role={statusContent.role}
            aria-live={statusContent.role === "alert" ? "assertive" : "polite"}
          >
            <div className={styles.toastHeader}>
              <div className={styles.lead}>
                <span className={styles.dot} aria-hidden="true" />
                <p className={styles.title}>{statusContent.title}</p>
              </div>
              {statusContent.dismissible && (
                <button
                  ref={closeButtonRef}
                  type="button"
                  className={styles.closeButton}
                  aria-label="Close message"
                  onClick={handleClose}
                >
                  ×
                </button>
              )}
            </div>
            <p className={styles.message}>{statusContent.body}</p>
          </section>
        </div>
      )}
    </>
  );

  return createPortal(content, document.body);
}
