import authService from "./AuthService";

const user = authService.getCurrentUser();

export const initialState = {
  isAuthenticated: user !== undefined,
  roles: user !== undefined ? user.roles : [],
};
export const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        roles: action.roles,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        roles: [],
      };

    default:
      return state;
  }
};
