import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import "../css/pages/404.scss";

export default function R404() {
  return (
    <motion.div
      className="R404 page d-flex flex-wrap"
      initial={{ opacity: 0, x: "-100vh" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100vh" }}
      transition={{ duration: 0.2 }}
    >
      <div className="text-center justify-content-center align-items-center d-flex w-100">
        <div>
          <h1>404 !</h1>
          <p>
            Cette page n'existe pas ou a été supprimée.
            <br />
            <br />
            <NavLink to="/">Retour à l'accueil</NavLink>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
