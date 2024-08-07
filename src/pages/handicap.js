import React, { useState, useEffect, useContext } from "react";
import "../css/pages/handicap.scss";
import { wrap, motion, AnimatePresence } from "framer-motion";
import Slider from "../components/HandicapSlider/index.js";
import { slides } from "../components/HandicapSlider/SlideData.js";
import { SliderContext } from "../utils/context/SliderProvider.js";
import useMediaQuery from "../hooks/useMediaQuery.js";

const useKeyPress = function (targetKey) {
  const [keyPressed, setKeyPressed] = useState(false);

  const downHandler = ({ key }) => {
    if (key === targetKey) {
      setKeyPressed(true);
    }
  };

  const upHandler = ({ key }) => {
    if (key === targetKey) {
      setKeyPressed(false);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  });

  return keyPressed;
};

export default function Handicap() {
  const [[currentSlide, direction], setCurrentSlide] = useState([0, 0]);
  const [arrowDirection, setArrowDirection] = useState(0);
  const slideIndex = wrap(0, slides.length, currentSlide);
  const { key, incrementKeyHandler } = useContext(SliderContext);

  const matches = useMediaQuery("(min-width:768px)");
  const [wheel, setWheel] = useState(0);

  const downPress = useKeyPress("ArrowDown");
  const upPress = useKeyPress("ArrowUp");

  const paginate = (newDirection) => {
    setCurrentSlide([currentSlide + newDirection, newDirection]);
    incrementKeyHandler(key + 1);
  };

  const wheelHandler = ({ e }) => {
    var e = window.event || e;
    var delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));
    if (delta > 0) {
      0 !== slideIndex && paginate(-1);
      setWheel(wheel + 1);
    } else {
      slides.length !== slideIndex + 1 && paginate(1);
      setWheel(wheel + 1);
    }
  };

  useEffect(() => {
    if (matches) {
      window.addEventListener("wheel", wheelHandler, true);

      return () => {
        window.removeEventListener("wheel", wheelHandler, true);
      };
    } else {
      window.removeEventListener("wheel", wheelHandler);
    }
  }, [wheel, matches]);

  useEffect(() => {
    arrowDirection === 0
      ? slides.length === currentSlide + 1 && setArrowDirection(1)
      : 0 === currentSlide && setArrowDirection(0);
  }, [currentSlide, arrowDirection]);

  useEffect(() => {
    if (downPress) {
      slides.length !== slideIndex + 1 && paginate(1);
    }
  }, [downPress]);

  useEffect(() => {
    if (upPress) {
      0 !== slideIndex && paginate(-1);
    }
  }, [upPress]);

  useEffect(() => {
    incrementKeyHandler(key + 1);
  }, []);

  return (
    <motion.div
      className="handicap page d-flex flex-wrap"
      initial={{ opacity: 0, x: "-100vh" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100vh" }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="text-center justify-content-center align-items-center d-flex w-100"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
        transition={{ duration: 1.3, delay: 0 }}
        variants={{
          visible: {
            opacity: 1,
            paddingTop: 0,
          },
          hidden: { opacity: 0, paddingTop: 150 },
        }}
      >
        <Slider
          paginate={paginate}
          currentSlide={currentSlide}
          direction={direction}
          slideIndex={slideIndex}
          slides={slides}
        />
      </motion.div>
      <div id="slider__paginationBottom">
        <div>
          <motion.div
            key="arrows"
            className={"arrow " + (arrowDirection === 0 ? "bottom" : "top")}
            onClick={() => {
              arrowDirection === 0 ? paginate(1) : paginate(-1);
            }}
          ></motion.div>
          <div></div>
        </div>
        <AnimatePresence initial={true}>
          <div>
            <motion.a
              key={"txt" + key}
              whileInView="visible"
              initial="hidden"
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.1 }}
              variants={{
                visible: { opacity: 1, translateX: 0 },
                hidden: { opacity: 0, translateX: 100 },
              }}
              href="files/humans.txt"
              className="file"
            >
              &copy; Sb_2K22<span className="end">.txt</span>
            </motion.a>
          </div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
