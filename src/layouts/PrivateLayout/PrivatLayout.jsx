import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";

import Sidebar from "./../../modules/Sidebar/Sidebar";
import Footer from "./../../modules/Footer/Footer";
import Notifications from "../../modules/Notifications/Notifications";
import SideModal from "../../modules/SideModal/SideModal";
import Search from "../../modules/Search/Search";

import styles from "./PrivatLayout.module.css";

const PrivateLayout = () => {
  const [activeSideModal, setActiveSideModal] = useState(null);
  const [activeNavItem, setActiveNavItem] = useState(null);
  const [footerHeight, setFooterHeight] = useState(0);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const footerRef = useRef(null);
  const mainRef = useRef(null);
  const location = useLocation();

  const getActiveNavItemFromPath = (pathname) => {
    if (pathname === "/") {
      return "Home";
    }

    if (pathname.startsWith("/explore")) {
      return "Explore";
    }

    if (pathname === "/direct" || pathname.startsWith("/direct/")) {
      return "Messages";
    }

    const segments = pathname.split("/").filter(Boolean);

    if (
      segments.length === 1 ||
      (segments.length === 2 && segments[1] === "edit")
    ) {
      return "Profile";
    }

    return null;
  };

  useEffect(() => {
    const footerElement = footerRef.current;

    if (!footerElement) {
      return undefined;
    }

    const updateFooterHeight = () => {
      setFooterHeight(footerElement.offsetHeight);
    };

    updateFooterHeight();

    const resizeObserver = new ResizeObserver(updateFooterHeight);
    resizeObserver.observe(footerElement);

    window.addEventListener("resize", updateFooterHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateFooterHeight);
    };
  }, []);

  useEffect(() => {
    const footerElement = footerRef.current;
    const mainElement = mainRef.current;

    if (!footerElement || !mainElement) {
      return undefined;
    }

    let animationFrame = null;

    const calculateFooterVisibility = () => {
      const mainRect = mainElement.getBoundingClientRect();
      const footerRect = footerElement.getBoundingClientRect();

      const mainBottom = mainRect.bottom + window.scrollY;
      const footerTop = footerRect.top + window.scrollY;
      const gapBetweenContentAndFooter = footerTop - mainBottom;

      const scrollHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;

      const hasScrollableContent = scrollHeight - footerHeight > viewportHeight;
      const shouldHideByLayout =
        hasScrollableContent || gapBetweenContentAndFooter < 70;

      const currentScrollBottom = window.scrollY + viewportHeight;
      const revealThreshold = scrollHeight - footerHeight - 70;
      const reachedRevealPoint = currentScrollBottom >= revealThreshold;

      setIsFooterVisible(reachedRevealPoint || !shouldHideByLayout);
    };

    const handleScrollOrResize = () => {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }

      animationFrame = requestAnimationFrame(calculateFooterVisibility);
    };

    calculateFooterVisibility();

    window.addEventListener("scroll", handleScrollOrResize, { passive: true });
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }

      window.removeEventListener("scroll", handleScrollOrResize);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [footerHeight, location.pathname]);

  const routeActiveNavItem = useMemo(
    () => getActiveNavItemFromPath(location.pathname),
    [location.pathname]
  );

  const currentActiveNavItem = activeNavItem ?? routeActiveNavItem;

  const handleOpenSideModal = (label) => {
    setActiveNavItem(label);

    if (
      label === "Notifications" ||
      label === "Messages" ||
      label === "Search"
    ) {
      setActiveSideModal(label);
    } else {
      setActiveSideModal(null);
    }
  };

  const handleCloseSideModal = () => {
    setActiveSideModal(null);
    setActiveNavItem(null);
  };

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
              onSetActiveNavItem={setActiveNavItem}
              activeNavItem={currentActiveNavItem}
            />
          </div>
        </div>
        <div className={styles.content}>
          <main ref={mainRef} className={styles.main}>
            <Outlet />
          </main>
        </div>
      </div>
      <Footer
        ref={footerRef}
        isVisible={isFooterVisible}
        onOpenSideModal={handleOpenSideModal}
        onCloseSideModal={handleCloseSideModal}
        onSetActiveNavItem={setActiveNavItem}
        activeSideModal={activeSideModal}
        activeNavItem={currentActiveNavItem}
      />
      {activeSideModal ? (
        <SideModal title={activeSideModal} isFooterVisible={isFooterVisible}>
          {activeSideModal === "Notifications" ? <Notifications /> : null}
          {activeSideModal === "Search" ? <Search /> : null}
        </SideModal>
      ) : null}
    </div>
  );
};

export default PrivateLayout;
