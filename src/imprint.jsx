import './index.css';
import Header from './HeaderLogout.jsx';
import TemplatePage from './templatepage.jsx';
function Imprint() {
  return (
    <div>
      <Header />
      <TemplatePage dockDisabled={true}>
        <h2 className="text-2xl font-bold text-white mb-4  text-start pb-2">Imprint</h2>
        <div className="divider divider-primary"></div>
        <div className="flex flex-col items-start text-white space-y-4">
          <p>
            Angaben gemäß § 5 TMG
            <br />
            Daniel Hennies
            <br />
            Ithweg 4<br />
            30851 Langenhagen
            <br />
            Deutschland‚
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
            Plattform der EU-Kommission zur Online-Streitbeilegung:{' '}
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
            Quelle:{' '}
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
      </TemplatePage>
    </div>
  );
}

export default Imprint;
