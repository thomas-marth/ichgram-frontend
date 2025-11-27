import { Link } from "react-router-dom";

import styles from "./CardFooter.module.css";

const CardFooter = ({ prompt, linkText, to }) => {
  return (
    <div className={styles.сardFooter}>
      <p>
        {prompt}
        <Link to={to}>{linkText}</Link>
      </p>
    </div>
  );
};

export default CardFooter;
