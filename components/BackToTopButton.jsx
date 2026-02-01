"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FaArrowUp } from "react-icons/fa";
import styles from "@/styles/backToTop.module.css";

const BackToTopButton = () => {
  const pathname = usePathname();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const toggleBackToTop = () => {
      if (window.scrollY > 100) {
        setIsActive(true);
      } else {
        setIsActive(false);
      }
    };

    window.addEventListener("scroll", toggleBackToTop);

    return () => {
      window.removeEventListener("scroll", toggleBackToTop);
    };
  }, []);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  return (
    <div
      className={`${styles["back-to-top"]} ${
        isActive ? styles.active : ""
      } primary-bg`}
      onClick={handleBackToTop}
    >
      <FaArrowUp className={styles.icon} />
    </div>
  );
};

export default BackToTopButton;
