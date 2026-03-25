import axios from "axios";

import { useState, useEffect } from "react";

import { formatDateString } from "../services/dateFunctions";

function PracticeDiary() {
  const token = localStorage.getItem("token");

  const [entries, setEntries] = useState([]);

  const [fetchStatus, setFetchStatus] = useState("checking");
  //checking / ready /error

  useEffect(() => {
    async function loadPractice() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/practice-entries`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        setEntries(res.data.entries);
        setFetchStatus("ready");
      } catch (error) {
        console.error(error);
        setFetchStatus("error");
      }
    }
    loadPractice();
  }, [token]);

  if (fetchStatus === "checking") {
    return (
      <main className="page-shell">
        <section className="page-card">
          <h1>Loading....</h1>
        </section>
      </main>
    );
  }

  if (fetchStatus === "error") {
    return (
      <main className="page-shell">
        <section className="page-card">
          <h1>Error fetching practice data</h1>
        </section>
      </main>
    );
  }

  return (
    <div className="entries-list">
      {entries.map((entry) => (
        <div key={entry.id} className="entry-card">
          <p className="entry-date">{formatDateString(entry.practice_date)}</p>

          <p className="entry-main">
            {entry.category} · {entry.duration_minutes} mins · {entry.name}
          </p>

          {entry.piece_title && (
            <p className="entry-sub">Piece: {entry.piece_title}</p>
          )}

          {entry.notes && <p className="entry-sub">Notes: {entry.notes}</p>}
        </div>
      ))}
    </div>
  );
}

export default PracticeDiary;
