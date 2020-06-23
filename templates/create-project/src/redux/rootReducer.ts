import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import { ReduxState } from "./types";

const createRootReducer = (history: any) =>
  combineReducers({
    router: connectRouter(history),
    //nameReducer: nameReducer,
  });

export default createRootReducer;
