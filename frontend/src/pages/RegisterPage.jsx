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

  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage("");
  }

  function togglePassword() {
    setPasswordVisibility(!passwordVisibility);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (formData.password.length < 10) {
      console.log("password must be at least 10 characters long");
      setErrorMessage("password must be at least 10 characters long");
      return;
    }

    if (!/[A-Z]/.test(formData.password)) {
      console.log("password must contain at least one upper case letter");
      setErrorMessage("password must contain at least one upper case letter");
      return;
    }

    if (!/[0-9]/.test(formData.password)) {
      console.log("password must contain at least one number");
      setErrorMessage("password must contain at least one number");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      console.log("passwords do not match");
      setErrorMessage("passwords do not match");
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
    <main className="page-shell">
      <section className="page-card">
        <div>
          <h1>Register</h1>
          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-field">
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

            <div className="form-field">
              <label>Password</label>
              <input
                name="password"
                type={passwordVisibility ? "text" : "password"}
                placeholder="Enter a password"
                value={formData.password}
                onChange={handleChange}
                required
              ></input>

              <button
                type="button"
                onClick={togglePassword}
                className="password-toggle"
              >
                {passwordVisibility ? "Hide password" : "Show password"}
              </button>

              {formData.password && (
                <ul className="password-rules no-bullets">
                  <li
                    className={
                      formData.password.length >= 10 ? "valid" : "invalid"
                    }
                  >
                    At least 10 characters
                  </li>
                  <li
                    className={
                      /[A-Z]/.test(formData.password) ? "valid" : "invalid"
                    }
                  >
                    One uppercase letter
                  </li>
                  <li
                    className={
                      /[0-9]/.test(formData.password) ? "valid" : "invalid"
                    }
                  >
                    One number
                  </li>
                </ul>
              )}
            </div>

            <div className="form-field">
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

            <button type="submit" className="primary-button">
              Register
            </button>
          </form>
        </div>

        {errorMessage && <p className="form-error">{errorMessage}</p>}
      </section>
    </main>
  );
}

export default RegisterPage;
