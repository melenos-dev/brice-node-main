import React from "react";
import { motion } from "framer-motion";

export default function Backdrop({ children, theme, onClick }) {
  return (
    <motion.div
      className={"backdrop " + theme}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
