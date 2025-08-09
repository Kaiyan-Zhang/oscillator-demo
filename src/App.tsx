import React from "react";
import { Keyboard } from "./Keyboard";
import { AudioContextWrapper } from "./AudioContextWrapper";

export const App = () => {
  return (
    <div className="app">
      <AudioContextWrapper>
        <Keyboard />
      </AudioContextWrapper>
    </div>
  );
};
