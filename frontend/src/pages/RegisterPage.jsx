import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordVisibility, setPasswordVisibility] = useState(false);

  const navigate = useNavigate();

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function togglePassword() {
    setPasswordVisibility(!passwordVisibility);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (formData.password.length < 10) {
      console.log("password must be at least 10 characters long");
      return;
    }

    if (!/[A-Z]/.test(formData.password)) {
      console.log("password must contain at least one upper case letter");
      return;
    }

    if (!/[0-9]/.test(formData.password)) {
      console.log("password must contain at least one number");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      console.log("passwords do not match");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        formData,
      );

      console.log("form submitted!");
      console.log(formData);

      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            name="username"
            type="text"
            placeholder="Enter a username"
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
            placeholder="Enter a password"
            value={formData.password}
            onChange={handleChange}
            required
          ></input>

          <button type="button" onClick={togglePassword}>
            {passwordVisibility ? "Hide password" : "Show password"}
          </button>

          <p>Password must contain:</p>
          <ul>
            <li>At least 10 characters</li>
            <li>One uppercase letter</li>
            <li>One number</li>
          </ul>
        </div>

        <div>
          <label>Confirm password</label>
          <input
            name="confirmPassword"
            type={passwordVisibility ? "text" : "password"}
            placeholder="re-enter password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          ></input>
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterPage;
