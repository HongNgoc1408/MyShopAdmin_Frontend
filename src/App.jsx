import React, { createContext, useContext, useReducer } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { generatePrivateRoutes, generatePublicRoutes } from "./routes";
import NotFound from "./components/NotFound/NotFound";
import { initialState, reducer } from "./services/AuthReducer";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <div>
      <AuthContext.Provider value={{ state, dispatch }}>
        <Router>
          <Routes>
            {generatePublicRoutes(state.isAuthenticated)}
            {state.roles?.includes("Admin") &&
              generatePrivateRoutes(state.isAuthenticated)}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
