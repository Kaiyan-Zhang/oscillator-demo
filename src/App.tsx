import React from "react";
import { Main } from "./main";
import { AudioContextWrapper } from "./AudioContextWrapper";

export const App = () => {
  return (
    <div className="app">
      <AudioContextWrapper>
        <Main />
      </AudioContextWrapper>
    </div>
  );
};
