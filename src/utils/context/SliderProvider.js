import React, { createContext, useState } from "react";

export const SliderContext = createContext({
  key: 1,
  incrementKeyHandler: () => {},
  currentSlide: -1,
  restartCurrentSlide: () => {},
});

const SliderContextProvider = (props) => {
  const [key, setKey] = useState(1);
  const [newSlide, setCurrentSlide] = useState(-1);

  const incrementKeyHandler = (key) => {
    setKey(key);
  };

  const restartCurrentSlide = (newSlide) => {
    setCurrentSlide(newSlide);
  };

  return (
    <SliderContext.Provider
      value={{
        key: key,
        incrementKeyHandler: incrementKeyHandler,
        newSlide: newSlide,
        restartCurrentSlide: restartCurrentSlide,
      }}
    >
      {props.children}
    </SliderContext.Provider>
  );
};

export default SliderContextProvider;
