import "./index.css";

function PrivacyPolicy() {
  function Header() {
    return (
      <div>
        <div className="navbar fixed top-0 left-0 w-full bg-black text-white z-50">
          <div className="flex w-full justify-between items-center px-4">
            <button
              onClick={() => window.history.back()}
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
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <Header />
      <div className="space-y-8 card sm:w-96 md:w-150 h-150 w-90 bg-gray-800 border border-blue-500 shadow-sm p-8 rounded-md">
        <div className="overflow-auto max-h-[80vh] text-white">
          <h2 className="text-3xl font-bold mb-6 text-center border-b border-blue-400 pb-2">
            Privacy Policy
          </h2>
          <h1 className="text-2xl font-semibold mb-6 text-center">
            Datenschutzerklärung
          </h1>

          {/* Abschnitt 1 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-3 border-b border-blue-300 pb-1">
              1. Datenschutz auf einen Blick
            </h2>
            <h3 className="text-lg font-semibold mb-2">Allgemeine Hinweise</h3>
            <p className="mb-4">
              Die folgenden Hinweise geben einen einfachen Überblick darüber,
              was mit Ihren personenbezogenen Daten passiert, wenn Sie diese
              Website besuchen. Personenbezogene Daten sind alle Daten, mit
              denen Sie persönlich identifiziert werden können. Ausführliche
              Informationen zum Thema Datenschutz entnehmen Sie unserer unter
              diesem Text aufgeführten Datenschutzerklärung.
            </p>
            <h3 className="text-lg font-semibold mb-2">
              Datenerfassung auf dieser Website
            </h3>
            <h4 className="font-semibold mb-1">
              Wer ist verantwortlich für die Datenerfassung auf dieser Website?
            </h4>
            <p className="mb-4">
              Die Datenverarbeitung auf dieser Website erfolgt durch den
              Websitebetreiber. Dessen Kontaktdaten können Sie dem Abschnitt{" "}
              <span className="font-semibold">
                „Hinweis zur Verantwortlichen Stelle“
              </span>{" "}
              in dieser Datenschutzerklärung entnehmen.
            </p>
            <h4 className="font-semibold mb-1">Wie erfassen wir Ihre Daten?</h4>
            <ul className="list-disc pl-6 mb-4">
              <li>
                Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese
                mitteilen. Hierbei kann es sich z.&nbsp;B. um Daten handeln, die
                Sie in ein Kontaktformular eingeben.
              </li>
              <li>
                Andere Daten werden automatisch oder nach Ihrer Einwilligung
                beim Besuch der Website durch unsere IT-Systeme erfasst
                (z.&nbsp;B. Internetbrowser, Betriebssystem, Uhrzeit des
                Seitenaufrufs).
              </li>
            </ul>
            <h4 className="font-semibold mb-1">Wofür nutzen wir Ihre Daten?</h4>
            <p className="mb-4">
              Ein Teil der Daten wird erhoben, um eine fehlerfreie
              Bereitstellung der Website zu gewährleisten. Andere Daten können
              zur Analyse Ihres Nutzerverhaltens verwendet werden. Sofern über
              die Website Verträge geschlossen oder angebahnt werden können,
              werden die übermittelten Daten auch für Vertragsangebote,
              Bestellungen oder sonstige Auftragsanfragen verarbeitet.
            </p>
            <h4 className="font-semibold mb-1">
              Welche Rechte haben Sie bezüglich Ihrer Daten?
            </h4>
            <ul className="list-disc pl-6 mb-4">
              <li>
                Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten
                personenbezogenen Daten
              </li>
              <li>Recht auf Berichtigung oder Löschung dieser Daten</li>
              <li>Widerruf einer Einwilligung zur Datenverarbeitung</li>
              <li>
                Einschränkung der Verarbeitung Ihrer personenbezogenen Daten
              </li>
              <li>Beschwerderecht bei der zuständigen Aufsichtsbehörde</li>
            </ul>
            <p>
              Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie
              sich jederzeit an uns wenden.
            </p>
          </section>

          {/* Abschnitt 2 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-3 border-b border-blue-300 pb-1">
              2. Hosting
            </h2>
            <p className="mb-4">
              Wir hosten die Inhalte unserer Website bei folgendem Anbieter:
            </p>
            <h3 className="text-lg font-semibold mb-2">Externes Hosting</h3>
            <p className="mb-4">
              Diese Website wird extern gehostet. Die personenbezogenen Daten,
              die auf dieser Website erfasst werden, werden auf den Servern des
              Hosters gespeichert. Hierbei kann es sich v.&nbsp;a. um
              IP-Adressen, Kontaktanfragen, Meta- und Kommunikationsdaten,
              Vertragsdaten, Kontaktdaten, Namen, Websitezugriffe und sonstige
              Daten handeln.
            </p>
            <p className="mb-4">
              Das externe Hosting erfolgt zum Zwecke der Vertragserfüllung
              gegenüber unseren potenziellen und bestehenden Kunden (Art. 6 Abs.
              1 lit. b DSGVO) und im Interesse einer sicheren, schnellen und
              effizienten Bereitstellung unseres Online-Angebots durch einen
              professionellen Anbieter (Art. 6 Abs. 1 lit. f DSGVO). Sofern eine
              entsprechende Einwilligung abgefragt wurde, erfolgt die
              Verarbeitung ausschließlich auf Grundlage von Art. 6 Abs. 1 lit. a
              DSGVO und § 25 Abs. 1 TDDDG, soweit die Einwilligung die
              Speicherung von Cookies oder den Zugriff auf Informationen im
              Endgerät des Nutzers umfasst. Die Einwilligung ist jederzeit
              widerrufbar.
            </p>
            <p className="mb-4">
              Unser(e) Hoster wird Ihre Daten nur insoweit verarbeiten, wie dies
              zur Erfüllung seiner Leistungspflichten erforderlich ist und
              unsere Weisungen in Bezug auf diese Daten befolgen.
            </p>
            <div className="mb-4">
              <span className="font-semibold">
                Wir setzen folgenden Hoster ein:
              </span>
              <div className="ml-4 mt-2">
                <strong>Render</strong>
                <br />
                525 Brannan St Suite 300
                <br />
                San Francisco, CA 94107,
                <br />
                Vereinigte Staaten
              </div>
            </div>
            <h4 className="font-semibold mb-1">Auftragsverarbeitung</h4>
            <p>
              Wir haben einen Vertrag über Auftragsverarbeitung (AVV) zur
              Nutzung des oben genannten Dienstes geschlossen. Hierbei handelt
              es sich um einen datenschutzrechtlich vorgeschriebenen Vertrag,
              der gewährleistet, dass dieser die personenbezogenen Daten unserer
              Websitebesucher nur nach unseren Weisungen und unter Einhaltung
              der DSGVO verarbeitet.
            </p>
          </section>

          {/* Abschnitt 3 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-3 border-b border-blue-300 pb-1">
              3. Allgemeine Hinweise und Pflichtinformationen
            </h2>
            <h3 className="text-lg font-semibold mb-2">Datenschutz</h3>
            <p className="mb-4">
              Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen
              Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten
              vertraulich und entsprechend den gesetzlichen
              Datenschutzvorschriften sowie dieser Datenschutzerklärung.
            </p>
            <p className="mb-4">
              Wenn Sie diese Website benutzen, werden verschiedene
              personenbezogene Daten erhoben. Personenbezogene Daten sind Daten,
              mit denen Sie persönlich identifiziert werden können. Die
              vorliegende Datenschutzerklärung erläutert, welche Daten wir
              erheben und wofür wir sie nutzen. Sie erläutert auch, wie und zu
              welchem Zweck das geschieht.
            </p>
            <p className="mb-4">
              Wir weisen darauf hin, dass die Datenübertragung im Internet
              (z.&nbsp;B. bei der Kommunikation per E-Mail) Sicherheitslücken
              aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff
              durch Dritte ist nicht möglich.
            </p>
            <h3 className="text-lg font-semibold mb-2">
              Hinweis zur verantwortlichen Stelle
            </h3>
            <div className="mb-4 ml-4">
              <span className="font-semibold">Verantwortlicher:</span>
              <br />
              Daniel Hennies
              <br />
              Ithweg 4<br />
              30851 Langenhagen
              <br />
              E-Mail: daniel.hennies@t-online.de
            </div>
            <p className="mb-4">
              Verantwortliche Stelle ist die natürliche oder juristische Person,
              die allein oder gemeinsam mit anderen über die Zwecke und Mittel
              der Verarbeitung von personenbezogenen Daten entscheidet.
            </p>
            <h3 className="text-lg font-semibold mb-2">Speicherdauer</h3>
            <p className="mb-4">
              Soweit innerhalb dieser Datenschutzerklärung keine speziellere
              Speicherdauer genannt wurde, verbleiben Ihre personenbezogenen
              Daten bei uns, bis der Zweck für die Datenverarbeitung entfällt.
              Wenn Sie ein berechtigtes Löschersuchen geltend machen oder eine
              Einwilligung zur Datenverarbeitung widerrufen, werden Ihre Daten
              gelöscht, sofern wir keine anderen rechtlich zulässigen Gründe für
              die Speicherung Ihrer personenbezogenen Daten haben (z.&nbsp;B.
              steuer- oder handelsrechtliche Aufbewahrungsfristen); im
              letztgenannten Fall erfolgt die Löschung nach Fortfall dieser
              Gründe.
            </p>
            <h3 className="text-lg font-semibold mb-2">Ihre Rechte</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Auskunft, Berichtigung und Löschung Ihrer Daten</li>
              <li>Einschränkung der Verarbeitung</li>
              <li>Widerruf einer Einwilligung</li>
              <li>
                Widerspruch gegen bestimmte Verarbeitungen (Art. 21 DSGVO)
              </li>
              <li>Recht auf Datenübertragbarkeit</li>
              <li>Beschwerderecht bei der Aufsichtsbehörde</li>
            </ul>
            <h3 className="text-lg font-semibold mb-2">
              SSL- bzw. TLS-Verschlüsselung
            </h3>
            <p className="mb-4">
              Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der
              Übertragung vertraulicher Inhalte, wie zum Beispiel Bestellungen
              oder Anfragen, die Sie an uns als Seitenbetreiber senden, eine
              SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung
              erkennen Sie daran, dass die Adresszeile des Browsers von
              „http://“ auf „https://“ wechselt und an dem Schloss-Symbol in
              Ihrer Browserzeile.
            </p>
            <p className="mb-4">
              Wenn die SSL- bzw. TLS-Verschlüsselung aktiviert ist, können die
              Daten, die Sie an uns übermitteln, nicht von Dritten mitgelesen
              werden.
            </p>
            <p className="text-xs text-gray-400">
              Quelle:{" "}
              <a
                href="https://www.e-recht24.de"
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://www.e-recht24.de
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
