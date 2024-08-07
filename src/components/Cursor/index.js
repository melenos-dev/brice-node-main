import React, { useEffect, useContext } from "react";
import useMousePosition from "../../hooks/useMousePosition.js";
import { useAnimationControls, motion } from "framer-motion";
import {
  MouseContext,
  StateContext,
} from "../../utils/context/MouseProvider.js";

const Cursor = () => {
  const { x, y } = useMousePosition();
  const controls = useAnimationControls();
  const mouseHandler = useContext(MouseContext);
  const state = useContext(StateContext);

  useEffect(() => {
    window.document.addEventListener("click", function (event) {
      mouseHandler({ type: "mouseClick", cursorType: "" });
    });
  }, []);

  useEffect(() => {
    controls.start({ width: [20, 10], height: [20, 10] });
  }, [state.cursorClick]);

  return (
    <motion.div
      className={"newcursor " + state.cursorType}
      style={{ left: `${x}px`, top: `${y}px` }}
      animate={controls}
    >
      <div className="circle"></div>
    </motion.div>
  );
};

export default Cursor;
