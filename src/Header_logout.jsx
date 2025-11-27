import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="navbar fixed top-0 left-0 w-full bg-black text-white z-50">
        <div className="flex w-full justify-between items-center px-4">
          <button
            onClick={() => navigate("/login")}
            className="btn btn-ghost text-white"
          >
            Fitness
          </button>
        </div>
      </div>
    </div>
  );
}
export default Header;
