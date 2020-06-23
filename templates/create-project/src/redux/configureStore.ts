import { createStore, compose, applyMiddleware } from "redux";
import { routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";
import createRootReducer from "./rootReducer";
import { ReduxState } from "./types";

export const history = createBrowserHistory();
export let store: any;

export const configureStore = (rootReducer?: ReduxState) => {
  store = createStore(
    createRootReducer(history),
    rootReducer,
    compose(applyMiddleware(routerMiddleware(history)))
  );

  return store;
};
