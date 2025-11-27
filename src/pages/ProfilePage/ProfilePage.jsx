import { Link } from "react-router-dom";
import Button from "./../../shared/components/Button/Button";
import styles from "./ProfilePage.module.css";

export default function ProfilePage() {
  return (
    <div className={styles.container}>
      <h1>Profile Page</h1>
      <Link to="/login">
        <Button type="submit">Go to the LoginPage</Button>
      </Link>
    </div>
  );
}
