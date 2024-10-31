describe('App Component Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render the app correctly', () => {
    cy.get('h1').contains('COVER LETTER GENERATOR');
  });

  it('should upload a file', () => {
    const fileName = 'cypress/test-files/example.docx';
    cy.get('input[type="file"]').attachFile(fileName);
    cy.get('.file-name').should('contain', fileName); // Adjust the selector as per your app
  });

  it('should display the Parse button', () => {
    cy.get('button').contains('Parse').should('be.visible');
  });

  it('should display template items and button group after parsing', () => {
    cy.get('button').contains('Parse').click();
    cy.get('.template-items').should('be.visible');
    cy.get('.button-group').should('be.visible');
  });

  it('should display an error message for invalid files', () => {
    const invalidFileName = 'invalid.txt';
    cy.get('input[type="file"]').attachFile(invalidFileName);
    cy.get('.error-text').should('be.visible');
  });
});