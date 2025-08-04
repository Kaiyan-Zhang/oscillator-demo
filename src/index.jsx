import React from "react";
import { createRoot } from "react-dom/client";
import styled from "styled-components";

const Container = styled.div`
  border: 5px solid;
`;

const App = () => {
  return <Container>hello world</Container>;
};

const root = createRoot(document.body);
root.render(<App />);
