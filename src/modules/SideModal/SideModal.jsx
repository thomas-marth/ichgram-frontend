import styles from "./SideModal.module.css";

const SideModal = ({ title, children }) => {
  return (
    <div className={styles.sideModal} role="dialog" aria-modal="true">
      <div className={styles.header}>
        <h2 className={styles.h2}>{title}</h2>
      </div>
      <div className={styles.body}>{children}</div>
    </div>
  );
};

export default SideModal;
