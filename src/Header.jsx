
function Header() {
  return (
    <div>
      <div className="navbar fixed top-0 left-0 w-full bg-black text-white z-50">
        <div className="flex w-full justify-between items-center px-4">
          <button className="btn btn-ghost text-white">Profil</button>
          <button className="btn btn-ghost text-white">Gruppe</button>
          <div className="ml-auto">
            <button className="btn btn-ghost text-white">Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;