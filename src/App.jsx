
import './index.css'; 

import GUI from './login';


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

function Cards() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 py-16">
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
     {/* Erste Karte */}
  <div className="card w-full sm:w-96 lg:w-96 bg-base-100 shadow-sm">
      <div className="card-body">
        <h2 className="card-title text-white">Training erstellen</h2>
        <p className="text-white">Erstelle dein Training mit den Übungen deiner Wahl!</p>
        <div className="justify-end card-actions">
          <button className="btn btn-primary text-white">Erstellen</button>
        </div>
      </div>
    </div>
     {/* Zweite Karte */}
    <div className="card w-full sm:w-96 lg:w-96 bg-base-100 shadow-sm">
      <div className="card-body">
        <h2 className="card-title text-white">Training starten</h2>
        <p className="text-white">Starte jetzt dein Training!</p>
        <div className="justify-end card-actions">
          <button className="btn btn-primary text-white">Starten</button>
        </div>
      </div>
    </div>
     {/* Dritte Karte */}
    <div className="card w-full sm:w-96 lg:w-96 bg-base-100 shadow-sm">
      <div className="card-body">
        <h2 className="card-title text-white">Ziel festlegen</h2>
        <p className="text-white">Definiere dein Fitnessziel und verfolge deinen Fortschritt!</p>
        <div className="justify-end card-actions">
          <button className="btn btn-primary text-white">Ziel festlegen</button>
        </div>
      </div>
    </div>
  {/* Vierte Karte */}
    <div className="card w-full sm:w-96 lg:w-96 bg-base-100 shadow-sm">
      <div className="card-body">
        <h2 className="card-title text-white">Vorlage wählen</h2>
        <p className="text-white">Nutze eine vorhandene Vorlage für dein Training!</p>
        <div className="justify-end card-actions">
          <button className="btn btn-primary text-white">Vorlage</button>
        </div>
      </div>   
    </div>
  </div>
</div>
  );
}



function App() {
  return (
    <div>
    <Header />
    <Cards/>
  </div>
  );
}
export default App