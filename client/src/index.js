import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Register from "./Screens/Register";
import Login from "./Screens/Login";
import Forget from "./Screens/Forget";
import Activate from "./Screens/Activate";
import Reset from "./Screens/Reset";
import "react-toastify/dist/ReactToastify.css";
import Admin from "./Screens/Admin";
import Private from "./Screens/Private";
import PrivateRoute from "./Routes/PrivateRoute";
import AdminRoute from "./Routes/AdminRoute";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Switch>
        <Route path="/" exact render={(props) => <App {...props} />} />
        <Route
          path="/register"
          exact
          render={(props) => <Register {...props} />}
        />
        <Route path="/login" exact render={(props) => <Login {...props} />} />
        <Route
          path="/users/passwords/forget"
          exact
          render={(props) => <Forget {...props} />}
        />
        <Route
          path="/users/activate/:token"
          exact
          render={(props) => <Activate {...props} />}
        />
        <Route
          path="/users/passwords/reset/:token"
          exact
          render={(props) => <Reset {...props} />}
        />
        {/* <App /> */}
        {/* <Route path="/admin" exact render={(props) => <Admin {...props} />} />
        <Route
          path="/private"
          exact
          render={(props) => <Private {...props} />}
        /> */}
        <PrivateRoute path="/private" exact component={Private} />
        <AdminRoute path="/admin" exact component={Admin} />
      </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
