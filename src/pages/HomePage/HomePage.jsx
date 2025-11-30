import PostFeed from "../../modules/PostFeed/PostFeed";
// import Button from "../../shared/components/Button/Button";
// import { Link } from "react-router-dom";

import styles from "./HomePage.module.css";

export default function HomePage() {
  return (
    <div className={styles.container}>
      <PostFeed />
      {/* <h1>Home Page</h1> */}
      {/* <Link to="/login">
        <Button type="submit">Go to the LoginPage</Button>
      </Link> */}
    </div>
  );
}
