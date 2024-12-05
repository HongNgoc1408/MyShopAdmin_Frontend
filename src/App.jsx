import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import {
  generateInventorierRoutes,
  generateManagerRoutes,
  generatePrivateRoutes,
  generatePublicRoutes,
  generateStaffRoutes,
} from "./routes";
import { initialState, reducer } from "./services/AuthReducer";
import NotFound from "./pages/NotFound/NotFound";
import UserService from "./services/UserService";
import ScrollToTop from "./components/ScrollToStop";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
export const AvatarContext = createContext();

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [avatar, setAvatar] = useState([]);

  useEffect(() => {
    if (state.isAuthenticated) {
      const fetchFavorites = async () => {
        try {
          const avatar = await UserService.getAvatar();
          setAvatar(avatar.data.imageURL);
        } catch (error) {
          console.error("Error", error);
        }
      };

      fetchFavorites();
    }
  }, [state.isAuthenticated]);

  return (
    <div>
      <AuthContext.Provider value={{ state, dispatch }}>
        <AvatarContext.Provider value={{ avatar, setAvatar }}>
          <ScrollToTop />
          <Router>
            <Routes>
              {generatePublicRoutes(state.isAuthenticated)}
              {state.roles?.includes("Admin") &&
                generatePrivateRoutes(state.isAuthenticated)}
              {state.roles?.includes("Inventorier") &&
                generateInventorierRoutes(state.isAuthenticated)}
              {state.roles?.includes("Manager") &&
                generateManagerRoutes(state.isAuthenticated)}
              {state.roles?.includes("Staff") &&
                generateStaffRoutes(state.isAuthenticated)}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </AvatarContext.Provider>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
