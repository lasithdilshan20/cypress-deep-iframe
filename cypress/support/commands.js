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
            actionCallback();
            return;
        }
        const selector = iframeSelectors[index];
        cy.log(`Current iframe selector: ${selector}`); // Log the current selector

        cy.get(selector)
            .its('0.contentDocument.body').should('not.be.undefined') // Wait for iframe to load
            .then((iframeBody) => {
                cy.wrap(iframeBody).within(() => traverseIframes(index + 1));
            });
    };

    traverseIframes(0);
});

Cypress.Commands.add('traverseToIframeContainingElement', (iframeSelectors, targetSelector, actionCallback) => {
    const traverseIframes = (index = 0) => {
        if (index >= iframeSelectors.length) {
            return;
        }
        const selector = iframeSelectors[index];
        cy.log(`Current iframe selector: ${selector}`); // Log the current selector

        cy.get(selector).its('0.contentDocument.body').should('not.be.undefined').then(iFrameBody=> {
            cy.log(`Current iframe element: ${iFrameBody}`);
            cy.wrap(iFrameBody).within(() => {
                cy.log(`Current iframe Wrapped Body: ${cy.wrap(iFrameBody).toString()}`);
                cy.log(`Current iframe Wrapped Body: ${cy.wrap(iFrameBody).find(targetSelector).toString()}`);
                if (cy.wrap(iFrameBody).find(targetSelector).length > 0) {
                    cy.log(`Found target element ${targetSelector} inside iframe ${selector}`)
                    actionCallback();
                } else {
                    cy.get(selector).its('0.contentDocument.body').should('not.be.undefined') // Wait for iframe to load
                        .then((iframeBody) => {
                            // Switch context to iframe, and recursively call traverseIframes function for next level
                            cy.wrap(iframeBody).within(() => traverseIframes(index + 1));
                        });
                    cy.log(`Did not find target element ${targetSelector} inside iframe ${selector}`)
                }
            });
        })
    };
    traverseIframes(0);
});

Cypress.Commands.add("traverseToIframeWithinElements", (iframeSelectors, targetSelector, actionCallback) => {
    let traverseIframes = (index = 0) => {
        if (index >= iframeSelectors.length) {
            return cy.wrap(false);
        }
        const selector = iframeSelectors[index];
        return cy.get(selector).then(($selector) => {
            if($selector.length) {
                return cy.window({ log: true }).its('document').then((document) => {
                    const iFrameBody = document.querySelector(selector).contentDocument.body;
                    if(iFrameBody) {
                        return cy.wrap(iFrameBody).within(() => {
                            cy.get(targetSelector).then(($el) => {
                                if($el.length) {
                                    actionCallback();
                                    return cy.wrap(true);
                                } else {
                                    return traverseIframes(index + 1);
                                }
                            });
                        });
                    } else {
                        cy.log(`Iframe body is not available for iframe with selector ${selector}`);
                        return traverseIframes(index + 1);
                    }
                });
            } else {
                cy.log(`Did not find iframe with selector ${selector}`);
                return traverseIframes(index + 1);
            }
        });
    };
    return traverseIframes(0);
});