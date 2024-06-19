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

describe('Testing Jemima API', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/setup');
    cy.setCookie('user', '{ "user": "z" }');
  });

  it('it checks if "Update credentials" is working', () => {
    cy.get('#input-api-key').type('ry20pbspJZSlyxrQ');
    cy.get('#input-api-secret').type('Y5KJ0PUD1petnS99lmpceFWVF6bpb94D');

    cy.contains('Update credentials').click();
    cy.url().should('include', '/dashboard');

    cy.get('a')
      .invoke('attr', 'href')
      .should('eq', 'dashboard/mediaeval_volition');
  });
});

describe('Testing change of frequency', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/setup');
    cy.setCookie('user', '{ "user": "a" }');
  });

  it('it checks if "Update credentials" is working', () => {
    cy.get('#input-api-key').type('ry20pbspJZSlyxrQ');
    cy.get('#input-api-secret').type('Y5KJ0PUD1petnS99lmpceFWVF6bpb94D');

    cy.contains('Update credentials').click();
    cy.url().should('include', '/dashboard');

    cy.get('input[name="select-row-mediaeval_volition"]').click();
    cy.get('select.text-s').select('120').should('have.value', '120');
    cy.get('#frequency-submit').click();

    cy.get('#cell-3-mediaeval_volition')
      .should('exist')
      .within(() => {
        cy.get('div[data-tag="allowRowEvents"]').should('contain', '2 hours');
      });
    // .invoke('attr', 'href')
    // .should('eq', 'dashboard/mediaeval_volition');
  });
});
