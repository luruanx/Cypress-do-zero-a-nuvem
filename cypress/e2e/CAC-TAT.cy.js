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
    cy.get('#phone-checkbox').check()
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

  // SELECIONANDO OPÇÕES EM CAMPOS DE SELEÇÃO SUSPENSAS------------------

  it('seleciona um produto (YouTube) por seu texto', () => {
    cy.get('#product')
      .select('YouTube')
      .should('have.value', 'youtube')
  })

  it('seleciona um produto (Mentoria) por seu valor (value)', () => {
    cy.get('#product')
      .select('mentoria')
      .should('have.value', 'mentoria')
  })

  it('seleciona um produto (Blog) por seu índice', () => {
    cy.get('#product')
      .select(1)
      .should('have.value', 'blog')
  })

  // MARCANDO INPUTS DO TIPO RADIO--------------------

  it('marca o tipo de atendimento "Feedback"', () => {
    cy.get('input[type="radio"][value="feedback"]')
      .check()
      .should('be.checked')
  }) 

  it('marca cada tipo de atendimento', () => {
    cy.get('input[type="radio"]')
      .each(typeOfService => {
        cy.wrap(typeOfService)
          .check()
          .should('be.checked')
      })
  })

  it('marca ambos checkboxes, depois desmarca o último', () => {
    cy.get('input[type="checkbox"]')
      .check()
      .should('be.checked')
      .last()
      .uncheck()
      .should('not.be.checked')
  })

  // FAZENDO UPLOAD DE ARQUIVOS
  it('seleciona um arquivo da pasta fixtures', () => {
    cy.get('#file-upload')
      .selectFile('cypress/fixtures/example.txt')
      .should(input => {
        expect(input[0].files[0].name).to.equal('example.txt')
      })
  })

  it('seleciona um arquivo simulando um drag-and-drop', () => {
    cy.get('#file-upload')
      .selectFile('cypress/fixtures/example.txt', {action: 'drag-drop'})
      .should(input => {
        expect(input[0].files[0].name).to.equal('example.txt')
      })
  })

  it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
    cy.fixture('example.json').as('sampleFile')
    cy.get('#file-upload')
      .selectFile('@sampleFile')
      .should(input => {
        expect(input[0].files[0].name).to.equal('example.json')
      })
  })

  // LIDANDO COM LINKS QUE ABREM EM OUTRA ABA

  it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
    cy.contains('a', 'Política de Privacidade')
      .should('have.attr', 'href', 'privacy.html')
      .and('have.attr', 'target', '_blank')
  })

  it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
    cy.contains('a', 'Política de Privacidade')
      .invoke('removeAttr', 'target')
      .click()

    cy.contains('h1', 'CAC TAT - Política de Privacidade').should('be.visible')
  })
})

