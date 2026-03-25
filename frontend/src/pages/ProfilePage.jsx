import axios from "axios";
import { useState, useEffect } from "react";

function ProfilePage() {
  const [userInstruments, setUserInstruments] = useState([]);

  const [profile, setProfile] = useState(null);

  const [registerDate, setRegisterDate] = useState("");

  const token = localStorage.getItem("token");

  const [fetchStatus, setFetchStatus] = useState("checking");

  //checking / ready / error

  function formatDateString(dateString) {
    const [year, month, day] = dateString.split("T")[0].split("-");
    return `${day}-${month}-${year}`;
  }

  useEffect(() => {
    async function loadDashboard() {
      try {
        const profileRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users/profile`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        setProfile(profileRes.data.username);

        const instruments = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/userInstruments`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        setUserInstruments(instruments.data.userInstruments);

        const created = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users/profile/createdOn`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        setRegisterDate(created.data.created_at);
        setFetchStatus("ready");
      } catch (error) {
        console.error(error);
        setFetchStatus("error");
      }
    }
    loadDashboard();
  }, [token]);

  if (fetchStatus === "checking") {
    return (
      <main className="page-shell">
        <section className="page-card">
          <p>Loading profile...</p>
        </section>
      </main>
    );
  }

  if (fetchStatus === "error") {
    return (
      <main className="page-shell">
        <section className="page-card">
          <p>Could not load profile</p>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="page-card">
        <h1>Profile</h1>
        <p className="profile-name">Welcome {profile} 👋</p>

        <p className="profile-date">
          Account created {formatDateString(registerDate)}
        </p>

        <p>You play:</p>
        <ul className="no-bullets instrument-list">
          {userInstruments.map((instrument) => (
            <li key={instrument.instrument_id} className="instrument-pill">
              {instrument.name}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default ProfilePage;
