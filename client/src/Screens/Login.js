import React, { useState, useEffect } from "react";
import authSvg from "../assests/login.svg";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
// import jwt from "jsonwebtoken";
import { authenticate, isAuth } from "../helpers/auth";
import { Link, Redirect } from "react-router-dom";
import { GoogleLogin } from "react-google-login";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

const Login = ({ history }) => {
  const [formData, setFormData] = useState({
    email: "",
    password1: "",
  });

  const { email, password1 } = formData; //, textChange

  const handleChange = (text) => (e) => {
    console.log(email, password1);
    setFormData({ ...formData, [text]: e.target.value });
  };

  // Send Facebook Token
  const sendFacebookToken = (userID, accessToken) => {
    alert("sendfacebook ");
    axios
      .post(`${process.env.REACT_APP_API_URL}/facebooklogin`, {
        userID,
        accessToken,
      })
      .then((res) => {
        alert("then ");
        console.log(res.data);
        informParent(res);
      })
      .catch((error) => {
        alert("catch ");
        console.log("GOOGLE SIGNIN ERROR", error.response);
      });
  };

  // send google token
  const sendGoogleToken = (tokenId) => {
    // alert("test google");
    axios
      .post(`${process.env.REACT_APP_API_URL}/googlelogin`, {
        idToken: tokenId,
      })
      .then((res) => {
        alert(".then google");
        console.log("res.data", res.data);
        informParent(res);
      })
      .catch((error) => {
        alert(".catch google");
        // console.log("GOOGLE SIGNIN ERROR", error.response);
        toast.error("GOOGLE SIGNIN ERROR", error.response);
      });
  };
  // if succes we need to authenticate user and redirect
  const informParent = (response) => {
    authenticate(response, () => {
      isAuth() && isAuth().role === "admin"
        ? history.push("/admin")
        : history.push("/private");
    });
  };
  // Get response from facebook
  const responseFacebook = (response) => {
    alert("responseFacebook");
    console.log("responseFacebook", response);
    sendFacebookToken(response.userID, response.accessToken);
  };

  // Get response from google
  const responseGoogle = (response) => {
    alert("responseGoogle google");
    console.log("response", response);
    sendGoogleToken(response.tokenId);
  };

  // submit data to back end
  const handleSubmit = (e) => {
    // alert("test");
    e.preventDefault();
    if (email && password1) {
      axios
        // .post(`${process.env.REACT_APP_API_URL}/register`, {
        .post(`${process.env.REACT_APP_API_URL}/login`, {
          email,
          password: password1,
        })
        .then((res) => {
          authenticate(res, () => {
            setFormData({
              ...formData,
              email: "",
              password1: "",
            });
            // alert(res.data.message);
            console.log(res);
            toast.success(res.data.message);
          });
          //if authentificate but not admin redirect to /private
          //if admin redirect to /admin
          isAuth() && isAuth().role === "admin"
            ? history.push("/admin")
            : history.push("/private");
          toast.success(`Hey ${res.data.user.name}, Welcome Back`);
        })
        .catch((err) => {
          // alert(err.response.data.error);
          toast.error(err.response.data.error);
        });
    } else {
      toast.error("Please fill all Fields");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      {isAuth() ? <Redirect to="/" /> : null}
      <ToastContainer />
      <div className="max-w-screen-xl m-0 sm:m-20 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">
              Sign In for Immob-Loc
            </h1>
            <form
              className="w-full flex-1 mt-8 text-indigo-500"
              onSubmit={handleSubmit}
            >
              <div className="mx-auto max-w-xs relative ">
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                  type="email"
                  placeholder="Email"
                  onChange={handleChange("email")}
                  value={email}
                />
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                  type="password"
                  placeholder="Password"
                  onChange={handleChange("password1")}
                  value={password1}
                />
                <button
                  type="submit"
                  className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                >
                  <i className="fas fa-user-plus fa 1x w-6  -ml-2" />
                  <span className="ml-3"> Sign In </span>
                  {/* {textChange} */}
                </button>
                <Link
                  to="/users/passwords/forget"
                  className="no-underline hover:underline text-indigo-500 text-md text-right absolute right-0  mt-2"
                >
                  Forget password?
                </Link>
              </div>
              <div className="my-12 border-b text-center">
                <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                  Or sign with email or social login
                </div>
              </div>
              <div className="flex flex-col items-center">
                <GoogleLogin
                  clientId={`${process.env.REACT_APP_GOOGLE_CLIENT}`}
                  onSuccess={responseGoogle}
                  onFailure={responseGoogle}
                  cookiePolicy={"single_host_origin"}
                  render={(renderProps) => (
                    <button
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                      className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800
                        flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none
                        hover:shadow focus:shadow-sm focus:shadow-outline"
                    >
                      <div className=" p-2 rounded-full ">
                        <i className="fab fa-google " />
                      </div>
                      <span className="ml-4">Sign In with Google</span>
                    </button>
                  )}
                ></GoogleLogin>
                <a
                  className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3
           bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline mt-5"
                  href="/register"
                  target="_self"
                >
                  <i className="fas fa-sign-in-alt fa 1x w-6  -ml-2 text-indigo-500" />
                  <span className="ml-4">Sign Up</span>
                </a>
              </div>
            </form>
            <FacebookLogin
              appId={`${process.env.REACT_APP_FACEBOOK_CLIENT}`} // this facebook app id
              autoLoad={false} // if true when open login page it will go to lofin with facebook and we won't to do this
              onClick={responseFacebook}
              render={(renderProps) => (
                <button
                  onClick={renderProps.onClick}
                  className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 
                      flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none 
                      hover:shadow focus:shadow-sm focus:shadow-outline mt-5"
                >
                  <div className=" p-2 rounded-full ">
                    <i className="fab fa-facebook" />
                  </div>
                  <span className="ml-4">Sign In with Facebook</span>
                </button>
              )}
            />
          </div>
        </div>
        <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${authSvg})` }}
          ></div>
        </div>
      </div>
      {/* REGISTER PAGE */}
    </div>
  );
};

export default Login;
