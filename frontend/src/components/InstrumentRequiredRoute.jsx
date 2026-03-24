import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { userHasInstruments } from "../services/instrumentFunctions";

function InstrumentRequiredRoute({ children }) {
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);

  const [hasInstrument, setHasInstrument] = useState(false);

  useEffect(() => {
    async function checkInstruments() {
      try {
        const result = await userHasInstruments(token);
        setHasInstrument(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    checkInstruments();
  }, [token]);

  if (loading) {
    return (
      <main className="page-shell">
        <section className="page-card">
          <h1>Loading....</h1>
        </section>
      </main>
    );
  }

  return hasInstrument ? children : <Navigate to="/dashboard" />;
}

export default InstrumentRequiredRoute;
