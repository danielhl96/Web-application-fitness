import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  function Header() {
    return (
      <div>
        <div className="navbar fixed top-0 left-0 w-full bg-black text-white z-50">
          <div className="flex w-full justify-between items-center px-4">
            <button className="btn btn-ghost text-white">Fitness</button>
          </div>
        </div>
      </div>
    );
  }

  const handleRegister = () => {
    axios
      .post("http://localhost:5000/api/register", {
        email,
        password,
      })
      .then(() => navigate("/login"))
      .catch((err) => console.log(err));
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handleEmailBlur = () => {
    setEmailTouched(true);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const handlePasswordBlur = () => {
    setPasswordTouched(true);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };
  const handleConfirmPasswordBlur = () => {
    setConfirmPasswordTouched(true);
  };

  const checkEmail = (email) => {
    // Simple email regex for validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    setEmailError(!checkEmail(email));
  }, [email]);

  useEffect(() => {
    setPasswordError(
      password.length < 8 ||
        !/[A-Z]/.test(password) ||
        !/[a-z]/.test(password) ||
        !/\d/.test(password) ||
        !/[!@#$%^&*]/.test(password)
    );
  }, [password]);

  useEffect(() => {
    setConfirmPasswordError(confirmPassword !== password);
  }, [confirmPassword, password]);

  return (
    <div>
      <div className="min-h-screen flex items-center bg-gray-900 justify-center">
        <Header />
        <div className="space-y-4 card sm:w-96 md:w-96 bg-gray-800 shadow-sm p-6 rounded-md">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">Register</h1>
            <div className="divider divider-primary">Your data</div>
            <div>
              <h1 className="text-shadow-lg font-mono">E-Mail</h1>

              <input
                type="text"
                placeholder={"E-Mail: "}
                className="input input-primary"
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                style={{
                  border:
                    emailError && emailTouched
                      ? "1px solid red"
                      : "1px solid green",
                }}
              />

              {emailError && emailTouched && (
                <span className="text-red-500 text-sm">
                  Please enter a valid email address.
                </span>
              )}
            </div>
            <div>
              <h1 className="text-shadow-lg font-mono">Password</h1>
              <input
                type="password"
                placeholder={"Password: "}
                className="input input-primary"
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                style={{
                  border:
                    passwordError && passwordTouched
                      ? "1px solid red"
                      : "1px solid green",
                }}
              />
              {passwordError && passwordTouched && (
                <span className="text-red-500 text-sm">
                  Password must be at least 8 characters long include uppercase,
                  lowercase, number, and special character.
                </span>
              )}
            </div>
            <div>
              <h1 className="text-shadow-lg font-mono">Repat password</h1>
              <input
                type="password"
                placeholder={"Repeat your password: "}
                className="input input-primary"
                onChange={handleConfirmPasswordChange}
                onBlur={handleConfirmPasswordBlur}
                id={"password repeat"}
                style={{
                  border:
                    confirmPasswordError && confirmPasswordTouched
                      ? "1px solid red"
                      : "1px solid green",
                }}
              />
              {confirmPasswordError && confirmPasswordTouched && (
                <span className="text-red-500 text-sm">
                  Passwords do not match.
                </span>
              )}
            </div>
            <div className="divider divider-primary"></div>
            <div className="flex flex-row space-x-2 items-center justify-center">
              <button
                onClick={() => handleRegister()}
                disabled={emailError || passwordError || confirmPasswordError}
                className="btn btn-outline btn-success w-15 space-y-5"
              >
                Register
              </button>
              <button
                onClick={() => navigate("/login")}
                className="btn btn-outline btn-warning w-15"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default RegisterPage;
