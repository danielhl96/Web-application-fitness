/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /** Login via API (bypasses UI, much faster) */
    login(email?: string, password?: string): Chainable<void>;
  }
}
