import './index.css'; 

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
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 py-16">
        <div className="flex flex-col gap-4 p-4 w-full sm:w-96 lg:w-96">
        <h1 className="text-3xl font-semibold text-white text-center mb-6">
      Welcome back :D
    </h1>
    <h1 className="mr-0">Email</h1>
            <label className="input validator">
                
  <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <g
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeWidth="2.5"
      fill="none"
      stroke="currentColor"
    >
      <rect width="20" height="16" x="2" y="4" rx="2"></rect>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
    </g>
  </svg>
  <input type="email" placeholder="mail@site.com" required />
</label>
<div className="validator-hint hidden">Enter valid email address</div>
<h1 className="mr-0">Password</h1>
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
    type="password"
    required
    placeholder="Password"
    minlength="8"
    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
    title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
  />
</label>
<p className="validator-hint hidden">
  Must be more than 8 characters, including
  <br />At least one number <br />At least one lowercase letter <br />At least one uppercase letter
</p>


    <button className="btn btn-link w-80 text-white">Are you new here?</button>


<button className="btn btn-active btn-primary w-80 ">Login</button>
<button className="btn btn-link w-80 text-white">Do you have forgot your password?</button>
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