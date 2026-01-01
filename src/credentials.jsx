import TemplatePage from './templatepage';
import Header from './Header.jsx';

function CredentialsPage() {
  return (
    <div>
      <Header />
      <TemplatePage>
        <div className="overflow-auto max-h-[80vh]">
          <h1 className="text-2xl font-bold text-white mb-4">Credentials</h1>
          <div className="divider divider-primary"></div>
          <p>This page provides information about user credentials and security.</p>
        </div>
      </TemplatePage>
    </div>
  );
}

export default CredentialsPage;
