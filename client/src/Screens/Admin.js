import React from "react";
import { Signout } from "../helpers/auth";
import { ToastContainer, toast } from "react-toastify";
import { Redirect } from "react-router-dom";
import { isAuth } from "../helpers/auth";

const Admin = ({ history }) => {
  return (
    <div>
      {!isAuth() ? <Redirect to="/" /> : null}
      <h1>Admin</h1>
      <button
        style={{ width: "12%" }}
        onClick={() => {
          Signout(() => {
            toast.error("Signout Successfully");
            history.push("/");
          });
        }}
        className="mt-5 tracking-wide font-semibold bg-pink-500 text-gray-100 w-full py-4 rounded-lg hover:bg-pink-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
      >
        <i className="fas fa-sign-out-alt  w-6  -ml-2" />
        <span className="ml-3">Signout</span>
      </button>
    </div>
  );
};

export default Admin;
