import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { userHasInstruments } from "../services/instrumentFunctions";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");

  const [hasInstrument, setHasInstrument] = useState(false);

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
        <Link className="navbar-brand" to="/">
          {/*navbar-brand is the logo / identity of site. Takes you to homepage*/}
          PracticePal
        </Link>

        <div className="navbar-nav ms-auto">
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

          {token && (
            <button className="nav-link btn btn-link" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
