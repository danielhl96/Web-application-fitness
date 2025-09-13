import {useState, useEffect } from 'react'

function RegisterPage()  {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);


  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
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

   return(
    <div>
     <div className='min-h-screen flex items-center justify-center'>
      <div className="space-y-4 card sm:w-64 md:w-96 bg-gray-700 shadow-sm p-6 rounded-md">
      <div className='flex flex-col gap-2'>
        <h1 className='text-2xl font-bold'>Register</h1>
        <div><h1>E-Mail</h1>
       <input
                type="text"
                placeholder={"E-Mail: "}
                className="input input-primary "
                onChange={(e) => handleEmailChange(e)}
                style={{ border: emailError ? '1px solid red' : '1px solid green' }}
              />
              {
                emailError && <span className="text-red-500 text-sm">Please enter a valid email address.</span>
              }
              </div>
              <div><h1>Password</h1>
                <input
                type="password"
                placeholder={"Password: "}
                className="input input-primary"
                onChange={(e) => handlePasswordChange(e)}
                style={{ border: passwordError ? '1px solid red' : '1px solid green' }}
              />
              {
                passwordError && <span className="text-red-500 text-sm">Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.</span>
              }
              </div>
              <div style={{ marginBottom: '1rem' }}><h1>Confirm Password</h1>
               <input 
                type="password"
                placeholder={"Repear your password: "}
                className="input input-primary"
                onChange={(e) => handleConfirmPasswordChange(e)}
                id={"password repeat"}
                style={{ border: confirmPasswordError ? '1px solid red' : '1px solid green' }}
              />
              {confirmPasswordError && <span className="text-red-500 text-sm">Passwords do not match.</span>}
              </div>
              <div className="flex flex-row space-x-2">
              <button disabled={emailError || passwordError || confirmPasswordError} className="btn btn-outline btn-success w-15 space-y-5">Register</button>
              <button className="btn btn-outline btn-warning w-15">Back</button>
              </div>
              </div>
              </div>
     </div>
    </div>
  );
}
export default RegisterPage