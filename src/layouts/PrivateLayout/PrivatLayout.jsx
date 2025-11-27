import { Outlet } from "react-router-dom";

import { useState } from "react";
import Sidebar from "./../../modules/Sidebar/Sidebar";
import Footer from "./../../modules/Footer/Footer";
import Notifications from "../../modules/Notifications/Notifications";
import SideModal from "../../modules/SideModal/SideModal";
import styles from "./PrivatLayout.module.css";

const PrivateLayout = () => {
  const [activeSideModal, setActiveSideModal] = useState(null);

  const handleOpenSideModal = (label) => {
    if (label === "Notifications" || label === "Messages") {
      setActiveSideModal(label);
    }
  };

  const handleCloseSideModal = () => setActiveSideModal(null);

  return (
    <div className={styles.privateLayout}>
      {activeSideModal ? <div className={styles.backdrop} aria-hidden /> : null}
      <div className={styles.layoutBody}>
        <div className={styles.sidebarColumn}>
          <div className={styles.sidebarInner}>
            <Sidebar onOpenSideModal={handleOpenSideModal} />
          </div>
        </div>
        <div className={styles.content}>
          <main className={styles.main}>
            <Outlet />
          </main>
        </div>
      </div>
      <Footer onOpenSideModal={handleOpenSideModal} />
      {activeSideModal ? (
        <SideModal title={activeSideModal} onClose={handleCloseSideModal}>
          {activeSideModal === "Notifications" ? <Notifications /> : null}
        </SideModal>
      ) : null}
    </div>
  );
};

export default PrivateLayout;
