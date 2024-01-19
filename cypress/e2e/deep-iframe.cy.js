describe('Nested Iframe Interaction', () => {
    it('should interact with elements within nested iframes', () => {
        cy.visit('cypress/html/index.html');

        // Traverse to an iframe within a list of elements
        cy.collectIframeSelectors().then((iframeSelectors) => {
            cy.traverseToIframeWithinElements(iframeSelectors, 'input#inputFieldL1', () => {
                cy.get('input#inputFieldL1').type("Hello iFrame 1");
            });
        });

        // Traverse to Deepest an iframe within a list of elements
        cy.collectIframeSelectors().then((iframeSelectors) => {
            cy.traverseDeepIframe(iframeSelectors, () => {
                cy.get('input#inputFieldL3').type("Hello iFrame 3");
            });
        });
    });
});