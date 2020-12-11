import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuth } from "../helpers/auth";

const PrivateRoute = ({ component: Component, ...rest }) => (
  // const isAuth= localStorage.getItems("token")
  // if (token)
  <Route
    {...rest}
    render={(props) =>
      isAuth() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location },
          }}
        />
      )
    }
  ></Route>
);

export default PrivateRoute;
