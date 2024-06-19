import CredentialsForm from '../app/ui/credentials-form';
// mocks the cookie

describe('page component', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000/setup');
  });
  beforeEach(() => {
    cy.visit('http://localhost:3000/setup');
    cy.setCookie('user', '{ "user": "x" }');
  });

  it('checks the functionality of Use existing credentials', () => {
    cy.contains('Use existing credentials').click();
    cy.url().should('include', '/dashboard');
  });
});
