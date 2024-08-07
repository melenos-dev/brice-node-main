import React, { useState, useContext, useEffect } from "react";
import ReactDOM from "react-dom";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import useMediaQuery from "../hooks/useMediaQuery.js";
import { motion, AnimatePresence } from "framer-motion";
import useSound from "use-sound";
import lazerSound from "../sounds/laser.wav";
import jumpSound from "../sounds/jump.wav";
import SubMenu from "../components/SubMenu/index.js";
import { MouseContext } from "../utils/context/MouseProvider.js";
import { SliderContext } from "../utils/context/SliderProvider.js";
import useAuth from "../hooks/useAuth.js";
import useAxiosPrivate from "../hooks/useAxiosPrivate.js";
/*
import useLogout from "../hooks/useLogout";
*/

const useKeyPress = function (targetKey) {
  const [keyPressed, setKeyPressed] = useState(false);

  const leftHandler = ({ key }) => {
    if (key === targetKey) {
      setKeyPressed(true);
    }
  };

  const rightHandler = ({ key }) => {
    if (key === targetKey) {
      setKeyPressed(false);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", leftHandler);
    window.addEventListener("keyup", rightHandler);

    return () => {
      window.removeEventListener("keydown", leftHandler);
      window.removeEventListener("keyup", rightHandler);
    };
  });

  return keyPressed;
};

export default function Menu() {
  //const { auth } = useAuth();
  const location = useLocation();
  const { pathname } = location;
  const navigate = useNavigate();
  const [length, setLength] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  const menu = [
    {
      to: "/",
      name: "À propos",
      action: "restartSlider",
    },
    {
      to: "/handicap",
      name: "Handicap",
    },
    {
      to: "/coming-soon",
      name: "Services",
    },
    {
      to: "/portfolio",
      name: "Portfolio",
    },
    {
      to: "/coming-soon",
      name: "Team",
    },
    {
      to: "mailto:hello@seraphinbrice.fr",
      name: "Devis",
    },
  ];

  const useMenu = (current, direction) => {
    if (Array.isArray(current)) {
      const index = current.findIndex((current) => current.to === pathname);
      if (index === -1) return false;
      direction === "right"
        ? index + 1 !== 2 && navigate(current[index + 1].to)
        : index - 1 !== -1 && navigate(current[index - 1].to);
    } else if (current.to === "/" && pathname === "/") return restartSlider();
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getCreationsLength = async () => {
      try {
        const response = await axiosPrivate.get("api/creations/length", {
          signal: controller.signal,
        });
        isMounted && setLength(response.data);
      } catch (err) {
        setLength(false);
      }
    };

    getCreationsLength();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);
  /*
  const logout = useLogout();

  const signOut = async (e) => {
    e.preventDefault();
    await logout();
    navigate("/");
  };*/

  const matches = useMediaQuery("(min-width:768px)");
  const [jump] = useSound(jumpSound);
  const [lazer] = useSound(lazerSound);
  const [openSubMenu, setOpenSubMenu] = useState(false);
  const [countJump, iterateCountJump] = useState(0);
  const [countLazer, iterateCountLazer] = useState(0);

  const leftPress = useKeyPress("ArrowLeft");
  const rightPress = useKeyPress("ArrowRight");

  const mouseHandler = useContext(MouseContext);

  const close = () => {
    setOpenSubMenu(false);
    mouseHandler({ type: "mouseHover", cursorType: "" });
  };
  const open = () => {
    !matches && setOpenSubMenu(true);
    mouseHandler({ type: "mouseHover", cursorType: "" });
  };

  useEffect(() => {
    if (leftPress) {
      useMenu(menu, "left");
    }
  }, [leftPress]);

  useEffect(() => {
    if (rightPress) {
      useMenu(menu, "right");
    }
  }, [rightPress]);

  const { newSlide, restartCurrentSlide } = useContext(SliderContext);

  const restartSlider = () => {
    restartCurrentSlide(newSlide + 1);
  };

  return (
    <AnimatePresence initial={true} mode="sync" onExitComplete={() => null}>
      {openSubMenu ? (
        <SubMenu key={"subMenu"} handleClose={close} length={length}></SubMenu>
      ) : (
        <nav className="navbar navbar-expand container-fluid">
          <motion.ul
            className={`navbar-nav w-100 justify-content-between ${
              window.location.pathname === "/"
                ? "homeNav"
                : window.location.pathname === "/handicap" && "handicapNav"
            }`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            variants={{
              visible: { opacity: 1, scale: 1 },
              hidden: { opacity: 0, scale: 0 },
            }}
          >
            <motion.li
              className="navbar__item"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              variants={{
                visible: { opacity: 1, translateX: 0 },
                hidden: { opacity: 0, translateX: -100 },
              }}
            >
              <a
                href="files/papers.pdf"
                className="file"
                onMouseEnter={() => (
                  countLazer < 2 && lazer(), iterateCountLazer(countLazer + 1)
                )}
              >
                Papiers<span className="end">.pdf</span>
              </a>
            </motion.li>
            <div className="d-flex ms-auto me-auto">
              <button
                className="navbar__item"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapsedMenu"
                aria-expanded={matches ? "true" : "false"}
                aria-controls="collapsedMenu"
                onClick={() => (openSubMenu ? close() : open())}
              ></button>
              {matches && (
                <div
                  className="collapse show collapse-horizontal"
                  id="collapsedMenu"
                >
                  <div className="d-flex">
                    {menu.map((current) => {
                      return (
                        <li
                          key={current.name}
                          className={`navbar__item ${
                            current.name === "Portfolio" && "portfolio"
                          }`}
                        >
                          <NavLink
                            to={current.to}
                            onClick={(event) => useMenu(current)}
                            onMouseEnter={() => {
                              if (current.name === "Devis") {
                                countJump < 2 && jump(),
                                  iterateCountJump(countJump + 1);
                              }
                            }}
                          >
                            {current.name}
                            {current.name === "Portfolio" && (
                              <span>{length}</span>
                            )}
                          </NavLink>
                        </li>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.ul>
        </nav>
      )}
    </AnimatePresence>
  );
}
