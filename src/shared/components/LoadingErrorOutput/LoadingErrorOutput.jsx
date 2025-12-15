import { createPortal } from "react-dom";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import styles from "./LoadingErrorOutput.module.css";

const AUTO_DISMISS_DELAY = 5200;

export default function LoadingErrorOutput({ loading, error, message }) {
  const closeButtonRef = useRef(null);
  const [dismissedKey, setDismissedKey] = useState("");
  const [isPaused, setIsPaused] = useState(false);

  const statusSignature = useMemo(
    () => JSON.stringify({ loading, error, message }),
    [error, loading, message]
  );

  const statusContent = useMemo(() => {
    if (loading) {
      return {
        variant: "info",
        title: "Loading",
        body: typeof loading === "string" ? loading : "Loading data...",
        role: "status",
        dismissible: false,
      };
    }

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

    if (message) {
      return {
        variant: "success",
        title: "Status",
        body: message,
        role: "status",
        dismissible: true,
      };
    }

    return null;
  }, [loading, error, message]);

  const contentKey = useMemo(() => {
    if (!statusContent) return "";
    return `${statusContent.variant}-${statusSignature}`;
  }, [statusContent, statusSignature]);

  const isVisible = Boolean(statusContent) && dismissedKey !== contentKey;

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
    if (!isVisible) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") handleClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleClose, isVisible]);

  useEffect(() => {
    if (
      !isVisible ||
      !statusContent?.dismissible ||
      statusContent.variant === "error"
    ) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      if (!isPaused) handleClose();
    }, AUTO_DISMISS_DELAY);

    return () => window.clearTimeout(timeoutId);
  }, [handleClose, isPaused, isVisible, statusContent]);

  useEffect(() => {
    if (isVisible && closeButtonRef.current) {
      closeButtonRef.current.focus({ preventScroll: true });
    }
  }, [isVisible]);

  if (!isVisible || !statusContent) return null;

  const content = (
    <div
      className={styles.toastRegion}
      role="presentation"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
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

        {statusContent.dismissible && statusContent.variant !== "error" && (
          <div className={styles.progressBar} aria-hidden="true" />
        )}
      </section>
    </div>
  );

  return createPortal(content, document.body);
}
