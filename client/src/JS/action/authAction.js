import {
  GET_AUTH_USER_FAIL,
  GET_AUTH_USER_LOADING,
  GET_AUTH_USER_SUCCESS,
} from "../constants/authConstants";

// export const postAuthUser = () => {
//   dispatch({ type: GET_AUTH_USER_LOADING });
// };

export const AuthUserPost = () => async (dispatch) => {
  dispatch({ type: GET_PERSON_LOADING });
  try {
    let result = await axios.get("/api/person");
    dispatch({
      type: GET_PERSON_SUCCESS,
      payload: result.data,
    });
  } catch (error) {
    dispatch({ type: GET_PERSON_FAIL, payload: error });
    console.log(error);
  }
};
