export const LOGIN = (roles) => {
  return {
    type: "LOGIN",
    roles: roles ?? [],
  };
};

export const LOGOUT = {
  type: "LOGOUT",
};

const AuthAction = {
  LOGIN,
  LOGOUT,
};
export default AuthAction;
