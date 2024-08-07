import React, { useEffect, useState, useRef, useContext } from "react";
import { motion } from "framer-motion";
import useAxiosPrivate from "../../../../../hooks/useAxiosPrivate.js";
import { useNavigate } from "react-router-dom";
import { Link } from "../../../../../../node_modules/react-router-dom/dist/index.js";
import { MouseContext } from "../../../../../utils/context/MouseProvider.js";
import Loader from "../../../../../components/Loader/index.js";

export default function Tab0({ tabHandler }) {
  const [creations, setCreations] = useState();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const errRef = useRef();
  const mouseHandler = useContext(MouseContext);

  const deleteCreation = async (creation) => {
    if (window.confirm('Supprimer la création "' + creation.title + '" ?')) {
      try {
        const response = await axiosPrivate.delete(
          "api/creations/" + creation.id + "/delete"
        );

        const creationIndex = creations.findIndex(
          (current) => current.id === response.data.id
        );

        creations.splice(creationIndex, 1);
        setCreations([...creations]);
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

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getCreations = async () => {
      try {
        const response = await axiosPrivate.get("api/creations", {
          signal: controller.signal,
        });
        isMounted && setCreations(response.data);
        setIsLoading(false);
      } catch (err) {
        !err?.response &&
          setErrMsg("Le serveur ne répond pas. Pray for Dord !");

        switch (
          err?.response?.status // Because the objection.js model only sends status 400, the errors come from the backend
        ) {
          case 400:
            setErrMsg(
              "Problème pendant le chargement des créations. Pray for Dord !"
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

    getCreations();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <>
      {errMsg?.length && (
        <motion.p
          className="err"
          ref={errRef}
          key="tab0Err"
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
      )}
      {isLoading ? (
        <Loader />
      ) : creations?.length ? (
        <div className="d-flex flex-wrap w-100" id="creations">
          {creations.map((creation, index) => (
            <article
              key={index}
              onMouseEnter={() =>
                mouseHandler({
                  type: "mouseHover",
                  cursorType: "active",
                })
              }
              onMouseLeave={() =>
                mouseHandler({
                  type: "mouseHover",
                  cursorType: "",
                })
              }
              onClick={() => tabHandler("", 2, creation.id)}
            >
              <div className="img">
                <img src={creation.coverUrl} />
              </div>
              <div className="body">
                <h1>{creation.title}</h1>
              </div>
              <button
                className="button button__delete"
                title="Supprimer"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteCreation(creation);
                }}
              ></button>
            </article>
          ))}
        </div>
      ) : (
        !errMsg && (
          <p style={{ marginTop: 10 }}>Aucune création n'a été créée.</p>
        )
      )}
    </>
  );
}
