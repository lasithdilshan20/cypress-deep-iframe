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
    function collectSelectors($el) {
        const iframes = $el.find('iframe');
        let selectors = [];
        iframes.each(function () {
            const id = this.id ? `#${this.id}` : '';
            const cls = this.className ? `.${this.className.split(' ')[0]}` : '';
            selectors.push(id || cls);

            const iframeBody = this.contentWindow.document.body;
            selectors = selectors.concat(collectSelectors(Cypress.$(iframeBody)));
        });
        return selectors;
    }

    return cy.get(rootElement).then($root => {
        return cy.wrap(collectSelectors($root));
    });
});

Cypress.Commands.add('traverseDeepIframe', (iframeSelectors, actionCallback) => {
    const traverseIframes = (index = 0) => {
        if (index >= iframeSelectors.length) {
            // Reached the deepest iframe, perform the action
            actionCallback();
            return;
        }
        const selector = iframeSelectors[index];
        cy.log(`Current iframe selector: ${selector}`); // Log the current selector

        cy.get(selector)
            .its('0.contentDocument.body').should('not.be.undefined') // Wait for iframe to load
            .then((iframeBody) => {
                // Switch context to iframe, and recursively call traverseIframes function for next level
                cy.wrap(iframeBody).within(() => traverseIframes(index + 1));
            });
    };

    // Start traversal from the 1st iframe
    traverseIframes(0);
});

Cypress.Commands.add('traverseToIframeContainingElement', (iframeSelectors, targetSelector, actionCallback) => {
    const traverseIframes = (index = 0) => {
        if (index >= iframeSelectors.length) {
            return;
        }
        const selector = iframeSelectors[index];
        cy.log(`Current iframe selector: ${selector}`); // Log the current selector

        cy.get(`${selector} ${targetSelector}`).then(($target) => {
            if ($target.length > 0) {
                // Found the target element, perform the action.
                actionCallback();
            } else {
                // Element not found inside the current iframe, move on to the next.
                cy.get(selector).its('0.contentDocument.body').should('not.be.undefined') // Wait for iframe to load
                    .then((iframeBody) => {
                        // Switch context to iframe, and recursively call traverseIframes function for next level
                        cy.wrap(iframeBody).within(() => traverseIframes(index + 1));
                    });
            }
        });
    };

    // Start traversal from the 1st iframe
    traverseIframes(0);
});