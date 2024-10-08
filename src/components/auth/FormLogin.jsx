import React, { useState } from "react";
import logo from "../../assets/logo.png";
import { FaEye, FaEyeSlash, FaXbox } from "react-icons/fa";
import AuthService from "../../services/AuthService";
import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";

const FormLogin = () => {
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();
  const [isShowPassword, setIsShowPassword] = useState();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const dispatch = useDispatch();

  const data = {
    username,
    password,
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await AuthService.login(data);
    console.log("res", res.status);
    if (res.status === 200) {
      navigate("/dashboard");
      // localStorage.setItem("access_token", JSON.stringify(res?.access_token));
      // if (res?.access_token) {
      //   const decoded = jwtDecode(res?.access_token);
      //   console.log("decoded", decoded);
      //   if (decoded?.id) {
      //     // console.log(decoded?.id);
      //     handleGetUser(decoded?.id, res?.access_token);
      //   }
      // }
    } else {
      console.error(res.message);
      setNotification("Login failed! " + res.message);
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };

  // const handleGetUser = async (id, token) => {
  //   const res = await AuthService.login(id, token);
  //   dispatch(updateUser({ ...res?.data, access_token: token }));
  //   // console.log("resAdmin", res);
  // };
  
  return (
    <section className="py-12 xl:px-28 ">
      {/* Thông báo */}
      {notification && (
        <div className="absolute top-28 right-0 mt-4 mr-4 bg-red-400 text-white px-4 py-2 rounded">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <FaXbox className="size-10" />
            </div>
            <div className="ml-3 pt-0.5">
              <p className="mt-1 text-md text-white">{notification}</p>
            </div>
          </div>
        </div>
      )}

      <form className="max-w-[555px] h-auto bg-white m-auto px-14 py-10 rounded-md">
        <div className="w-full flex flex-col mx-32">
          <img src={logo} alt="" width={"50%"} />
        </div>

        <h3 className="title text-center">ACCESS YOUR ACCOUNT</h3>
        <div className="w-full flex flex-col">
          <div>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="username"
              placeholder="Email Address"
              autoComplete="username"
              className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
            />
          </div>
          <div className="relative">
            <span
              className="z-10 absolute top-4 right-8"
              onClick={() => setIsShowPassword(!isShowPassword)}
            >
              {isShowPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={isShowPassword ? "text" : "password"}
              placeholder="Password"
              autoComplete="password"
              className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
            />
          </div>
        </div>

        <div className="w-full flex items-center justify-between">
          <div className="w-full flex items-center">
            <input type="checkbox" className="w-4 h-4 mr-2" />
            <p className="text-sm">Remember me</p>
          </div>
          <p className="text-sm font-medium whitespace-nowrap cursor-pointer underline underline-offset-2">
            Forgot Password ?
          </p>
        </div>

        <div className="w-full flex flex-col my-4">
          <button
            onClick={handleLogin}
            disabled={!username.length || !password.length}
            className="bg-dark-button  disabled:bg-gray-400 disabled:cursor-no-drop"
          >
            Log in
          </button>
        </div>
      </form>
    </section>
  );
};

export default FormLogin;
