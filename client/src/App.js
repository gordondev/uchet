import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./components/AppRouter";
import { observer } from "mobx-react-lite";

const App = observer(() => {
  return (
    <BrowserRouter>
      <p>WORKED</p>
      <AppRouter />
    </BrowserRouter>
  );
});

export default App;
