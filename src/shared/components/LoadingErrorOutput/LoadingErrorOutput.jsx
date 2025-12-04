import styles from "./LoadingErrorOutput.module.css";

export default function LoadingErrorOutput({ loading, error, message }) {
  const hasContent = loading || error || message;

  if (!hasContent) return null;

  return (
    <div className={styles.wrapper} role="status" aria-live="polite">
      {loading && <p className={styles.message}>Loading recommendations...</p>}
      {message && !loading && !error && (
        <p className={styles.message}>{message}</p>
      )}
      {error && !loading && (
        <p className={styles.message}>
          {typeof error === "string"
            ? error
            : "Something went wrong. Please try again."}
        </p>
      )}
    </div>
  );
}
