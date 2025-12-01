import styles from "./LoadingErrorOutput.module.css";

export default function LoadingErrorOutput({ loading, error }) {
  if (!loading && !error) return null;

  return (
    <div className={styles.wrapper} role="status" aria-live="polite">
      {loading && <p className={styles.message}>Loading recommendations...</p>}
      {error && !loading && (
        <p className={styles.message}>
          Something went wrong. Please try again.
        </p>
      )}
    </div>
  );
}
