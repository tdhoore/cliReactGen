import { createStore, compose, applyMiddleware } from "redux";
import { routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";
import createRootReducer from "./rootReducer";

export const history = createBrowserHistory();
export let store;

export const configureStore = rootReducer => {
  store = createStore(
    createRootReducer(history),
    rootReducer,
    compose(applyMiddleware(routerMiddleware(history)))
  );

  return store;
};
