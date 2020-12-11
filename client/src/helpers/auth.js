// import { response } from "express";
import cookie from "js-cookie";

// set in cookie
export const setCookie = (key, value) => {
  if (window !== "undefiend") {
    cookie.set(key, value, {
      // 1Day
      expires: 1,
    });
  }
};

//remove from cookie
export const removeCookie = (key) => {
  if (window !== "undefiend") {
    cookie.remove(key, {
      // 1Day
      expires: 1,
    });
  }
};

// Get from cookie such as stored token
// Will be useful when we need to make request to server with token
export const getCookie = (key) => {
  if (window !== "undefined") {
    return cookie.get(key);
  }
};

// Set in localstorage
export const setLocalStorage = (key, value) => {
  if (window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

// Remove from localstorage
export const removeLocalStorage = (key) => {
  if (window !== "undefined") {
    localStorage.removeItem(key);
  }
};

// Auth user after login
export const authenticate = (response, next) => {
  setCookie("token", response.data.token);
  setLocalStorage("user", response.data.user);
  next();
};

// Signout
export const Signout = (next) => {
  alert("Sign Out");

  removeCookie("token");
  removeLocalStorage("user");
};

// Get User info from localsotrage
export const isAuth = () => {
  if (window !== "undefined") {
    console.log("window", window);
    const cookieChecked = getCookie("token");
    console.log("cookieChecked", cookieChecked);
    if (cookieChecked) {
      console.log("window", window);
      if (localStorage.getItem("user")) {
        console.log(
          "localStorage.getItem('user')",
          localStorage.getItem("user")
        );
        return JSON.parse(localStorage.getItem("user"));
      } else {
        console.log("else false");
        return false;
      }
    }
  }
};

// update user data localstorage
export const updateUser = (response, next) => {
  if (window !== "undefiend") {
    let auth = JSON.parse(localStorage.getItem("user"));
    auth = response.data;
    localStorage.setItem("user", JSON.stringify(auth));
  }
  next();
};
