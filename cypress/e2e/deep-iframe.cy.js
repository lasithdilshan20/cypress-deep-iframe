// cypress/integration/nestedIframe.spec.js

Cypress.on('uncaught:exception', (err, runnable) => { return false; });

// cypress/integration/nestedIframe.spec.js

describe('Nested Iframe Interaction', () => {
    it('should interact with elements within nested iframes', () => {
        cy.visit('cypress/html/index.html');

        // Starting point for your iframe traversal. This should be the top-level document.
        cy.collectIframeSelectors('body').then((iframeSelectors) => {
            if (iframeSelectors.length === 0) {
                throw new Error('No iframes found for traversal!');
            }
            cy.traverseDeepIframe(iframeSelectors, () => {
                const deepestSelector = 'input#inputFieldL3';
                // Ensure that you handle the asynchrony here. There is no guarantee that the element will immediately exist after this command.
                cy.get(deepestSelector, { timeout: 10000 }).should('exist').and('be.visible').type('Hello World');
            });
        });
    });
});
