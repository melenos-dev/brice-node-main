import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Nav({ tabHandler, nav, tabs }) {
  return (
    <nav className="navbar navbar-expand container-fluid">
      <motion.ul
        className={"navbar-nav"}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        variants={{
          visible: { opacity: 1, scale: 1 },
          hidden: { opacity: 0, scale: 0 },
        }}
        role="tablist"
      >
        {tabs.map((current) => {
          return (
            <li key={current.name} className="navbar__item">
              <Link
                to={current.to}
                key={current.id}
                role="tab"
                aria-selected={current.id === nav}
                onClick={(e) => tabHandler(e, current.id)}
                className={`${current.id === nav ? "active" : ""}`}
                aria-controls={`tab-panel-${current.id}`}
              >
                {current.name}
              </Link>
            </li>
          );
        })}
      </motion.ul>
    </nav>
  );
}
