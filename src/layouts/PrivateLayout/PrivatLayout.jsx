import { Outlet } from "react-router-dom";

import Sidebar from "./../../modules/Sidebar/Sidebar";
import Footer from "./../../modules/Footer/Footer";
import styles from "./PrivatLayout.module.css";

const PrivateLayout = () => {
  return (
    <div className={styles.privateLayout}>
      <div className={styles.layoutBody}>
        <div className={styles.sidebarColumn}>
          <div className={styles.sidebarInner}>
            <Sidebar />
          </div>
        </div>
        <div className={styles.content}>
          <main className={styles.main}>
            <Outlet />
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivateLayout;
