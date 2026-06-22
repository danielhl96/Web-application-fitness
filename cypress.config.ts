import { defineConfig } from 'cypress';

export default defineConfig({
  allowCypressEnv: false,

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:5173',
    viewportWidth: 1440,
    viewportHeight: 900,

    env: {
      email: 'test@test.de',
      password: 'Test1234@',
    },
    expose: {
      environment: 'staging', // Public configuration value
    },
  },
});
