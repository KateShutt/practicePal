import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function PracticeRequiredRoute({ children }) {
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  // checking / ready / error

  const [hasPracticed, setHasPracticed] = useState(false);

  useEffect(() => {
    async function loadPracticeData() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/practice-entries`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        setHasPracticed(res.data.entries.length > 0);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }

    loadPracticeData();
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

  return hasPracticed ? children : <Navigate to="/dashboard" />;
}

export default PracticeRequiredRoute;
