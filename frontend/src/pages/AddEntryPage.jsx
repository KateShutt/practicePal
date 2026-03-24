import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";

import { handleAuthError } from "../utils/handleAuthError";

function AddEntryPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    practice_date: "",
    duration_minutes: "",
    category: "Scales",
    instrument_id: "",
    piece_title: "",
    notes: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const [modalOpen, setModalOpen] = useState(false);

  const [userInstruments, setUserInstruments] = useState([]);

  const token = localStorage.getItem("token");

  async function handleSubmit(e) {
    e.preventDefault();

    if (formData.piece_title.length > 50) {
      console.log("piece title cannot be longer than 50 characters");
      setErrorMessage("piece title cannot be longer than 50 characters");
      return;
    }
    console.log(formData);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/practice-entries`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setModalOpen(true);
    } catch (error) {
      if (handleAuthError(error, navigate)) return; // if user is not authenticated redirect to login
      console.error(error);
      setErrorMessage(
        error.response?.data?.error || "Something went wrong, please try again",
      );
    }
  }

  function addAnotherSession() {
    setFormData({
      practice_date: "",
      duration_minutes: "",
      category: "Scales",
      instrument_id:
        userInstruments.length > 0 ? userInstruments[0].instrument_id : "",
      piece_title: "",
      notes: "",
    });
    setErrorMessage("");
    setModalOpen(false);
  }

  function backToDashboard() {
    navigate("/dashboard");
  }

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === "duration_minutes") {
      const numberValue = Number(value);
      if (numberValue <= 0) {
        setErrorMessage("practice duration must be higher than zero");
        return;
      } else if (!Number.isInteger(numberValue)) {
        setErrorMessage("practice duration must be a whole number");
        return;
      }
    }

    setErrorMessage("");

    setFormData({
      ...formData,
      [name]:
        name === "duration_minutes" || name === "instrument_id"
          ? Number(value)
          : value,
    });
  }

  useEffect(() => {
    async function getInstruments() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/userInstruments`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (response.data.userInstruments.length > 0) {
          setUserInstruments(response.data.userInstruments);

          setFormData((prev) => ({
            ...prev,
            instrument_id: response.data.userInstruments[0].instrument_id,
          }));
        }

        console.log("response data", response.data?.userInstruments);
      } catch (error) {
        if (handleAuthError(error, navigate)) return; // if user is not authenticated redirect to login

        setErrorMessage(
          error.response?.data?.error ||
            "Something went wrong, please try again",
        );
      }
    }
    getInstruments();
  }, [navigate, token]);

  return (
    <main className="page-shell">
      <section className="page-card">
        <div>
          <h1>Record a practice session</h1>
          <p>
            <span style={{ color: "red" }}>*</span>shows required field
          </p>
          <form onSubmit={handleSubmit}>
            <div>
              <label className="required">Practice date</label>
              <input
                name="practice_date"
                type="date"
                placeholder="YYYY-MM-DD"
                value={formData.practice_date}
                onChange={handleChange}
                required
              ></input>
            </div>

            <div>
              <label className="required">Practice duration in minutes</label>

              <input
                name="duration_minutes"
                type="number"
                min="1"
                step="1"
                placeholder="enter practice duration"
                value={formData.duration_minutes}
                onChange={handleChange}
                required
              ></input>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {/* makes text appear next to select */}
              <label className="required">Practice type</label>

              <select
                onChange={handleChange}
                name="category"
                value={formData.category}
                // react select requires a value. Set default in state
              >
                <option value="Scales">Scales</option>
                <option value="Technique">Technique</option>
                <option value="Sight Reading">Sight Reading</option>
                <option value="Repertoire">Repertoire</option>

                <option value="Improvisation">Improvisation</option>
              </select>
            </div>

            <div>
              <label>Instrument</label>

              <select
                onChange={handleChange}
                name="instrument_id"
                value={formData.instrument_id || ""}
              >
                {userInstruments.map((instrument) => (
                  <option
                    key={instrument.instrument_id}
                    value={instrument.instrument_id}
                  >
                    {instrument.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Piece title</label>

              <input
                name="piece_title"
                type="text"
                value={formData.piece_title}
                onChange={handleChange}
                placeholder="enter the name of the piece"
              ></input>
            </div>

            <div>
              <label>More info</label>

              <input
                name="notes"
                type="text"
                value={formData.notes}
                onChange={handleChange}
                placeholder="worked on bars 1 -50"
              ></input>
            </div>

            <button type="submit">Record practice session!</button>
          </form>

          {errorMessage && <p>{errorMessage}</p>}

          <Modal
            isOpen={modalOpen}
            onRequestClose={() => setModalOpen(false)}
            contentLabel="Practice session added"
          >
            <h2>Practice session logged successfully</h2>
            <p>What would you like to do next?</p>

            <button onClick={addAnotherSession}>Add another session</button>
            <button onClick={backToDashboard}>Back to Dashboard</button>
          </Modal>
        </div>
      </section>
    </main>
  );
}

export default AddEntryPage;
