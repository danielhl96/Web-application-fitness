/// <reference types="cypress" />
/// <reference path="./cypress.d.ts" />

// ── cy.login() ────────────────────────────────────────────────────────────────
// Logs in via the backend API directly instead of clicking through the UI.
// The server sets an httpOnly JWT cookie which Cypress keeps for subsequent requests.

Cypress.Commands.add('login', () => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:3000/auth/login',
    body: { email: 'test@test.de', password: 'Test1234@' },
  });
});

export {};
