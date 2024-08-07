import React, { useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import Backdrop from "../Backdrop/index.js";
import { motion } from "framer-motion";
import "../../css/components/popup.scss";
import { MouseContext } from "../../utils/context/MouseProvider.js";

const variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    x: 50,
  },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
    },
  },
};

export default function SubMenu({ handleClose, length }) {
  const { cursorChangeHandler } = useContext(MouseContext);

  return (
    <Backdrop theme="subMenu">
      <motion.div onClick={(e) => e.stopPropagation()} className="popup">
        <motion.div
          onClick={handleClose}
          whileHover={{ scale: 1.2, rotate: "90deg" }}
          whileTap={{ scale: 0.9 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 10,
          }}
          className="popup__close"
        ></motion.div>
        <nav className="navbar navbar-expand container-fluid">
          <ul className="navbar-nav w-100 h-100 d-flex flex-column">
            <div className="ms-auto me-auto d-inline-block">
              <button
                className="navbar__item "
                type="button"
                onClick={handleClose}
              ></button>
            </div>
            <div
              id="collapsedMenu"
              className="d-flex flex-column justify-content-between"
            >
              <motion.div
                className="d-flex"
                initial="hidden"
                animate="show"
                variants={variants}
              >
                <motion.li variants={item} className="navbar__item">
                  <NavLink to="/" onClick={handleClose}>
                    À propos
                  </NavLink>
                </motion.li>

                <motion.li variants={item} className="navbar__item">
                  <NavLink to="/handicap" onClick={handleClose}>
                    Handicap
                  </NavLink>
                </motion.li>

                <motion.li variants={item} className="navbar__item">
                  <NavLink to="/coming-soon">Services</NavLink>
                </motion.li>

                <motion.li variants={item} className="navbar__item portfolio">
                  <NavLink to="/portfolio">
                    Portfolio {<span>{length}</span>}
                  </NavLink>
                </motion.li>

                <motion.li variants={item} className="navbar__item">
                  <NavLink to="/coming-soon">Team</NavLink>
                </motion.li>

                <motion.li variants={item} className="navbar__item">
                  <NavLink to="mailto:hello@seraphinbrice.fr">Devis</NavLink>
                </motion.li>
              </motion.div>

              <div className="d-flex justify-content-between">
                <motion.a
                  href="files/papers.pdf"
                  className="file"
                  whileInView="visible"
                  initial="hidden"
                  viewport={{ once: true }}
                  transition={{ delay: 1.2, duration: 0.1 }}
                  variants={{
                    visible: { opacity: 1, translateX: [-100, 0] },
                    hidden: { opacity: 0, translateX: 0 },
                  }}
                >
                  Papiers<span className="end">.pdf</span>
                </motion.a>

                <motion.a
                  href="files/humans.txt"
                  className="file"
                  whileInView="visible"
                  initial="hidden"
                  viewport={{ once: true }}
                  transition={{ delay: 1.2, duration: 0.1 }}
                  variants={{
                    visible: { opacity: 1, translateX: [100, 0] },
                    hidden: { opacity: 0, translateX: 0 },
                  }}
                >
                  &copy; Sb_2K22<span className="end">.txt</span>
                </motion.a>
              </div>
            </div>
          </ul>
        </nav>
      </motion.div>
    </Backdrop>
  );
}
