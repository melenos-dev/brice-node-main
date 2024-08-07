import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Home from "../pages/home.js";
import ComingSoon from "../pages/coming-soon.js";
import Handicap from "../pages/handicap.js";
import PortFolio from "../pages/portfolio.js";
import Login from "../pages/login.js";
import Signup from "../pages/signup.js";
import R404 from "../pages/404.js";
import Admin from "../pages/admin/admin.js";
import RequireAuth from "../components/RequireAuth.js";
import PersistLogin from "../components/PersistLogin.js";
import { AnimatePresence } from "framer-motion";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence initial={false}>
      <Routes location={location} key={location.pathname}>
        {/* public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<PersistLogin />}>
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/handicap" element={<Handicap />} />
          <Route path="/portfolio" element={<PortFolio />} />
          <Route path="/" element={<Home />} />
          {/* Protected user's routes */}
          <Route
            element={
              <RequireAuth
                allowedRoles={[process.env.ADMIN, process.env.SUPER_ADMIN]}
              />
            }
          >
            <Route path={process.env.ADMIN_URL} element={<Admin />} />
          </Route>
        </Route>

        <Route path="/404" element={<R404 />} status={404} />
        <Route
          path="*"
          element={<Navigate to="/404" replace />}
          status={404}
        ></Route>
      </Routes>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;
