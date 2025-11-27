import "./App.css";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Auth from "./pages/auth";
import Doctors from "./pages/doctors";
import Filials from "./pages/filials";
import Specialties from "./pages/specialties";

import { setLogoutHandler } from "./api";
import { useEffect } from "react";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    setLogoutHandler(() => {
      navigate("/auth");
    });
  }, []);
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" replace />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/doctors" element={<Doctors />} />
      <Route path="/filials" element={<Filials />} />
      <Route path="/specialties" element={<Specialties />} />
    </Routes>
  );
}

export default App;
