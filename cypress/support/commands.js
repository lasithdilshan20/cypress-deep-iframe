// cypress/support/commands.js

// Retrieves the body of an iframe once it's fully loaded
Cypress.Commands.add('getIframeBody', { prevSubject: 'element' }, (iframe) => {
    cy.wrap(iframe)
        .should($iframe => {
            expect($iframe.contents().find('body')).to.exist;
        })
        .then(iframe => {
            return iframe.contents().find('body');
        });
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
    const traverseIframes = (index = 0) => {
        if (index >= iframeSelectors.length) {
            // Reached the deepest iframe, perform the action
            actionCallback();
            return;
        }

        const selector = iframeSelectors[index];

        cy.log(`Current iframe selector: ${selector}`); // Log the current selector

        cy.get(selector).should("exist").then(() => {
            cy.get(selector).then(($iframe) => {
                const contentDocument = $iframe.prop("contentDocument");

                if (contentDocument) {
                    // If the contentDocument exists, traverse the iframe
                    cy.wrap(contentDocument).then(() => {
                        traverseIframes(index + 1);
                    });
                } else {
                    // Retry if contentDocument is null
                    cy.wait(100).then(() => {
                        traverseIframes(index);
                    });
                }
            });
        });
    };

    // Start traversal from the first iframe
    traverseIframes(0);

});

