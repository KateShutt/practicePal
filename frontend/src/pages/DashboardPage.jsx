import { useEffect, useState } from "react";
import axios from "axios";
import {
  fetchUserInstruments,
  userHasInstruments,
} from "../services/instrumentFunctions";
import { useNavigate } from "react-router-dom";
import StatsFlipCard from "../components/StatsFlipCard";
import { Container, Row, Col } from "react-bootstrap";

function DashboardPage() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);

  const [entries, setEntries] = useState([]);

  const [weeklyTotal, setWeeklyTotal] = useState(0);

  const [dailyTotal, setDailyTotal] = useState([]);

  const [weeklyPerInstrument, setWeeklyPerInstrument] = useState([]);

  const token = localStorage.getItem("token");

  const [hasInstrument, setHasInstrument] = useState(false);

  const [loading, setLoading] = useState(true);

  const [hasPracticedThisWeek, setHasPracticedThisWeek] = useState(false);

  const [hasLoggedPracticeSessions, setHasLoggedPracticeSessions] =
    useState(false);

  const [userInstruments, setUserInstruments] = useState([]);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const result = await userHasInstruments(token);
        setHasInstrument(result);
        if (result) {
          const profileRes = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/users/profile`,
            { headers: { Authorization: `Bearer ${token}` } },
          );

          const entriesRes = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/practice-entries`,
            { headers: { Authorization: `Bearer ${token}` } },
          );

          const weeklyTotalRes = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/practice-entries/summary/week`,
            { headers: { Authorization: `Bearer ${token}` } },
          );

          const dailyTotalRes = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/practice-entries/summary/daily`,
            { headers: { Authorization: `Bearer ${token}` } },
          );

          const weeklyPerInstrumentRes = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/practice-entries/summary/perInstrument`,
            { headers: { Authorization: `Bearer ${token}` } },
          );

          setProfile(profileRes.data);

          if (entriesRes.data.entries.length > 0) {
            setEntries(entriesRes.data.entries);
            setHasLoggedPracticeSessions(true);
          }

          if (weeklyTotalRes.data.weeklyTotal > 0) {
            setWeeklyTotal(weeklyTotalRes.data.weeklyTotal);
            setHasPracticedThisWeek(true);
          }

          if (dailyTotalRes.data.dailySummary.length > 0) {
            setDailyTotal(dailyTotalRes.data.dailySummary);
            setHasPracticedThisWeek(true);
          }

          if (weeklyPerInstrumentRes.data.perInstrumentTotal.length > 0) {
            setWeeklyPerInstrument(
              weeklyPerInstrumentRes.data.perInstrumentTotal,
            );
            setHasPracticedThisWeek(true);
          }

          const instrumentRes = await fetchUserInstruments(token);

          const instrumentArray = instrumentRes.userInstruments;

          setUserInstruments(instrumentArray);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [token]);

  function formatMinutes(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours === 0) return `${minutes} min`;
    if (minutes === 0) return `${hours} hr`;

    return `${hours}h ${minutes}m`;
  }

  if (loading) {
    return (
      <main className="page-shell">
        <section className="page-card">
          <h2>Loading...</h2>
        </section>
      </main>
    );
  }

  if (!hasInstrument) {
    return (
      <main className="page-shell">
        <section className="page-card">
          <h2>Welcome to PracticePal. Please enter an instrument to proceed</h2>
          <button onClick={() => navigate("/addInstrument")}>
            Add an instrument
          </button>
        </section>
      </main>
    );
  }

  if (!hasLoggedPracticeSessions) {
    return (
      <main className="page-shell">
        <section className="page-card">
          {profile && <h2>Welcome {profile.username}.</h2>}

          <p>You have told us that you play...</p>
          <ul>
            {userInstruments.map((instrument) => (
              <li key={instrument.instrument_id}>{instrument.name}</li>
            ))}
          </ul>
          <p>To see dashboard stats you must add a practice entry</p>

          <button onClick={() => navigate("/addEntry")}>
            Add practice entry
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="dashboard-card">
        <h1>Dashboard</h1>

        {profile && <p>Welcome {profile.username}</p>}

        <Container className="my-4">
          <Row className="g-4">
            <Col xs={12} md={6}>
              <StatsFlipCard
                frontTitle="Top instrument this week"
                backTitle="Most practiced"
                backContent={
                  weeklyPerInstrument.length > 0 ? (
                    <>
                      <h2>{weeklyPerInstrument[0].name}</h2>
                      <p>
                        {formatMinutes(
                          weeklyPerInstrument[0].instrument_weekly_total,
                        )}{" "}
                        total practice 👏
                      </p>
                    </>
                  ) : (
                    "You have not practiced this week 😢"
                  )
                }
              ></StatsFlipCard>
            </Col>

            <Col xs={12} md={6}>
              <StatsFlipCard
                frontTitle="Weekly total"
                backTitle="Weekly total"
                backContent={
                  <h2>
                    {hasPracticedThisWeek
                      ? formatMinutes(weeklyTotal)
                      : "You have not practiced this week 😢"}
                  </h2>
                }
              ></StatsFlipCard>
            </Col>

            <Col xs={12} md={6}>
              <StatsFlipCard
                frontTitle="Practice per day this week"
                backTitle="Last 7 days"
                backContent={
                  hasPracticedThisWeek ? (
                    <ul className="list-unstyled">
                      {dailyTotal.map((day) => (
                        <li key={day.practice_date}>
                          {day.practice_date.split("T")[0]} -{" "}
                          {formatMinutes(day.daily_total)}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "You have not practiced this week 😢"
                  )
                }
              ></StatsFlipCard>
            </Col>

            <Col xs={12} md={6}>
              <StatsFlipCard
                frontTitle="Practice by instrument this week"
                backTitle="Practice by instrument"
                backContent={
                  hasPracticedThisWeek ? (
                    <ul className="list-unstyled">
                      {weeklyPerInstrument.map((instrument) => (
                        <li key={instrument.name}>
                          {instrument.name}{" "}
                          {formatMinutes(instrument.instrument_weekly_total)}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "You have not practiced this week 😢"
                  )
                }
              ></StatsFlipCard>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
}

export default DashboardPage;
