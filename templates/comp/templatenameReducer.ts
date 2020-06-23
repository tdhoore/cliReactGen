import { AnyAction } from "redux";
import { ActionTypes, templatenameState } from "./types";

const initState: templatenameState = {};

export default (state = initState, action: AnyAction) => {
  switch (action.type) {
    /*case ActionTypes.example:
      return {
        ...state,
        example: action.payload,
      };*/
    default:
      return state;
  }
};
