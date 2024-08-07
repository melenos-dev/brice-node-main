import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../Logo/index.js";
import Dribbble from "../Dribbble/index.js";

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    if (currentSlide === 0) loadDribbble();
  }, [currentSlide]);

  const loadDribbble = async () => {
    try {
      const getFollowers = await fetch(`https://api.dribbble.com/v2/user`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer 766a73d13722e4135a1aedf9c25cc198e6279e300b38419f3f7dfc48f12230cc`,
        },
      });

      const followers = await getFollowers.json();
      setFollowers(followers.followers_count.toString());
    } catch (err) {
      //console.log(err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

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
            {currentSlide === 0 && <Logo />}
            <div
              data-id={currentSlide}
              dangerouslySetInnerHTML={{ __html: slides[slideIndex].html }}
            ></div>
            {isLoading
              ? "" // loader here if necessary
              : currentSlide === 0 &&
                !error && <Dribbble tempFollowers={followers} />}
          </motion.div>
        </div>
      </AnimatePresence>
      <div id="slider__paginationRight">
        <div
          className={"arrow " + (0 === slideIndex && "disabled")}
          onClick={() => 0 !== slideIndex && paginate(-1)}
        ></div>
        <div
          className={
            "arrow " + (slides.length === slideIndex + 1 && "disabled")
          }
          onClick={() => slides.length !== slideIndex + 1 && paginate(1)}
        ></div>
        <div id="slider__paginationRight__Steps">
          <motion.span>0{slideIndex + 1}</motion.span>
          <span>/0{slides.length}</span>
        </div>
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
                ></motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

export default Slider;
