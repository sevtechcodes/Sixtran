describe('Page component', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000/setup');
  });
  beforeEach(() => {
    cy.visit('http://localhost:3000/setup');
    cy.setCookie('user', '{ "user": "x" }');
  });

  it('checks the functionality of "Use existing credentials"', () => {
    cy.contains('Use existing credentials').click();
    cy.url().should('include', '/dashboard');
  });
});

describe('Testing access to dashboard with "Update credentials"', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/setup');
    cy.setCookie('user', '{ "user": "y" }');
  });

  it('it checks if "Update credentials" is working', () => {
    cy.get('#input-api-key').type('ry20pbspJZSlyxrQ');
    cy.get('#input-api-secret').type('Y5KJ0PUD1petnS99lmpceFWVF6bpb94D');

    cy.contains('Update credentials').click();
    cy.url().should('include', '/dashboard');
  });
});
