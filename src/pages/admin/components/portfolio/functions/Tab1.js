import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Circles from "../../../../../components/Loader/circles.js";
import useAxiosPrivate from "../../../../../hooks/useAxiosPrivate.js";

export default function Tab1() {
  const [filters, setFilters] = useState();
  const axiosPrivate = useAxiosPrivate();
  const nameRef = useRef();
  const errRef = useRef();
  const [name, setName] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    nameRef.current.focus();
  }, []);

  useEffect(() => {
    name.length > 10
      ? setErrMsg("Le nom du filtre ne doit pas dépasser 10 caractères")
      : errMsg && setErrMsg("");
  }, [name]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getFilters = async () => {
      try {
        const response = await axiosPrivate.get("api/creations/filters", {
          signal: controller.signal,
        });
        isMounted && setFilters(response.data);
      } catch (err) {
        !err?.response &&
          setErrMsg("Le serveur ne répond pas. Pray for Dord !");

        switch (
          err?.response?.status // Because the objection.js model only sends status 400, the errors come from the backend
        ) {
          case 400:
            setErrMsg(
              "Problème pendant le chargement des filtres. Pray for Dord !"
            );
            break;
          case 403:
            navigate("/login", { replace: true }); // Invalid token
            break;
          default:
            setErrMsg("Erreur serveur. Pray for Dord !");
        }

        errRef.current.focus();
      }
    };

    getFilters();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const postFilter = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosPrivate.post(
        "api/creations/filters/create",
        JSON.stringify({ name }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      setName("");
      setFilters([...filters, response.data]);
    } catch (err) {
      !err?.response && setErrMsg("Le serveur ne répond pas. Pray for Dord !");
      switch (
        err.response.status // Because the objection.js model only sends status 400, the errors come from the backend
      ) {
        case 400:
          setErrMsg(
            "Problème pendant le chargement des filtres. Pray for Dord !"
          );
          break;
        case 403:
          setErrMsg("Token invalide !");
          break;
        case 409:
          setErrMsg("Dude, ce filtre existe déjà.");
          break;
        case 422:
          setErrMsg(
            "Le nombre de caractères du filtre doit être entre 3 et 10."
          );
          break;
        case 401:
          setErrMsg(
            "Connexion perdue (erreur de droits). Actualise et si ça ne fonctionne pas, reconnecte toi depuis le login."
          );
          break;
        default:
          setErrMsg("Erreur serveur. Pray for Dord !");
      }

      errRef.current.focus();
    }
  };

  const deleteFilter = async (filter) => {
    if (window.confirm("Supprimer le filtre " + filter.name + " ?")) {
      try {
        const response = await axiosPrivate.delete(
          "api/creations/filters/delete/" + filter.id
        );

        const filterIndex = filters.findIndex(
          (current) => current.id === response.data.id
        );

        filters.splice(filterIndex, 1);
        setFilters([...filters]);
      } catch (err) {
        !err?.response &&
          setErrMsg("Le serveur ne répond pas. Pray for Dord !");
        switch (
          err.response.status // Because the objection.js model only sends status 400, the errors come from the backend
        ) {
          default:
            setErrMsg("Erreur serveur. Pray for Dord !");
        }
      }
    }
  };

  return (
    <>
      <form onSubmit={postFilter}>
        <AnimatePresence initial={false}>
          <motion.p
            ref={errRef}
            key="tab1Err"
            className={errMsg ? "err" : "d-none"}
            aria-live="assertive"
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
        </AnimatePresence>
        <input
          type="text"
          name="name"
          id="name"
          ref={nameRef}
          onChange={(e) => setName(e.target.value)}
          value={name}
          required
        />
        <input
          className="button button__Blue"
          type="submit"
          value="Ajouter"
          style={{ marginLeft: 10 }}
        />
      </form>

      {filters?.length ? (
        <table>
          <tbody>
            {filters.map((filter, index) => (
              <tr key={index}>
                <td>{filter.name}</td>
                <td className="delete">
                  <span className="button" onClick={() => deleteFilter(filter)}>
                    Supprimer
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ marginTop: 10 }}>Aucun filtre n'a été créé.</p>
      )}
    </>
  );
}
