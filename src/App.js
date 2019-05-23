import React from "react";
import { StoreProvider } from "easy-peasy";
import { MemoryRouter as Router } from "react-router";

import MainPage from "./components";
import store from "./store";

const App = () => (
  <StoreProvider store={store}>
    <Router>
      <MainPage />
    </Router>
  </StoreProvider>
);
export default App;
