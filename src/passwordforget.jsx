
import { useState } from 'react';


function PasswordForget() {
  const [email, setEmail] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [message, setMessage] = useState('');
  const [requireCode, setRequireCode] = useState(false);
 const [password, setPassword] = useState(false);
  const handleCode = () => {
   setRequireCode(true)
  };
  const handlePasswordChange = () => {
    setPassword(true)
    
  }

  return (
    <div className="min-h-screen flex items-center bg-gray-900 justify-center">
      <div className="space-y-4 card sm:w-64 md:w-96 bg-gray-800 shadow-sm p-6 rounded-md">
        <h1 className="text-2xl font-bold">Forgot Password</h1>
          <div>
            <h1>E-Mail</h1>
            
            <input
              type="text"
              placeholder={"E-Mail: "}
              className="input input-primary"
            />
          
          </div>
          <div>
            {requireCode && (
              <>
                <h1>Security-Code</h1>
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
            {password && (
                <>
            <h1>New password</h1>
            <label className="input validator">
  <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <g
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeWidth="2.5"
      fill="none"
      stroke="currentColor"
    >
      <path
        d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
      ></path>
      <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
    </g>
  </svg>
            <input
              type="text"
              placeholder={"New password: "}
              className="input input-primary"
              onChange={(e) => setEmail(e.target.value)}
            />
            </label>
            </>
            )}
          </div>
          <button
            onClick={requireCode && !password ? handleCode : handlePasswordChange}
            className="btn btn-outline btn-success"
          >
            {requireCode && !password ? 'Send code' : 'Require code'}
           
          </button>
      </div>
    </div>
  );
}
export default PasswordForget;