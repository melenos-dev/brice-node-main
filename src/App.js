import Menu from "./components/Menu.js";
import AnimatedRoutes from "./components/AnimatedRoutes.js";
import React, { useEffect, useState, useContext, useRef } from "react";
import Loader from "./components/Loader/index.js";
import { AnimatePresence, motion } from "framer-motion";
import { SliderContext } from "./utils/context/SliderProvider.js";
import Cursor from "./components/Cursor/index.js";
import { MouseContext } from "./utils/context/MouseProvider.js";
import useAuth from "./hooks/useAuth.js";
import { Link } from "react-router-dom";

const App = () => {
  const [loader, setLoader] = useState(true);
  const { key } = useContext(SliderContext);
  const mainRef = useRef(null);
  const mouseHandler = useContext(MouseContext);
  const { isAllowed } = useAuth();

  useEffect(() => {
    setTimeout(() => setLoader(false), 750);
  }, []);

  function inOutHandler(event) {
    const cursorType = event.type === "mouseenter" ? "active" : "";
    if (
      window.getComputedStyle(event.target)["cursor"].split(", ")[1] ===
      "pointer"
    )
      mouseHandler({ type: "mouseHover", cursorType: cursorType });

    mainRef.current.removeEventListener("mouseenter", inOutHandler);
    mainRef.current.removeEventListener("mouseout", inOutHandler);
  }

  useEffect(() => {
    if (!loader) {
      mainRef.current.addEventListener("mouseenter", inOutHandler, true);
      mainRef.current.addEventListener("mouseout", inOutHandler, true);
    }
  }, [loader]);

  return (
    <AnimatePresence>
      {loader ? (
        <Loader key="loader" />
      ) : (
        <div ref={mainRef}>
          {window.location.pathname !== "/coming-soon" && (
            <header className="text-center">
              {isAllowed([process.env.ADMIN]) && (
                <Link
                  className="button button__admin"
                  to={process.env.ADMIN_URL}
                ></Link>
              )}
              <Menu key={"menu" + key} />
            </header>
          )}
          <main className="container-fluid d-flex justify-content-center">
            <div className="page">
              <div>
                <motion.div
                  id="comet"
                  key={"comet" + key}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{
                    duration: 2.5,
                    delay: 0,
                    ease: "backInOut",
                  }}
                  variants={{
                    visible: {
                      left: ["0%", "100%"],
                      bottom: ["0%", "100%"],
                      rotate: ["0", "75"],
                    },
                    hidden: { bottom: 0, left: 0 },
                  }}
                ></motion.div>
                <Cursor />
                <motion.div
                  key={"customCircle" + key}
                  className="customCircle"
                  initial="hidden"
                  whileInView="visible"
                  transition={{ duration: 1.3, delay: 0.2 }}
                  viewport={{ once: false }}
                  variants={{
                    visible: { backgroundPosition: "0% 100%" },
                    hidden: { backgroundPosition: "-50% 100%" },
                  }}
                ></motion.div>
              </div>
            </div>
            <AnimatedRoutes />
          </main>
        </div>
      )}
    </AnimatePresence>
  );
};

export default App;
