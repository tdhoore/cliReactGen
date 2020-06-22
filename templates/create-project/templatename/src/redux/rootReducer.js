import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

const createRootReducer = (history) =>
  combineReducers({
    router: connectRouter(history),
    //nameReducer: nameReducer,
  });

export default createRootReducer;