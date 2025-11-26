import "./index.css";
import { useNavigate } from "react-router-dom";
function Impressum() {
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900  ">
      <Header />
      <div className="overflow-auto">
        <div className="space-y-6 card sm:w-96 md:w-96 w-90 bg-gray-800 border mt-8 border-blue-500 shadow-sm p-6 rounded-md">
          <h2 className="text-2xl font-bold text-white mb-4">Imprint</h2>
          <p>
            Angaben gemäß § 5 TMG
            <br />
            Daniel Hennies
            <br />
            Ithweg 4<br />
            30851 Langenhagen
            <br />
            Deutschland
          </p>
          <p>
            Kontakt:
            <br />
            E-Mail: admin@web-fitness-app.de
          </p>
          <p>
            Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:
            <br />
            Daniel Hennies
            <br />
            Ithweg 4<br />
            30851 Langenhagen
          </p>
          <p>
            Plattform der EU-Kommission zur Online-Streitbeilegung:{" "}
            <a
              href="https://ec.europa.eu/consumers/odr/"
              className="text-blue-400 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://ec.europa.eu/consumers/odr/
            </a>
          </p>
          <p>
            Quelle:{" "}
            <a
              href="https://www.e-recht24.de"
              className="text-blue-400 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://www.e-recht24.de
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Impressum;
