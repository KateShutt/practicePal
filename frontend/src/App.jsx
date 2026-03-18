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

Modal.setAppElement("#root");

function App() {
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
