import { AnyAction } from "redux";
import { ActionTypes, unTittledState } from "./types";

const initState: unTittledState = {};

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
