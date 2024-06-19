import CredentialsForm from '../app/ui/credentials-form';
// mocks the cookie

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

  // it('it checks if "Update credentials" is working', () => {
  //   cy.intercept(
  //     'POST',
  //     '/POST /api/fivetran?method=GET&endpoint=groups&apiKey=ry20pbspJZSlyxr&apiSecret=Y5KJ0PUD1petnS99lmpceFWVF6bpb94D',
  //     {
  //       statusCode: 200,
  //       body: {
  //         success: true,
  //         message:
  //       },
  //     }
  //   );
  // });
});
