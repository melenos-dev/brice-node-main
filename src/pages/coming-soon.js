import "../css/pages/coming-soon.scss";
import React, { useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Backdrop from "../components/Backdrop/index.js";
import { Link } from "../../node_modules/react-router-dom/dist/index.js";
import Button from "../components/Button/index.js";
import { useNavigate } from "react-router-dom";

export default function ComingSoon() {
  const navigate = useNavigate();
  function handleClick() {
    navigate("/");
  }

  return (
    <motion.div
      className="comingSoon page d-flex flex-wrap"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center justify-content-center align-items-center d-flex w-100">
        <Backdrop theme="blue" onClick={handleClick}>
          <motion.div className="popup" onClick={(e) => e.stopPropagation()}>
            <Link to="/">
              <motion.div
                whileHover={{ scale: 1.2, rotate: "90deg" }}
                whileTap={{ scale: 0.9 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 10,
                }}
                className="popup__close"
              ></motion.div>
            </Link>

            <div className="head">
              <AnimatePresence initial={true}>
                <motion.div
                  animate={{ rotate: 180 }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 2,
                  }}
                />
              </AnimatePresence>
            </div>

            <div className="body">
              <h1>! A Venir !</h1>
              <p>
                La <b>page</b> que vous avez demandée est
                <strong>
                  <i> en cours de création</i>
                </strong>
                .<br />
                Revenez dès le mois prochain pour la découvrir <b>:)</b>
              </p>
              <Link to="/">
                <Button className="button button__close">
                  <span></span>
                  Fermer
                </Button>
              </Link>
            </div>
          </motion.div>
        </Backdrop>
      </div>
    </motion.div>
  );
}
