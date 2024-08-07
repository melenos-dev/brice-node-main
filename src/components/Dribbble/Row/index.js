import React from "react";
import { motion } from "framer-motion";

export default function Row({ end, space }) {
  return (
    <div className={`d-flex flex-column ${space ? "space" : ""}`}>
      {Array.from(Array(Number(end) + 1), (current, index) => {
        return (
          <motion.div
            animate={
              index == 0 && {
                marginTop: -54 * end,
                transition: {
                  duration: 2,
                  ease: "backInOut",
                },
              }
            }
            key={index}
          >
            {index === 0 && !space ? (
              <span style={{ opacity: 0.5 }}>0</span>
            ) : (
              index
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
