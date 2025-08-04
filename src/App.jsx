import React from "react";
import { Keyboard } from "./Keyboard.jsx";
import { AudioContextWrapper } from "./AudioContextWrapper.jsx";

export const App = () => {
  return (
    <div className="app">
      <AudioContextWrapper>
        <Keyboard />
      </AudioContextWrapper>
    </div>
  );
};
