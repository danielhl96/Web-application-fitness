describe('Workout Tests', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/createtrain');
  });

  it('should display the workout page', () => {
    cy.contains('.divider', 'Create your workout').should('be.visible');
  });
  it('should create a workout plan', () => {
    cy.get("[data-cy='training-input']").type(`Test Workout Plan${Date.now()}`);
    cy.get("[data-cy='confirm-workout-name-button']").click();
    cy.get("[data-cy='exercise-input']").type('Benchpress');
    cy.get("[data-cy='exercise-item-Benchpress']").click();
    cy.get("[data-cy='exercise-card-Benchpress']").should('be.visible');
    cy.get("[data-cy='exercise-input']").type('Pull-Up');
    cy.get("[data-cy='exercise-item-Pull-Up']").click();
    cy.get("[data-cy='exercise-card-Pull-Up']").should('be.visible');
    cy.get("[data-cy='exercise-input']").type('Squats');
    cy.get("[data-cy='exercise-item-Squats']").click();
    cy.get("[data-cy='exercise-card-Squats']").should('be.visible');
    cy.get("[data-cy='exercise-input']").type('Deadlift');
    cy.get("[data-cy='exercise-item-Deadlift']").click();
    cy.get("[data-cy='exercise-card-Deadlift']").should('be.visible');
    cy.get("[data-cy='save-training-button']").click();
    cy.get("[data-cy='notify']").should(
      'contain.text',
      'Your training has been saved successfully!'
    );
  });

  it("shouldn't create a workout plan without a name", () => {
    cy.get("[data-cy='save-training-button']").should('be.disabled');
  });

  it('should allow setting sets and reps via the exercise tables', () => {
    cy.get("[data-cy='training-input']").type(`Test Sets Reps ${Date.now()}`);
    cy.get("[data-cy='confirm-workout-name-button']").click();
    cy.get("[data-cy='exercise-input']").type('Benchpress');
    cy.get("[data-cy='exercise-item-Benchpress']").click();
    cy.get("[data-cy='exercise-card-Benchpress']").should('be.visible');

    // Sets-Tabelle: Standardwert ist 1 Set – soll blau markiert sein
    cy.get("[aria-label='sets-Benchpress']").should('be.visible');
    cy.get("[data-cy='Sets:  1']").should('be.visible').and('have.class', 'bg-blue-500');

    // Zu 3 Sets scrollen (index 12, offset 600 px) und auswählen
    cy.get("[aria-label='sets-Benchpress']").scrollTo(0, 600);
    cy.get("[data-cy='Sets:  3']").click({ force: true });
    cy.get("[data-cy='Sets:  3']").should('have.class', 'bg-blue-500');

    // Reps-Tabelle: Standardwert ist 8 Reps – soll blau markiert sein
    cy.get("[aria-label='reps-Benchpress']").should('be.visible');
    cy.get("[data-cy='Reps:  8']").should('be.visible').and('have.class', 'bg-blue-500');

    // Zu 10 Reps scrollen (index 40, offset 2000 px) und auswählen
    cy.get("[aria-label='reps-Benchpress']").scrollTo(0, 2000);
    cy.get("[data-cy='Reps:  10']").click({ force: true });
    cy.get("[data-cy='Reps:  10']").should('have.class', 'bg-blue-500');

    cy.get("[data-cy='save-training-button']").click();
    cy.get("[data-cy='notify']").should(
      'contain.text',
      'Your training has been saved successfully!'
    );
  });

  it("workouts with the same name shouldn't be created", () => {
    const workoutName = `Test Workout Plan2${Date.now()}`;
    cy.get("[data-cy='training-input']").type(workoutName);
    cy.get("[data-cy='confirm-workout-name-button']").click();
    cy.get("[data-cy='exercise-input']").type('Benchpress');
    cy.get("[data-cy='exercise-item-Benchpress']").click();
    cy.get("[data-cy='exercise-card-Benchpress']").should('be.visible');

    cy.get("[data-cy='save-training-button']").click();
    cy.get("[data-cy='notify']").should(
      'contain.text',
      'Your training has been saved successfully!'
    );
    cy.get("[data-cy='training-input']").type(workoutName);
    cy.get("[data-cy='confirm-workout-name-button']").click();
    cy.get("[data-cy='exercise-input']").type('Pull-Up');
    cy.get("[data-cy='exercise-item-Pull-Up']").click();
    cy.get("[data-cy='exercise-card-Pull-Up']").should('be.visible');
    cy.get("[data-cy='save-training-button']").click();
    cy.get("[data-cy='notify']").should('contain.text', 'There was an error saving your training.');
  });

  it('should delete an exercise from the workout plan', () => {
    cy.get("[data-cy='training-input']").type(`Test Delete Exercise ${Date.now()}`);
    cy.get("[data-cy='confirm-workout-name-button']").click();
    cy.get("[data-cy='exercise-input']").type('Benchpress');
    cy.get("[data-cy='exercise-item-Benchpress']").click();
    cy.get("[data-cy='exercise-card-Benchpress']").should('be.visible');
    cy.get("[data-cy='exercise-input']").type('Pull-Up');
    cy.get("[data-cy='exercise-item-Pull-Up']").click();
    cy.get("[data-cy='exercise-card-Pull-Up']").should('be.visible');

    // Delete the Benchpress exercise
    cy.get("[data-cy='delete-Benchpress']").click();
    cy.get("[data-cy='exercise-card-Benchpress']").should('not.exist');
  });

  it("should visit the workout edit page and display the workout's name", () => {
    cy.visit('/editTrain');
  });

  it('should create a workout plan', () => {
    cy.get("[data-cy='training-input']").type(`Test Workout Plan`);
    cy.get("[data-cy='confirm-workout-name-button']").click();
    cy.get("[data-cy='exercise-input']").type('Benchpress');
    cy.get("[data-cy='exercise-item-Benchpress']").click();

    cy.get("[data-cy='save-training-button']").click();
    cy.get("[data-cy='notify']").should(
      'contain.text',
      'Your training has been saved successfully!'
    );
  });

  it('should delete a workout plan and show a notification', () => {
    cy.visit('/editTrain');
    cy.get("[data-cy='delete-Test Workout Plan']").first().click();
    cy.get("[data-cy='delete-workout-button']").click();
  });

  it('should create a workout plan', () => {
    cy.get("[data-cy='training-input']").type(`Test Workout Plan`);
    cy.get("[data-cy='confirm-workout-name-button']").click();
    cy.get("[data-cy='exercise-input']").type('Benchpress');
    cy.get("[data-cy='exercise-item-Benchpress']").click();

    cy.get("[data-cy='save-training-button']").click();
    cy.get("[data-cy='notify']").should(
      'contain.text',
      'Your training has been saved successfully!'
    );
  });

  it("shouldn't delete a workout plan if the user cancels the confirmation modal", () => {
    cy.visit('/editTrain');
    cy.get("[data-cy='delete-Test Workout Plan']").first().click();
    cy.get("[data-cy='cancel-delete-workout-button']").click();
  });
  it('should open the edit workout modal when clicking the edit button', () => {
    cy.visit('/editTrain');
    cy.get("[data-cy='edit-Test Workout Plan']").first().click();
    cy.get("[data-cy='exercise-search-dropdown']").type('Pull-Up');
    cy.get("[data-cy='exercise-item-Pull-Up']").click();
    cy.get("[aria-label='sets-Pull-Up']").scrollTo(0, 600);
    cy.get("[data-cy='Sets:  3']").click({ force: true });
    cy.get("[data-cy='Sets:  3']").should('have.class', 'bg-blue-500');
    cy.get("[aria-label='reps-Pull-Up']").scrollTo(0, 2000);
    cy.get("[data-cy='Reps:  10']").click({ force: true });
    cy.get("[data-cy='Reps:  10']").should('have.class', 'bg-blue-500');
    cy.get("[data-cy='save-training-button']").click();
    cy.get("[data-cy='notify']").should(
      'contain.text',
      'Your workout plan has been updated successfully.'
    );
  });

  it('should show the trainings page when clicking Start Training button and selecting a workout plan', () => {
    cy.visit('/training');
    cy.get("[data-cy='workout-card-Test Workout Plan']").first().click();
  });
  it("should show the weight panel when clicking the 'Weight' button one", () => {
    cy.visit('/training');
    cy.get("[data-cy='workout-card-Test Workout Plan']").first().click();
    cy.get("[data-cy='weight-button-0']").click();
    cy.get("[data-cy='weight-modal-0']").should('be.visible');
    cy.get("[data-cy='weight-table-0']").should('be.visible');
    cy.get("[data-cy='weight-table-0']").scrollTo(0, 350);
    cy.get("[data-cy='Weight:  1.75']").click({ force: true });
    cy.get("[data-cy='Weight:  1.75']").should('have.class', 'bg-blue-500');
    cy.get("[data-cy='weight-button']").click();
  });

  it("should show the rm panel when clicking the 'RM' button", () => {
    cy.visit('/training');
    cy.get("[data-cy='workout-card-Test Workout Plan']").first().click();
    cy.get("[data-cy='exercise-rm']").click();
  });

  it("should show the exercise lists when clicking the 'Exercises' button", () => {
    cy.visit('/training');
    cy.get("[data-cy='workout-card-Test Workout Plan']").first().click();
    cy.get("[data-cy='exercise-list']").click();
  });

  it("should record the user's training progress and show a notification when saving", () => {
    cy.visit('/training');
    cy.get("[data-cy='workout-card-Test Workout Plan']").first().click();
    cy.get("[data-cy='exercise-next']").click();
  });
});
