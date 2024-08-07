import React, { useRef, useState, useEffect } from "react";
import useAuth from "../hooks/useAuth.js";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../css/pages/login.scss";
import axios from "../utils/axios.js";
import logoPath from "../../src/img/logo/logogin.png";

export default function Login() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const emailRef = useRef();
  const errRef = useRef();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  useEffect(() => {
    setErrMsg("");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `api/auth/login`,
        JSON.stringify({ email, password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const firstname = response?.data?.firstname;
      const lastname = response?.data?.lastname;
      const roles = response?.data?.roles;
      const accessToken = response?.data?.accessToken;

      setAuth({
        firstname,
        lastname,
        email,
        roles,
        accessToken,
      });

      setEmail("");
      setPassword("");

      localStorage.setItem("persist", true);

      navigate(process.env.ADMIN_URL, { replace: true });
    } catch (err) {
      if (!err?.response) {
        setErrMsg("Le serveur ne répond pas.");
      } else if (err.response?.status === 400) {
        setErrMsg("Il manque l'email ou le mot de passe...");
      } else if (err.response?.status === 401) {
        setErrMsg("Hum. T'es sur des identifiants ? ;p");
      } else {
        setErrMsg("Erreur de connexion. Pray for Dord !");
      }
      errRef.current.focus();
    }
  };

  return (
    <motion.div
      className="login page d-flex flex-wrap justify-content-center"
      initial={{ opacity: 0, x: "-100vh" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100vh" }}
      transition={{ duration: 0.2 }}
    >
      <div className="text-center justify-content-center align-items-center d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center w-100">
          <h1>
            Sb<span>_</span> Login
          </h1>
          <a className="button button__BO">BO</a>
        </div>
        <motion.p
          ref={errRef}
          className={errMsg ? "err" : "d-none"}
          aria-live="assertive"
          key="loginErr"
          whileInView="visible"
          initial="hidden"
          viewport={{ once: false }}
          transition={{ duration: 0.4 }}
          variants={{
            visible: {
              opacity: 1,
              height: "auto",
              marginBottom: 14,
            },
          }}
        >
          {errMsg}
        </motion.p>
        <form
          onSubmit={handleSubmit}
          className="d-flex text-start justify-content-between"
        >
          <div>
            <label for="email">E-mail</label>
            <br />
            <input
              type="text"
              name="email"
              id="email"
              ref={emailRef}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </div>

          <div>
            <label for="password">Mot de passe</label>
            <br />

            <input
              type="password"
              name="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />

            <input
              className="button button__Blue"
              type="submit"
              value="Se connecter"
            />
          </div>
        </form>
      </div>
      <div style={{ width: "100%" }}>
        <img
          src={logoPath}
          alt="Séraphin Brice"
          id="logo"
          className="shake-little"
        />
      </div>
    </motion.div>
  );
}
