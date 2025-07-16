import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useAuthStore from "./store/authStore";
import useResumeStore from "./store/resumeStore";

import { LandingPage } from "./pages";
import Login from "./Components_Page/Login";
import Signup from "./Components_Page/Signup";
import Dashboard from "./Components_Page/dashboard/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import ATSScorePage from "./Components_Page/checkATS/ATSScorePage";
import BuildResume from "./Components_Page/buildResume/BuildResume";
import SelectTemplate from "./Components_Page/selectTemplate/SelectTemplate";

function App() {
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const { user, isAuthenticated } = useAuthStore();
  const { fetchALLResume } = useResumeStore();

  useEffect(() => {
    const init = async () => {
      await fetchUser(); //  First fetch user
    };
    init();
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchALLResume(); //  Then fetch resumes after user is ready
    }
  }, [isAuthenticated, user]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ats" element={<ATSScorePage />} />
          <Route path="/buildresume" element={<BuildResume />} />
          <Route path="/selecttemplate" element={<SelectTemplate />} />
        </Route>
      </Routes>
      <ToastContainer position="top-center" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;
