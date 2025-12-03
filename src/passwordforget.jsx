import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";
import Header from "./HeaderLogout.jsx";
import TemplatePage from "./templatepage.jsx";
function PasswordForget() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [message, setMessage] = useState("");
  const [requireCode, setRequireCode] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [successfully, setSuccessfully] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [emailinputtouch, setemailinputtouch] = useState(false);
  const [passwordinputtouch, setpasswordinputtouch] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState(false);

  const checkEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    setEmailError(!checkEmail(email));
    console.log(emailError);
    console.log(email);
    console.log(passwordError);
    console.log(passwordMatchError);
  }, [email]);

  useEffect(() => {
    setPasswordMatchError(() => {
      return password !== passwordRepeat;
    });
  }, [password, passwordRepeat]);

  useEffect(() => {
    setPasswordError(
      password.length < 8 ||
        !/[A-Z]/.test(password) ||
        !/[a-z]/.test(password) ||
        !/\d/.test(password) ||
        !/[!@#$%^&*]/.test(password)
    );
  }, [password]);

  const handleCode = () => {
    api
      .post("/password_forget", { email })
      .then(() => {
        setMessage("Check your email for the security code.");
        setRequireCode(true);
      })
      .catch(() => {
        setMessage("Error sending code. Please try again.");
      });
  };

  const checkCode = () => {
    api
      .post("/check_safety_code", {
        email: email,
        password: password,
        safety_code: securityCode,
      })
      .then(() => {
        setMessage("Password changed successfully.");

        setSuccessfully(false);
      })
      .catch((e) => {
        setMessage(e.response.data.message || "Error changing password.");
      });
  };

  const handlePasswordChange = () => {
    checkCode();
  };

  return (
    <div>
      <Header />
      <TemplatePage>
        <div className="items-start">
        <h1 className="text-2xl text-left font-bold">Password forget</h1>
        </div>
        <div>
          <h1 className="text-shadow-lg font-mono">E-Mail</h1>

          <input
            type="text"
            placeholder={"E-Mail: "}
            className="input input-primary"
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setemailinputtouch(true)}
          />
          {emailError && emailinputtouch && (
            <p className="text-red-500">Please enter a valid email address.</p>
          )}
        </div>
        <div>
          {requireCode && (
            <>
              <h1 className="text-shadow-lg font-mono">Security-Code</h1>
              <input
                type="text"
                placeholder={"Security-Code: "}
                className="input input-primary"
                onChange={(e) => setSecurityCode(e.target.value)}
                value={securityCode}
              />
            </>
          )}
        </div>
        <div>
          {requireCode && (
            <>
              <h1 className="text-shadow-lg font-mono">New password</h1>

              <input
                type="password"
                placeholder={"New password: "}
                className="input input-primary"
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setpasswordinputtouch(true)}
              />
              {passwordError && passwordinputtouch && (
                <p className="text-red-500 text-sm">
                  Password must be at least 8 characters long and include
                  uppercase letters, lowercase letters, numbers, and special
                  characters.
                </p>
              )}
              <h1>Repeat your password</h1>
              <input
                type="password"
                placeholder={"Repeat password: "}
                className="input input-primary"
                onChange={(e) => setPasswordRepeat(e.target.value)}
              />
              {passwordMatchError && passwordinputtouch && (
                <p className="text-red-500 text-sm">Passwords do not match.</p>
              )}
            </>
          )}
        </div>
        <div className="flex space-x-2 items-center justify-start">
          <button
            disabled={
              emailError ||
              (requireCode &&
                (securityCode.length === 0 ||
                  passwordError ||
                  passwordMatchError))
            }
            onClick={
              !requireCode ? () => handleCode() : () => handlePasswordChange()
            }
            className="btn btn-outline btn-success"
          >
            {requireCode ? "Change password" : "Require code"}
          </button>

          <button
            onClick={() => navigate("/login")}
            className="btn btn-outline btn-error"
          >
            {successfully ? "Go to Login" : "Cancel"}
          </button>
        </div>
        {message && <h1 className="text-green-500">{message}</h1>}
      
      </TemplatePage>
    </div>
  );
}
export default PasswordForget;
