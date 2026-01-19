describe('PNP-DS Website Test', () => {

  it('Homepage Loads Successfully', () => {

    cy.visit('/')

    cy.contains('Login').should('exist')

  })

})
