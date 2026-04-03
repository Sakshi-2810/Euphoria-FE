import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Show loader on route change
    setLoading(true);

    // Scroll to top
    window.scrollTo({ top: 0, left: 0 });

    // Hide loader after small delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname]);

  // Optional: expose global functions (for buttons)
  useEffect(() => {
    window.showGlobalLoader = () => setLoading(true);
    window.hideGlobalLoader = () => setLoading(false);
  }, []);

  return (
    <>
      {/* Global Loader UI */}
      {loading && (
        <div style={styles.overlay}>
          <div style={styles.spinner}></div>
        </div>
      )}
    </>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(255,255,255,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "5px solid #ccc",
    borderTop: "5px solid #333",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};

export default ScrollToTop;