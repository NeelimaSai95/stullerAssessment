describe("Task 1 - E2E Workflow Automation", () => {

  const productName = "4196:4677:P";
  const qty = 1;
  const specialInstruction = "Task 1 - E2E Workflow Automation";
  const username = Cypress.env("username");
  const password = Cypress.env("password");
  const timeOut = Cypress.env("timeout");

  beforeEach(() => {
   
    cy.intercept("GET", "**/search**").as("search");
    cy.intercept("POST", "**/instock**").as("instock");
    cy.intercept("GET", "**/cartitems**").as("getCart");

    cy.loginFromHeader(username, password);
    
});

  it("Login → Search → Capture Item → Add to Cart → Verify", () => {

    // Search
    cy.searchFromHome(productName);

   //cy.contains('[data-test="status-message"]', { timeout: 20000 }).should("be.visible");

   cy.get('[data-test="status-message"]').should('be.visible').and('not.be.empty');

   // Verify Item Number
   cy.getItemNumber().then((itemNumber) => {
    cy.log(itemNumber);
  });

    // Special instructions
    cy.addSpecialInstruction(specialInstruction)

    // Add to Cart
    cy.addToCart();
    
});
// Verify in cart
    it("Verify Cart Cart items", () => { 
    
    
    cy.navigatetoCart();

    cy.get('#cart-page-title').should('be.visible').and('not.be.empty');

    
    // Verify the item number
    cy.get('[data-test="item-number"]')
  .eq(0) // Selects the 1st item (index 0)
  .invoke('text')
  .then((itemNo) => {
    // Assert that a container with the product name contains this specific item number
    cy.expect(productName).eq(itemNo);
  });

  // Verify the Special Instructions
  cy.get('[data-test="special-instructions"]')
  .eq(0) // Selects the 1st item (index 0)
  .invoke('text')
  .then((instructions) => {
    // Assert that a container with the product name contains this specific item number
    cy.expect(specialInstruction).eq(instructions);
  });
       
    // Verify if the total products added match
    cy.log("Validate header cart count");

// Verify Cart Count
cy.get('[data-test="cart-count"]', { timeout: timeOut })
.invoke('text')
.then((countText) => {
  const count = Number(countText.trim());
  cy.log('Cart Count: ' + count);

  expect(qty).to.be.equals(count);
});

    

    cy.contains(/error|failed/i).should("not.exist");
  });

});