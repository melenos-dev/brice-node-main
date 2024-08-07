import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useAxiosPrivate from "../../../../../hooks/useAxiosPrivate.js";
import Filter from "../Filter/index.js";
import Circles from "../../../../../components/Loader/circles.js";
import Loader from "../../../../../components/Loader/index.js";

export default function Tab2({ tabHandler, creationId }) {
  const [ok, setOk] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [filters, setFilters] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const axiosPrivate = useAxiosPrivate();

  const titleRef = useRef();
  const errRef = useRef();
  const filesRef = useRef();

  useEffect(() => {
    titleRef.current.focus();
  }, []);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getFilters = async () => {
      try {
        console.log(creationId);
        const response = await axiosPrivate.get(
          creationId === null
            ? "api/creations/filters"
            : `api/creations/filters/${creationId}`,
          {
            signal: controller.signal,
          }
        );
        isMounted && setFilters(response.data);
        setIsLoading(false);
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
            setErrMsg("Token invalide !");
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

  useEffect(() => {
    title.length > 50
      ? setErrMsg(
          "Le nom d'une création ne doit pas dépasser 50 caractères."
        ) && titleRef.current.focus()
      : errMsg && setErrMsg("");
  }, [title]);

  const postCreation = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const myFiles = filesRef.current.files;
      const formData = new FormData();

      Object.keys(myFiles).forEach((key) => {
        formData.append("files", myFiles.item(key));
      });

      formData.append("title", title);
      formData.append("desc", desc);

      const response = await axiosPrivate.post(
        "api/creations/create",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      const relateFilters = await axiosPrivate.post(
        "api/creations/filters/relate",
        JSON.stringify({
          creation_id: response.data.id,
          filters_id: selectedFilters,
        }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      setOk(true);

      setTimeout(() => {
        tabHandler("", 0);
      }, 1500);
    } catch (err) {
      setIsLoading(false);
      if (!err?.response)
        return setErrMsg("Le serveur ne répond pas. Pray for Dord !");
      switch (
        err.response.status // Because the objection.js model only sends status 400, the errors come from the backend
      ) {
        case 400:
          setErrMsg(
            "Problème pendant l'enregistrement de cette création. Pray for Dord !"
          );
          break;
        case 403:
          navigate("/login", { replace: true }); // Invalid token
          break;
        case 422:
          setErrMsg("Le titre ne doit pas dépasser 50 caractères.");
          break;
        case 401:
          navigate("/login", { replace: true }); // Rights violation
          break;
        default:
          setErrMsg("Erreur serveur. Pray for Dord !");
      }

      errRef.current.focus();
    }
  };

  return (
    <>
      {!ok ? (
        <>
          <form onSubmit={postCreation} encType="multipart/form-data">
            <AnimatePresence initial={false}>
              <motion.p
                ref={errRef}
                key="tab2Err"
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
              name="title"
              id="title"
              ref={titleRef}
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              placeholder="Titre"
              required
            />
            <br />
            <input
              ref={filesRef}
              type="file"
              name="files"
              id="files"
              accept="image/*"
              multiple
              required
            />
            <div style={{ marginBottom: "30px" }}>
              {filters?.length &&
                filters.map((current, index) => (
                  <Filter
                    key={index}
                    id={current.id}
                    name={current.name}
                    selectedFilters={selectedFilters}
                    setSelectedFilters={setSelectedFilters}
                  />
                ))}
            </div>
            <textarea
              name="desc"
              id="desc"
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Description"
              value={desc}
            />
            <br />
            <input
              className="button button__Blue"
              type="submit"
              value="Ajouter"
              style={{ marginTop: 20 }}
            />
          </form>
          {isLoading && <Loader />}
        </>
      ) : (
        <>
          <div className="loader">
            <Circles />
          </div>

          <motion.span
            className="success"
            key="tab2Success"
            className={"success"}
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
            Création ajoutée avec succès !
          </motion.span>
        </>
      )}
    </>
  );
}
