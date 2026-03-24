import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { fetchUserInstruments } from "../services/instrumentFunctions";
import { handleAuthError } from "../utils/handleAuthError";

function AddInstrument() {
  const navigate = useNavigate();

  const [instruments, setInstruments] = useState([]); // list of all available instruments

  const [selectedInstrument, setSelectedInstrument] = useState(null); // the instrument the user is adding

  const token = localStorage.getItem("token");

  const [modalOpen, setModalOpen] = useState(false);

  const [alreadyPlayed, setAlreadyPlayed] = useState([]);

  const [fetchStatus, setFetchStatus] = useState("checking");
  // checking / ready / error

  async function handleSubmit(e) {
    e.preventDefault();

    console.log("selected instrument", selectedInstrument);
    console.log("token", token);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/addInstrument`,
        { instrument_id: selectedInstrument },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      console.log("instrument added!");
      setModalOpen(true);
    } catch (error) {
      if (handleAuthError(error, navigate)) return;
      console.error(error.response?.data);
    }
  }

  function handleChange(e) {
    setSelectedInstrument(Number(e.target.value));
    console.log(e.target.value);
  }

  async function fetchInstruments() {
    try {
      const allInstruments = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/instruments`,
      );

      const userInstrumentData = await fetchUserInstruments(token);

      console.log("already played", userInstrumentData.userInstruments);

      setAlreadyPlayed(userInstrumentData.userInstruments);

      const alreadyPlayedIds = userInstrumentData.userInstruments.map(
        (instrument) => instrument.instrument_id,
      );

      const instrumentsToDisplay = allInstruments.data.filter(
        (instrument) => !alreadyPlayedIds.includes(instrument.id),
      );

      setInstruments(instrumentsToDisplay); // set full instrument list

      if (instrumentsToDisplay.length > 0) {
        setSelectedInstrument(instrumentsToDisplay[0].id); // set selectedInstrument to be the first of this list
      }

      setFetchStatus("ready");
    } catch (error) {
      if (handleAuthError(error, navigate)) return;
      console.log(error);
      setFetchStatus("error");
    }
  }

  useEffect(() => {
    fetchInstruments();
  }, [navigate, token]);

  function addAnotherInstrument() {
    setFetchStatus("checking");
    fetchInstruments();
    setModalOpen(false);
  }

  function addAPracticeSession() {
    navigate("/addEntry");
    setModalOpen(false);
  }

  function returnToDashboard() {
    navigate("/dashboard");
    setModalOpen(false);
  }

  if (fetchStatus === "checking") {
    return (
      <main className="page-shell">
        <section className="page-card">
          <h2>Loading...</h2>
        </section>
      </main>
    );
  }

  if (fetchStatus === "error") {
    return (
      <main className="page-shell">
        <section className="page-card">
          <h2>Something went wrong. Please try again</h2>
        </section>
      </main>
    );
  }

  if (instruments.length === 0) {
    return (
      <main className="page-shell">
        <section className="page-card">
          <div>
            <h2>You have no more instruments to add!</h2>
            <button onClick={() => navigate("/dashboard")}>
              Return to dashboard
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="page-card">
        <div>
          <h1>Add an Instrument</h1>
          {alreadyPlayed.length > 0 && (
            <>
              <p>You are already registered to play....</p>
              <ul>
                {alreadyPlayed.map((instrument) => (
                  <li key={instrument.id}>{instrument.name}</li>
                ))}
              </ul>
            </>
          )}

          <form onSubmit={handleSubmit}>
            <div>
              <label>Add an instrument to your list</label>
              <select
                onChange={handleChange}
                name="instrument"
                value={selectedInstrument || ""} // shows as empty string when component first loads
              >
                {instruments.map((instrument) => (
                  <option key={instrument.id} value={instrument.id}>
                    {instrument.name}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit">Add Instrument</button>
          </form>
          <Modal
            isOpen={modalOpen}
            onRequestClose={() => setModalOpen(false)}
            contentLabel="Instrument added"
          >
            <h2>Instrument successfully added</h2>
            <p>What would you like to do next?</p>

            <button onClick={addAnotherInstrument}>
              Add another instrument
            </button>
            <button onClick={returnToDashboard}>Return to Dashboard</button>
            <button onClick={addAPracticeSession}>
              Add a practice session
            </button>
          </Modal>
        </div>
      </section>
    </main>
  );
}

export default AddInstrument;
