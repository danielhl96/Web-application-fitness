// ── Auth E2E Tests ─────────────────────────────────────────────────────────────

describe('Register', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('should show the registration form', () => {
    cy.get('h1').contains('Register').should('be.visible');
    cy.get('input[type="email"]').should('exist');
    cy.get('input[type="password"]').should('exist');
    cy.get('input[type="password"]').should('exist');
  });

  it('should register with valid data and show success message', () => {
    const email = `testuser${Date.now()}@example.com`;
    const password = 'ValidPass1!';
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').first().type(password);
    cy.get('input[type="password"]').last().type(password);
    cy.contains('button', 'Register').click();
    cy.contains('Registration successful! You can now log in.').should('be.visible');
  });

  it('should show error message when email allready exists', () => {
    cy.env(['email']).then(({ email }) => {
      cy.get('input[type="email"]').type(email);
    });

    cy.env(['password']).then(({ password }) => {
      cy.get('input[type="password"]').first().clear().type(password);
    });

    cy.env(['password']).then(({ password }) => {
      cy.get('input[type="password"]').last().clear().type(password);
    });

    cy.contains('button', 'Register').click();
    cy.contains('Email already in use').should('be.visible');
  });

  it('should show error message with invalid email', () => {
    const password = 'ValidPass1!';
    cy.get('input[type="email"]').type('invalid-email');
    cy.get('input[type="password"]').first().type(password);
    cy.get('input[type="password"]').last().type(password);
    cy.contains('button', 'Register').should('be.disabled');
  });
});

describe('Login', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should show the login form', () => {
    cy.get('h1').contains('Login').should('be.visible');
    cy.get('input[type="email"]').should('exist');
    cy.get('input[type="password"]').should('exist');
  });

  // Get a single environment variable

  it('should login with valid credentials and redirect to home', () => {
    cy.env(['email']).then(({ email }) => {
      cy.get('input[type="email"]').type(email);
    });
    cy.env(['password']).then(({ password }) => {
      cy.get('input[type="password"]').type(password);
    });
    cy.contains('button', 'Login').click();
    cy.url().should('eq', Cypress.config('baseUrl') + '/');
  });

  it('should show error message with wrong password', () => {
    cy.env(['email']).then(({ email }) => {
      cy.get('input[type="email"]').type(email);
    });
    cy.get('input[type="password"]').type('wrongpassword');
    cy.contains('button', 'Login').click();
    cy.get('[data-cy="error-message"]').should('contain.text', 'Invalid credentials');
  });

  it('should navigate to register page', () => {
    cy.contains('Are you new here?').click();
    cy.url().should('include', '/register');
  });

  it('should navigate to forgot password page', () => {
    cy.contains('Do you have forgot your password?').click();
    cy.url().should('include', '/passwordforget');
  });
});

it('should navgiate to workout page after login', () => {
  cy.login();
  cy.visit('/');
  cy.contains('.card', 'Start Workout').click();
  cy.url().should('include', '/training');
});

describe('Protected routes', () => {
  it('should redirect unauthenticated user from home to login', () => {
    cy.visit('/');
    cy.url().should('include', '/login');
  });

  it('should allow access to home after login', () => {
    cy.login();
    cy.visit('/');
    cy.url().should('eq', Cypress.config('baseUrl') + '/');
  });
});

describe('Logout', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
  });

  it('should logout and redirect to login', () => {
    // Header-Logout-Button anklicken
    cy.get('[data-cy="logout-btn"]').click();
    cy.url().should('include', '/login');
  });
});
