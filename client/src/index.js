import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import UserStore from "./store/UserStore";
import ChecklistStore from "./store/ChecklistStore";
import reportWebVitals from "./reportWebVitals";

export const Context = createContext(null);
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Context.Provider
    value={{
      user: new UserStore(),
      checklist: new ChecklistStore(),
    }}
  >
    <App />
  </Context.Provider>
);

reportWebVitals();
