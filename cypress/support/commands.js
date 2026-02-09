const website = Cypress.env("website");
const cart = website + "cart/";
const timeOut = Cypress.env("timeout");
Cypress.Commands.add("loginFromHeader", (username, password) => {
    // Open login modal (top right)
    cy.intercept("POST", "**/login**").as("login");
    cy.visit(website);
    cy.contains(/log\s*in/i).should("be.visible").click();
  
    // Fill login form (based on your screenshot placeholders)
    cy.get('[data-test="username"]', { timeout: timeOut })
      .should("be.visible")
      .clear()
      .type(username, { log: false });
  
    cy.get('[data-test="password"]')
      .should("be.visible")
      .clear()
      .type(password, { log: false });
  
    // Click Log In button inside modal
    cy.contains("button, a", /log\s*in/i)
      .should("be.visible")
      .click();

      cy.wait("@login", { timeout: timeOut }).then((i) => {
        cy.log("POST URL: " + i.request.url);
        cy.log("POST status: " + (i.response?.statusCode ?? "n/a"));
    });
  });
  
  Cypress.Commands.add("searchFromHome", (productName) => {
    expect(productName, "search item").to.be.a("string").and.not.be.empty;
  
    const searchInput =
      'input[placeholder="Search..."], input[placeholder="Search…"], input[type="search"]';
      cy.get('input[placeholder="Search..."]').parent().then(el => console.log(el))
      
    cy.window().then((win) => win.scrollTo(0, 0));
   cy.get('input[placeholder="Search..."]')
  .filter(':visible')
//   .first()
  .focus()
  .clear({ force: true })
  .type(productName, { delay: 20, force: true });

  
  // Click the magnifying glass button next to it
  cy.get('button')
  .filter(':visible')
  .find('svg, i')   // magnifier icon inside
  .closest('button')
  .click();

  });

 // Navigate to Cart
  Cypress.Commands.add("navigatetoCart", (productName) => {
   
    cy.visit(cart);

  });

  // Update the quantity
  Cypress.Commands.add("updateQty", (quantity) => {
    
    cy.get('[data-test="quantity"]').clear({ force: true });
    cy.wait(500);
    cy.get('[data-test="quantity"]', { timeout: timeOut })
.clear()
  .scrollIntoView()
  .should('be.visible')
  .type(quantity)
  .should('have.value', `${quantity}`);
  });

      // Add to cart
      Cypress.Commands.add("addToCart", () => {
    
        cy.contains('button', /add to cart/i, { timeout: timeOut })
        .should('be.visible')
        .and('not.be.disabled')
        .click();
    });

   

    // Add Special Instruction
    Cypress.Commands.add("addSpecialInstruction", (specialInstruction) => {
    cy.get('[data-test="special-instructions-section"]', { timeout: timeOut })
    .should('be.visible')
    .within(() => {
        cy.get('textarea:visible')
        .first()
        .type(specialInstruction,{delay : 10});
    })
});

Cypress.Commands.add("getItemNumber", () => {
    return cy.get('[data-test="item-number"]', { timeout: timeOut })
      .should("be.visible")
      .invoke("text")
      .then((text) => {
        return text.replace('Item #', '').trim();
      });
  });