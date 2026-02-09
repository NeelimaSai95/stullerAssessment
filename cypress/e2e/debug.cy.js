describe("packaging product page", () => {


    const productName = "61-0089:100000:T";
    const username = Cypress.env("username");
    const password = Cypress.env("password");
    const timeOut = Cypress.env("timeout");
    const waitForPage = () => {
      cy.document().its("readyState").should("eq", "complete");
      cy.get("body").should("be.visible");
    };
  
    beforeEach(() => {
  
      cy.loginFromHeader(username, password);
  
    });

    // ===============================
    // Test 1
    // ===============================
  
    it("should load and display product details", () => {
  
      cy.searchFromHome(productName);
  
      cy.contains(productName, { timeout: timeOut })
        .should("be.visible");
      
        // Validate price is numeric & > 0
        cy.get('.mainPrice', { timeout: timeOut })
        .filter(':visible')
        .first()
        .invoke('text')
        .then((price) => {
          const pricefloat = price.replace(/[^0-9.]/g, '');
          
          cy.log("Price Value:" + pricefloat);
          const priceVal = parseFloat(pricefloat)
          expect(priceVal, 'Price value should be > 0').to.be.gt(0);
        });
      
      
    // The ship date should not be empty
      cy.get('[data-test="ship-date"]')
        .should("be.visible")
        .invoke('text')
        .should('not.be.empty');
  
    });
  
    // ===============================
    // Test 2
    // ===============================
  
    it("should add product and update quantity in cart", () => {

  
      cy.searchFromHome(productName);

            var initialqty = 8
            var latestqty = 5
            var totalquantity = 1

            cy.get('[data-test="cart-count"]', { timeout: timeOut })
            .invoke('text')
            .then((countText) => {
              totalquantity = Number(countText.trim());
              // Should match the current count
              totalquantity = totalquantity + 1;
            });

      cy.updateQty(initialqty);

      cy.updateQty(latestqty);
       
      cy.addToCart();

     cy.navigatetoCart();
     waitForPage();
  
      //Update qty in cart

      cy.get('[data-test="cart-count"]', { timeout: timeOut })
      .invoke('text')
      .then((countText) => {
        const count = Number(countText.trim());
        cy.log('Cart Count: ' + count);
    
        expect(totalquantity).to.be.equals(count);
      });
  
   //  cy.contains("8").should("exist");
  
    });
  
    // ===============================
    // New Test Case 1
    // ===============================
  
    it("Should validate the Availibilty", () => {
      
      cy.searchFromHome(productName);
  
      cy.contains(productName)
        .should("exist");
      
        cy.get('[data-test="status-message"]', { timeout: timeOut })
        .invoke('text')
        .then(t => t.trim())
        .should('eq', 'Limited Availability');
  
    });
  
    // ===============================
    // New Test Case 2
    // ===============================
  
    it("Verify the Product Quantity with View Cart Page", () => {
  
      cy.searchFromHome(productName);

      const qty = 3;

    
      cy.updateQty(qty);

      cy.addToCart();
  
        cy.navigatetoCart();
  
      cy.contains(productName)
        .should("exist");

  cy.get('[data-test="item-quantity"]', { timeout: timeOut })
  .eq(0)
      .invoke('val')
      .then((count) => {
        count = count
        expect(qty).to.be.equals(Number(count));
      });
    });
   });
  