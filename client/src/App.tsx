import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Dashboard from "./views/Dashboard";
import Landing from "./components/layout/Landing";
import Auth from "./views/Auth";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import { useCallback, useEffect, useState } from "react";
import { LOCAL_STORAGE_TOKEN } from "./store/constants";
import { useAppDispatch } from "./app/hooks";
import { loadUser } from "./store/authSlice";
function App() {
  // Redux
  const dispatch = useAppDispatch();

  // States
  const [isLoading, setIsLoading] = useState(true);

  // Functions
  const loadUserCallback = useCallback(() => {
    return dispatch(loadUser());
  }, [dispatch]);
  
  // check whether user info is stored
  useEffect(() => {
    if (localStorage[LOCAL_STORAGE_TOKEN]) {
      loadUserCallback();
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);
  return (
    <>
      {!isLoading && (
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Auth authRoute="login" />} />
            <Route path="/register" element={<Auth authRoute="register" />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
          </Routes>
        </Router>
      )}
    </>
  );
}

export default App;
