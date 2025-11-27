import { Outlet } from "react-router-dom";

import Sidebar from "./../../modules/Sidebar/Sidebar";
import Footer from "./../../modules/Footer/Footer";
import styles from "./PrivatLayout.module.css";

const PrivateLayout = () => {
  return (
    <div className={styles.container}>
      <Sidebar />
      <main className="main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PrivateLayout;
