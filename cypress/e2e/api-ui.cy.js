describe("Task 2 — API + UI Hybrid Validation", () => {

  const sku = "4196:4677:P";

  const apiUser = Cypress.env("username");
  const apiPass = Cypress.env("password");
  const apiUrl  = Cypress.env("productApiBase"); // full endpoint

  const username = Cypress.env("username");
  const password = Cypress.env("password");

  it("API Data -> UI Data -> Compare ", () => {

    // ===============================
    // API REQUEST
    // ===============================

    cy.request({
      method: "GET",
      url: `${apiUrl}${encodeURIComponent(sku)}`,
      auth: {
        username: apiUser,
        password: apiPass
      },
      failOnStatusCode: false
    }).then((resp) => {
    
      console.log("FULL RESPONSE:", resp);
    
    });


    cy.request({
      method: "GET",
      url: `${apiUrl}${encodeURIComponent(sku)}`,
      auth: {
        username: apiUser,
        password: apiPass
      }
    }).then((resp) => {

      // ---- Mandatory HTTP validation
      expect(resp.status, "HTTP Response Code").to.eq(200);

      const product = resp.body.Products[0];
      
      const apiData = {
        sku: product.SKU,
        price: Number(product.Price.Value).toFixed(2),
        description: product.Description.trim(),
        status: product.Status.trim()
      };

      // Print JSON for debugging
      console.log("API PRODUCT:", apiData);

      cy.wrap(apiData).as("apiData");
    });

        // ===============================
    // UI FLOW
    // ===============================

    cy.loginFromHeader(username, password);

    cy.searchFromHome(sku);

    // Capture UI values

      cy.get('[data-test="item-number"]', { timeout: 20000 })
  .should("be.visible")
  .invoke("text")
  .then(text => {
    const sku = text.replace('[data-test="item-number"]', "").trim();
    cy.wrap(sku).as("uiSku"); 
  });
  
      cy.get("h1")
      .invoke("text")
      .then(t => {
        const h1 = t.trim();
    
        console.log("H1 TEXT:", h1);   // Browser console
        cy.log("H1 TEXT: " + h1);      // Cypress runner log
    
        cy.wrap(h1).as("uiDesc");
      });
    
      cy.wait(500);        // allow layout settle
      cy.scrollTo('top');

    

      cy.get('.mainPrice').then(($body) => {

        const matches = $body.text().match(/\$\s*\d[\d,]*\.\d{2}/g) || [];
      
        const prices = JSON.stringify(matches);
      
        cy.log("All Prices: " + prices);
        console.log("All Prices:", matches[1]);
      
        const uiPrice = matches[1].replace('$','');  // pick correct index
      
        cy.wrap(uiPrice).as('uiPrice');
      
      });

      cy.get('.inStock').should('not.be.empty');
    
      cy.get('[data-test="status-message"]')
      .invoke('text')
      .then(status => {
    
        const uiStatus = status.trim();
        cy.log('UI Status:', uiStatus);
    
        cy.wrap(uiStatus).as('uiStatus');
      });


    // ===============================
    // HYBRID VALIDATIONS
    // ===============================
    cy.get("@apiData").then(api => {

      cy.get("@uiSku").then(uiSku => {
        expect(uiSku, "SKU Validation Failed")
          .to.eq(api.sku);
      });

      cy.get("@uiPrice").then(uiPrice => {
        expect(uiPrice, "Price Validation Failed")
          .to.eq(api.price);
      });

      cy.get("@uiDesc").then(uiDesc => {
        expect(uiDesc, "Description Validation Failed")
          .to.contain(api.description);
      });

      cy.get("@uiStatus").then(uiStatus => {
        expect(uiStatus.toLowerCase(), "Status Validation Failed")
          .to.contain(api.status.toLowerCase());
      });

    });

  });
});
