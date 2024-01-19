// cypress/support/commands.js
Cypress.Commands.add('getIframeBody', { prevSubject: 'element' }, ($iframe) => {
    return cy
        .wrap($iframe, { log: false })
        .should(iframe => expect(iframe.contents().find('body')).to.exist, { timeout: 10000 })
        .then($iframe => cy.wrap($iframe.contents().find('body'), { log: false }));
});



Cypress.Commands.add('collectIframeSelectors', (rootElement = 'body') => {
    return cy.get(rootElement).then($root => {
        const iframes = $root.find('iframe');
        let selectors = [];
        iframes.each(function () {
            const id = this.id ? `#${this.id}` : '';
            const cls = this.className ? `.${this.className.split(' ')[0]}` : '';
            selectors.push(id || cls);
        });
        return cy.wrap(selectors);
    });
});

Cypress.Commands.add("traverseDeepIframe", (iframeSelectors, actionCallback) => {
    const traverseIframes = (index) => {
        if (index >= iframeSelectors.length) {
            actionCallback(); // Reached the deepest iframe, execute the callback
            return;
        }

        const selector = iframeSelectors[index];
        cy.log(`Traversing iframe: ${selector}`);

        // We use getIframeBody command to wait for each iframe's body to be loaded
        cy.get(selector).should('be.visible').getIframeBody().within(() => {
            // Recursively call traverseIframes to handle the next iframe
            traverseIframes(index + 1);
        });
    };

    // Start traversal from the first iframe
    traverseIframes(0);
});


