import React, { useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const variants = {
  enter: (direction) => {
    return {
      y: direction > 0 ? "500vh" : "-500vh",
      opacity: 0,
    };
  },
  center: {
    y: 0,
    opacity: 1,
  },
  exit: (direction) => {
    return {
      y: direction < 0 ? "500vh" : "-500vh",
      opacity: 0,
    };
  },
};

function Slider({ paginate, currentSlide, direction, slideIndex, slides }) {
  return (
    <>
      <AnimatePresence initial={false} custom={direction}>
        <div id="slider">
          <motion.div
            id="slider__Inner"
            key={currentSlide}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              y: { type: "spring", stiffness: 4000, damping: 30 },
              opacity: { duration: 1.5 },
            }}
          >
            <div
              data-id={currentSlide}
              dangerouslySetInnerHTML={{ __html: slides[slideIndex].html }}
            ></div>
          </motion.div>
        </div>
      </AnimatePresence>
      <div id="slider__paginationRight">
        <div id="slider__paginationRight__Tips">
          <AnimatePresence>
            {slides.map((current, index) => {
              return (
                <motion.div
                  key={index}
                  className={slideIndex === index ? "active" : ""}
                  onClick={() =>
                    slideIndex !== index && paginate(index - slideIndex)
                  }
                >
                  {index === 0 && (
                    <b>
                      Handicap
                      <i>
                        <span>Maladie génétique :</span> Myopathie
                        Mitochondriale
                      </i>
                    </b>
                  )}

                  {index === 1 && (
                    <b>
                      Avantages
                      <i>
                        Reconnaissance{" "}
                        <span>du statut de Travailleur Handicapé</span>
                      </i>
                    </b>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

export default Slider;
