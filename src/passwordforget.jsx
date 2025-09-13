
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
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-4 card sm:w-64 md:w-96 bg-gray-700 shadow-sm p-6 rounded-md">
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
            <input
              type="text"
              placeholder={"New password: "}
              className="input input-primary"
              onChange={(e) => setEmail(e.target.value)}
            />
            </>
            )}
          </div>
          <button
            onClick={requireCode && !password ? handleCode : handlePasswordChange}
            className="btn btn-outline btn-success"
          >
            {requireCode && !password ? 'Send code' : 'Require code'}
            {requireCode && password ? 'Send password' : 'Require code'}
          </button>
      </div>
    </div>
  );
}
export default PasswordForget;