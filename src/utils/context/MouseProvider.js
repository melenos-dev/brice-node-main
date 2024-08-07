import React, { createContext, useReducer } from "react";

function reducer(state, action) {
  if (action.type === "mouseHover") {
    console.log(state);
    return {
      ...state,
      cursorType:
        state.cursorType === action.cursorType
          ? state.cursorType
          : action.cursorType,
    };
  } else if (action.type === "mouseClick") {
    //console.log(state);
    return { ...state, cursorClick: state.cursorClick ? false : true };
  }
}

export const StateContext = createContext();
export const MouseContext = createContext();

const MouseContextProvider = (props) => {
  const [state, mouseHandler] = useReducer(reducer, {
    cursorType: "",
    cursorClick: false,
  });

  return (
    <MouseContext.Provider value={mouseHandler}>
      <StateContext.Provider value={state}>
        {props.children}
      </StateContext.Provider>
    </MouseContext.Provider>
  );
};

export default MouseContextProvider;
