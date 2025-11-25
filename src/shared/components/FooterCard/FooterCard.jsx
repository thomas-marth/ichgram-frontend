import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import styles from "./FooterCard.module.css";

const FooterCard = ({ prompt, linkText, to }) => {
  return (
    <div className={styles.footerCard}>
      <p>
        {prompt}
        <Link to={to}>{linkText}</Link>
      </p>
    </div>
  );
};

FooterCard.propTypes = {
  prompt: PropTypes.string.isRequired,
  linkText: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
};

export default FooterCard;
