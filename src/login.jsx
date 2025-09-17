import './index.css'; 
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

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
    // Simple email regex for validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

   useEffect(() => {
      setEmailError(!checkEmail(email));
    }, [email]);
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 py-16">
          <div className="space-y-4 card sm:w-96 md:w-96 bg-gray-800 shadow-sm p-6 rounded-md">
        <div className="flex flex-col gap-4 p-4 w-full sm:w-96 lg:w-96">
        <h1 className="text-3xl font-semibold text-white text-left mb-6">
      Login
    </h1>

     <div><h1 className='text-shadow-lg font-mono'>E-Mail</h1>
            <input
              type="text"
              placeholder={"E-Mail: "}
              className="input input-primary"
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              style={{ border: emailError && emailTouched ? '1px solid red' : '1px solid green' }}
            />
         
          {
            emailError && emailTouched && <span className="text-red-500 text-sm">Please enter a valid email address.</span>
          }
        </div>

        <div><h1 className='text-shadow-lg font-mono'>Password</h1>
                <input
                type="password"
                placeholder={"Password: "}
                className="input input-primary"
                onChange={handlePasswordChange}
                
              />
              </div>


    <button onClick={() => navigate('/register')} className="btn btn-link w-80 text-white">Are you new here?</button>

<button className="btn btn-active btn-primary w-80 ">Login</button>
<button onClick={() => navigate('/passwordforget')} className="btn btn-link w-80 text-white">Do you have forgot your password?</button>
        </div>
        </div>
        </div>
    );
}

function GUI(){
    return (
        <div>
            <Header/>
        <LoginForm />
      </div>
      );
    }

export default GUI