import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "../../css/pages/admin/admin.scss";
import Nav from "./components/portfolio/Nav/index.js";
import Tab0 from "./components/portfolio/functions/Tab0.js";
import Tab1 from "./components/portfolio/functions/Tab1.js";
import Tab2 from "./components/portfolio/functions/Tab2.js";
import Loader from "../../components/Loader/index.js";

const tabs = [
  // Here to add a new tab. To create the tab content, just create the next component "Tabx.js" at admin/components/portfolio/functions/Tabx.js with the same id number
  {
    id: 0,
    to: "/admin/portfolio",
    name: "Portfolio",
    component: Tab0,
  },
  {
    id: 1,
    to: "/admin/portfolio",
    name: "Ajouter un filtre",
    component: Tab1,
  },
  {
    id: 2,
    to: "/admin/portfolio",
    name: "Ajouter une création",
    component: Tab2,
  },
];

export default function Admin() {
  const [nav, setNav] = useState("");
  const [creationId, setCreationId] = useState(null);

  const tabHandler = (e, next, creation_id = null) => {
    e !== "" && e.preventDefault();
    setNav(next);
    setCreationId(creation_id);
  };

  const renderTab = () => {
    const TabPanel = tabs[nav].component;
    return (
      <div
        className="d-flex w-100 flex-column justify-content-center align-items-center"
        id="tabs"
      >
        <TabPanel tabHandler={tabHandler} creationId={creationId} />
      </div>
    );
  };

  useEffect(() => {
    nav === "" && tabHandler("", tabs[0].id);
  }, []);

  return (
    <motion.div
      className="admin page d-flex flex-wrap"
      initial={{ opacity: 0, x: "-100vh" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100vh" }}
      transition={{ duration: 0.2 }}
    >
      <div className="text-center justify-content-center align-items-center d-flex w-100 flex-column">
        <Nav tabHandler={tabHandler} nav={nav} tabs={tabs} />
        {nav !== "" ? renderTab() : <Loader />}
      </div>
    </motion.div>
  );
}
