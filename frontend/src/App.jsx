import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AddEntryPage from "./pages/AddEntryPage";
import AddInstrumentPage from "./pages/AddInstrumentPage";
import "./styles/global.css";
import Modal from "react-modal";
import InstrumentRequiredRoute from "./components/InstrumentRequiredRoute";

import { useEffect, useState } from "react";
import axios from "axios";

Modal.setAppElement("#root");

function App() {
  const [backendStatus, setBackendStatus] = useState("checking");
  //"checking" / "ready" / "error"

  useEffect(() => {
    async function wakeBackend() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/health`,
        );

        if (res.status !== 200) {
          throw new Error("Health check failed");
        }

        await new Promise((resolve) => setTimeout(resolve, 2000));
        setBackendStatus("ready");
      } catch (error) {
        console.error("Backend wake failed", error);
        setBackendStatus("error");
      }
    }

    wakeBackend();
  }, []);

  if (backendStatus === "checking") {
    return (
      <div>
        <h2>Waking backend...</h2>
        <p>The server may take a little while to start on first load.</p>
      </div>
    );
  }

  if (backendStatus === "error") {
    return (
      <div>
        <h2>Backend unavailable</h2>
        <p>Please wait a moment and refresh.</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/register" element={<RegisterPage />}></Route>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/addEntry"
          element={
            <ProtectedRoute>
              <InstrumentRequiredRoute>
                <AddEntryPage />
              </InstrumentRequiredRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/addInstrument"
          element={
            <ProtectedRoute>
              <AddInstrumentPage />
            </ProtectedRoute>
          }
        ></Route>
      </Routes>
    </>
  );
}

export default App;
