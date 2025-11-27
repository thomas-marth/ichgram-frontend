import { Link } from "react-router-dom";
import Button from "./../../shared/components/Button/Button";
import styles from "./ExplorePage.module.css";

export default function ExplorePage() {
  return (
    <div className={styles.container}>
      <h1>Explore Page</h1>
      <Link to="/login">
        <Button type="submit">Go to the LoginPage</Button>
      </Link>
    </div>
  );
}
