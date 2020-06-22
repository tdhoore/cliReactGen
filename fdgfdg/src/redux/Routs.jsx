import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";
import { history } from "./configureStore";
import PageBase from "../components/core/PageBase";

export default function () {
  //date
  const date = new Date();

  return (
    <ConnectedRouter history={history}>
      <Switch>
        <Route
          path="/"
          component={withRouter((props) => (
            <PageBase {...props} />
          ))}
        />
      </Switch>
      <footer> &copy; {date.getFullYear()}</footer>
    </ConnectedRouter>
  );
}
