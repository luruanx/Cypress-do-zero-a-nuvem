describe('Central de Atendimento ao Cliente TAT', () => {
  beforeEach(() => {
    cy.visit('./src/index.html')
  })

  it('verifica o título da aplicação', () => {
    cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
  })

  it('preenche os campos obrigatórios e envia o formulário', () => {
    const longText = Cypress._.repeat('1234567890', 15)
    cy.get('#firstName').type('Ruan')
    cy.get('#lastName').type('Richard')
    cy.get('#email').type('ruan@email.com')
    cy.get('#open-text-area').type(longText, { delay: 0 })
    cy.get('button[type="submit"]').click()

    cy.get('.success').should('be.visible')
  })

  it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
    cy.get('#firstName').type('Ruan')
    cy.get('#lastName').type('Richard')
    cy.get('#email').type('ruan@email,com')
    cy.get('#open-text-area').type('Obrigado!')
    cy.get('button[type="submit"]').click()

    cy.get('.error').should('be.visible')
  })

  it('se um valor não-numérico for digitado, o valor continuará vazio', () => {
    cy.get('#phone')
      .type('abcde')
      .should('have.value', '')
  })

  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
    cy.get('#firstName').type('Ruan')
    cy.get('#lastName').type('Richard')
    cy.get('#email').type('ruan@email.com')
    cy.get('#open-text-area').type('Obrigado!')
    cy.get('#phone-checkbox').click()
    cy.contains('button', 'Enviar').click()         // Usando o Contains

    cy.get('.error').should('be.visible')
  })

  it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
    cy.get('#firstName')
      .type('Ruan')
      .should('have.value', 'Ruan')
      .clear()
      .should('have.value', '')

    cy.get('#lastName')
      .type('Richard')
      .should('have.value', 'Richard')
      .clear()
      .should('have.value', '')

    cy.get('#email')
      .type('ruan@email.com')
      .should('have.value', 'ruan@email.com')
      .clear()
      .should('have.value', '')

    cy.get('#open-text-area')
      .type('Obrigado!')
      .should('have.value', 'Obrigado!')
      .clear()
      .should('have.value', '')
  })

  it('Exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
    cy.get('button[type="submit"]').click()

    cy.get('.error').should('be.visible')
  })

  it('envia o formuário com sucesso usando um comando customizado', () => {
    const data = {
      firstName: 'Ruan',
      lastName: 'Richard',
      email: 'ruan@email.com',
      text: 'Obrigado!'
    }

    cy.fillMandatoryFieldsAndSubmit(data)

    cy.get('.success').should('be.visible')
  })


})

