import "./index.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "./api";

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
      <div className="space-y-4 card sm:w-96 md:w-96 w-96 bg-gray-800 border border-blue-500 shadow-sm p-6 rounded-md">
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
          <button
            onClick={() => navigate("/privacypolicy")}
            className="btn btn-link w-80 text-white"
          >
            Privacy Policy
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
