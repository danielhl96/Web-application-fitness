import "./index.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./HeaderLogout.jsx";
import api from "./api.js";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handleEmailBlur = () => {
    setEmailTouched(true);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const checkEmail = (email) => {
    //email regex for validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  async function handleLogin() {
    try {
      const response = await api.get("/login", {
        params: {
          email,
          password,
        },
      });
      console.log(response[0]);

      navigate("/");
    } catch (error) {
      console.error(error);
      setMessage("Login failed. Please check your credentials.");
    }
  }

  useEffect(() => {
    setEmailError(!checkEmail(email));
  }, [email]);
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 ">
      <Header />
      <div className="card sm:w-96 md:w-96 w-96 bg-gray-800 border border-blue-500 shadow-sm p-6 rounded-md mt-8">
        <div className="flex flex-col space-y-2 ">
          <h1 className="text-2xl font-bold">Login</h1>
          <div className="divider divider-primary"></div>
          <div>
            <h1 className="text-shadow-lg font-mono">E-Mail</h1>
            <input
              type="text"
              placeholder={"E-Mail: "}
              className="input input-primary"
              onChange={(e) => handleEmailChange(e)}
              onBlur={handleEmailBlur}
                style={{
  border: "1px solid",
  borderColor: emailError && emailTouched ? "red" : "#3B82F6",
}}
            />

            {
emailError && emailTouched && (
              <span className="text-red-500 text-sm">
                Please enter a valid email address.
              </span>
            )}
          </div>
          <h1 className="text-shadow-lg font-mono">Password</h1>

          <div>
            <input
              type="password"
              placeholder={"Password: "}
              className="input input-primary"
              onChange={(e) => handlePasswordChange(e)}
            />
          </div>
          <h1 className="text-red-500 text-sm ">{message}</h1>
          <button
            onClick={() => handleLogin()}
            className="btn btn-outline btn-success w-80 "
          >
            Login
          </button>
          <div className="space-y-0 flex flex-col items-center">
            <button
              onClick={() => navigate("/register")}
              className="btn btn-link w-80 text-white"
            >
              Are you new here?
            </button>
            <button
              onClick={() => navigate("/passwordforget")}
              className="btn btn-link w-80 text-white"
            >
              Do you have forgot your password?
            </button>
            <div className="divider divider-primary"></div>
            <div className="flex flex-row space-x-0">
              <button
                onClick={() => navigate("/privacypolicy")}
                className="btn btn-link w-30 text-white"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => navigate("/impressum")}
                className="btn btn-link w-30 text-white"
              >
                Imprint
              </button>
            </div>
            <button
              onClick={() => navigate("/attribution")}
              className="btn btn-link w-30 text-white"
            >
              Attribution
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
