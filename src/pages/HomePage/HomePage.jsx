import Button from "../../shared/components/Button/Button";
import { Link } from "react-router-dom";

import styles from "./HomePage.module.css";

export default function HomePage() {
  return (
    <div className={styles.container}>
      <h1>Home Page</h1>
      <Link to="/login">
        <Button type="submit">Log in</Button>
      </Link>
    </div>
  );
}
