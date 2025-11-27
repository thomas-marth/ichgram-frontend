import { Outlet } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import Sidebar from "./../../modules/Sidebar/Sidebar";
import Footer from "./../../modules/Footer/Footer";
import Notifications from "../../modules/Notifications/Notifications";
import SideModal from "../../modules/SideModal/SideModal";

import styles from "./PrivatLayout.module.css";

const PrivateLayout = () => {
  const [activeSideModal, setActiveSideModal] = useState(null);
  const [footerHeight, setFooterHeight] = useState(0);
  const footerRef = useRef(null);

  useEffect(() => {
    const updateFooterHeight = () => {
      setFooterHeight(footerRef.current?.getBoundingClientRect().height || 0);
    };

    updateFooterHeight();
    window.addEventListener("resize", updateFooterHeight);

    return () => window.removeEventListener("resize", updateFooterHeight);
  }, []);

  const handleOpenSideModal = (label) => {
    if (label === "Notifications" || label === "Messages") {
      setActiveSideModal(label);
      return;
    }

    setActiveSideModal(null);
  };

  const handleCloseSideModal = () => setActiveSideModal(null);

  return (
    <div
      className={styles.privateLayout}
      style={{ "--footer-height": `${footerHeight}px` }}
    >
      {activeSideModal ? (
        <div className={styles.backdrop} onClick={handleCloseSideModal} />
      ) : null}
      <div className={styles.layoutBody}>
        <div className={styles.sidebarColumn}>
          <div className={styles.sidebarInner}>
            <Sidebar
              onOpenSideModal={handleOpenSideModal}
              onCloseSideModal={handleCloseSideModal}
            />
          </div>
        </div>
        <div className={styles.content}>
          <main className={styles.main}>
            <Outlet />
          </main>
        </div>
      </div>
      <Footer
        ref={footerRef}
        onOpenSideModal={handleOpenSideModal}
        onCloseSideModal={handleCloseSideModal}
      />
      {activeSideModal ? (
        <SideModal title={activeSideModal}>
          {activeSideModal === "Notifications" ? <Notifications /> : null}
        </SideModal>
      ) : null}
    </div>
  );
};

export default PrivateLayout;
