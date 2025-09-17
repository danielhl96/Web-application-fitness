
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PasswordForget() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [message, setMessage] = useState('');
  const [requireCode, setRequireCode] = useState(false);
 const [password, setPassword] = useState(false);

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


  const handleCode = () => {
   setRequireCode(true)
  };
  const handlePasswordChange = () => {
    setPassword(true)
    
  }

  return (
    <div className="min-h-screen flex items-center bg-gray-900 justify-center">
      <Header/>
      <div className="space-y-4 flex flex-col card sm:w-64 md:w-96 bg-gray-800 shadow-sm p-6 rounded-md">
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
              onChange={(e) => setPassword(e.target.value)}
            />
            <h1>Repeat your password</h1>
              <input
              type="text"
              placeholder={"Repeat password: "}
              className="input input-primary"
              onChange={(e) => setPassword(e.target.value)}
            />
           
            </>
            )}
          </div>
          <div className="flex space-x-2 items-center justify-start">
          <button
            onClick={!requireCode && !password ? () => handleCode() : () => handlePasswordChange()}
            className="btn btn-outline btn-success"
          >
            {requireCode && !password ? 'Send code' : requireCode && password ? 'Change password' : 'Require code'}
          </button>
          <button onClick={() => navigate('/login')} className="btn btn-outline btn-error">Cancel</button>
      </div>
    </div>
    </div>
  );
}
export default PasswordForget;