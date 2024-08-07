import React, { useContext, useState, useRef } from "react";
import { motion } from "framer-motion";
import { MouseContext } from "../../utils/context/MouseProvider.js";
import Row from "./Row/index.js";

export default function Dribbble({ tempFollowers }) {
  const mouseHandler = useContext(MouseContext);
  const [variants, setVariants] = useState({});
  const [followersVariants, setFollowersVariants] = useState({});
  const followers = useRef();
  const boxVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false }}
      transition={{ duration: 1.3, delay: 0 }}
      variants={{
        visible: { opacity: 1, height: 241, paddingTop: 60, marginBottom: 20 },
        hidden: { opacity: 0, height: 0, paddingTop: 0, marginBottom: 0 },
      }}
      className="dribbble"
    >
      <motion.span
        animate={followersVariants}
        onMouseOver={() =>
          setFollowersVariants({
            color: "#FFFFFF",
            transition: {
              duration: 0.3,
            },
          })
        }
        onMouseOut={() =>
          setFollowersVariants({
            color: "#b4b4b4",
            transition: {
              duration: 0.3,
            },
          })
        }
      >
        Dribbble Followers
      </motion.span>
      <div
        className="dribbble__box"
        onMouseOver={() => (
          setFollowersVariants({
            color: "#FFFFFF",
            transition: {
              duration: 0.3,
            },
          }),
          setVariants({
            backgroundColor: "#4464af",
            scale: [1, 1.1, 1],
            transition: {
              duration: 0.3,
            },
          })
        )}
        onMouseOut={() => (
          setFollowersVariants({ color: "#b4b4b4" }),
          setVariants({ backgroundColor: "#e94782" })
        )}
      >
        <motion.span animate={variants}></motion.span>
        <div className="dribbble__box__counter">
          <motion.div
            ref={followers}
            variants={boxVariants}
            animate="show"
            className="d-flex justify-content-center"
          >
            {tempFollowers.split("").map((current, index) => {
              return (
                <Row
                  key={index}
                  end={current}
                  space={
                    (tempFollowers.length == 5 && index == 1) ||
                    (tempFollowers.length == 6 && index == 2)
                  }
                />
              );
            })}
          </motion.div>
          <a
            href="https://dribbble.com/seraphinbrice"
            target="_blank"
            onMouseOver={() => (
              mouseHandler({
                type: "mouseHover",
                cursorType: "active black",
              }),
              setVariants({
                backgroundColor: "#4464af",
                scale: [1, 1.1, 1],
                transition: {
                  duration: 0.3,
                },
              })
            )}
            onMouseOut={() => (
              mouseHandler({ type: "mouseHover", cursorType: "white" }),
              setVariants({ backgroundColor: "#e94782" })
            )}
          >
            Suivez moi
          </a>
        </div>
      </div>
    </motion.div>
  );
}
