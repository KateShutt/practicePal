import { Link, useNavigate, useLocation } from "react-router-dom";

import { userHasInstruments } from "../services/instrumentFunctions";
import { useEffect, useState } from "react";

import axios from "axios";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");

  const [hasInstrument, setHasInstrument] = useState(false);

  const [userHasPracticed, setUserHasPracticed] = useState(false);

  useEffect(() => {
    async function checkInstruments() {
      // need to check if there is a token. If Not, don't do API call or will get error
      // no token = not logged in / expired token
      if (!token) {
        setHasInstrument(false);
        return;
      }
      try {
        const result = await userHasInstruments(token);
        setHasInstrument(result);
      } catch (error) {
        console.error(error);
      }
    }

    checkInstruments();
  }, [token, location.pathname]);

  useEffect(() => {
    async function checkPractice() {
      if (!token) {
        setUserHasPracticed(false);
        return;
      }
      try {
        const result = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/practice-entries`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (result.data.entries.length > 0) {
          setUserHasPracticed(true);
        } else {
          setUserHasPracticed(false);
        }
      } catch (error) {
        console.error(error);
        setUserHasPracticed(false);
      }
    }

    checkPractice();
  }, [token, location.pathname]);

  function handleLogout() {
    localStorage.removeItem("token");
    console.log("going back to landing page");
    navigate("/");
  }
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      {/*bootstrap styling */
      /*navbar expand = responsive behaviour - big vs
      small screens navbar dark = light text on dark background
      bg-dark = dark background*/}
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          {/*navbar-brand is the logo / identity of site. Takes you to homepage*/}
          PracticePal
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          <div className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            {/*navbar-nav* makes these the navigation menu
          ms-auto pushes them to the right*/}
            {!token && (
              <Link className="nav-link" to="/login">
                Login
              </Link>
            )}

            {!token && (
              <Link className="nav-link" to="/register">
                Register
              </Link>
            )}

            {token && (
              <Link className="nav-link" to="/profile">
                Profile
              </Link>
            )}

            {token && (
              <Link className="nav-link" to="/dashboard">
                Dashboard
              </Link>
            )}

            {token && hasInstrument && (
              <Link className="nav-link" to="/addEntry">
                Add Practice
              </Link>
            )}

            {token && (
              <Link className="nav-link" to="/addInstrument">
                Add Instrument
              </Link>
            )}

            {token && userHasPracticed && (
              <Link className="nav-link" to="/practiceDiary">
                View Practice
              </Link>
            )}

            {token && (
              <div className="nav-item">
                <button
                  className="nav-link btn btn-link w-100 text-start"
                  onClick={handleLogout}
                  type="button"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
