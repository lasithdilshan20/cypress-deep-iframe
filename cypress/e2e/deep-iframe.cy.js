describe('Nested Iframe Interaction', () => {
    it('should interact with elements within nested iframes', () => {
        cy.visit('cypress/html/index.html');

        cy.collectIframeSelectors().then((iframeSelectors) => {
            cy.traverseDeepIframe(iframeSelectors, () => {
                cy.get('input#inputFieldL3').type("Hello iFrame 3")
            });
        });
    });
});