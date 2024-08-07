import "../css/pages/portfolio.scss";
import React, { useContext, useEffect } from "react";
import { motion } from "framer-motion";
import flagPath from "../img/france-flag.png";
import badgePath from "../img/sb-badge.png";
import Button from "../components/Button/index.js";
import { MouseContext } from "../utils/context/MouseProvider.js";

export default function PortFolio() {
  const mouseHandler = useContext(MouseContext);

  return (
    <motion.div
      className="PortFolio page d-flex flex-wrap"
      initial={{ opacity: 0, x: "-100vh" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100vh" }}
      transition={{ duration: 0.2 }}
    >
      <div className="text-center justify-content-center align-items-center d-flex w-100">
        <section className="d-flex justify-content-center align-items-center flex-column">
          <header className="PortFolio__Header align-items-center">
            <div className="comet"></div>
            <img src={flagPath} alt="France" />
            <div className="PortFolio__Header__FollowBlock d-flex">
              <img src={badgePath} alt="Senior Designer" />
              <div className="d-flex flex-column">
                <h1>Senior Designer</h1>
                <h2>UI-UX, Icons & Print</h2>
                <div>
                  <Button
                    className="button button__RedToBlue"
                    onClick={() =>
                      window.open(
                        "https://dribbble.com/seraphinbrice",
                        "_blank"
                      )
                    }
                  >
                    Suivez-moi
                  </Button>
                </div>
              </div>
              <div>
                <span>hello@seraphinbrice.fr</span>
                <span>Réponse en 24h</span>
              </div>
            </div>
          </header>
          <nav className="PortFolio__Menu"></nav>
          <div className="PortFolio__Body"></div>
        </section>
        <nav className="PortFolio__Nav align-self-center d-flex">
          <motion.div className="PortFolio__Nav__Top disabled"></motion.div>
          <motion.div className="PortFolio__Nav__Bottom"></motion.div>
        </nav>
      </div>
    </motion.div>
  );
}
