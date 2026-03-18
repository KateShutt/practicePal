import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: "", password: "" });

  const [passwordVisibility, setPasswordVisibility] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        formData,
      );

      const data = response.data;

      console.log("login response", data);

      localStorage.setItem("token", data.token);

      console.log("navigating now");

      navigate("/dashboard");
    } catch (error) {
      console.error(error.response?.data || error);
      setErrorMessage(error.response?.data?.error || "login failed");
    }
  }

  function togglePassword() {
    setPasswordVisibility(!passwordVisibility);
  }

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage("");
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            name="username"
            type="text"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            required
          ></input>
        </div>

        <div>
          <label>Password</label>
          <input
            name="password"
            type={passwordVisibility ? "text" : "password"}
            placeholder="Enter your password"
            onChange={handleChange}
            value={formData.password}
            required
          ></input>

          <button type="button" onClick={togglePassword}>
            {/* need type = button so that it does not default to submit */}
            {passwordVisibility ? "Hide password" : "Show password"}
          </button>
        </div>

        <button type="submit">Login</button>
      </form>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
}

export default LoginPage;
