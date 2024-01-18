// cypress/integration/nestedIframe.spec.js

Cypress.on('uncaught:exception', (err, runnable) => { return false; });

describe('Nested Iframe Interaction', () => {
    it('should interact with elements within nested iframes', () => {
        cy.visit('cypress/html/index.html');

        // First, collect all iframe selectors available on the main page.
        cy.collectIframeSelectors().then((iframeSelectors) => {
            // Replace 'selectorInsideNestedIframe' with the actual selector you want to check.
            const selectorInsideNestedIframe = 'input#inputFieldL3';

            cy.traverseDeepIframe(["#firstLevel", "#secondLevel", "#thirdLevel"], () => {
                // Your interaction with elements inside the deepest iframe
                cy.get("input#inputFieldL3").should("exist");

                // Additional check for the second iframe with a wait
                cy.get("iframe#secondLevel").should("exist").then(() => {
                    // Add a wait before attempting to find elements inside the second iframe
                    cy.wait(1000);

                    // Check for elements inside the second iframe
                    cy.get("iframe#secondLevel").find("input#inputFieldL2").should("exist");
                });
            });
        });
    });
});
