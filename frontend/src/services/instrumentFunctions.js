import axios from "axios";

export async function fetchUserInstruments(token) {
  const response = await axios.get(
    "http://localhost:5000/api/userInstruments",
    { headers: { Authorization: `Bearer ${token}` } },
  );

  return response.data;
}

export async function userHasInstruments(token) {
  const data = await fetchUserInstruments(token);
  return data.userInstruments.length > 0;
}
