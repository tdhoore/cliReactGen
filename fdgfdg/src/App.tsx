import React from "react";
import { Provider } from "react-redux";
import { store, configureStore } from "./redux/configureStore";
import Routs from "./redux/Routs";

const App = () => {
  configureStore();

  return (
    <Provider store={store}>
      <Routs />
    </Provider>
  );
};

export default App;
