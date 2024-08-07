import React from "react";
import Backdrop from "../Backdrop/index.js";
import Circles from "./circles.js";

export default function Loader() {
  return (
    <Backdrop theme="black">
      <div className="loader">
        <Circles />
      </div>
    </Backdrop>
  );
}
