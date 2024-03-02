
# Cypress Nested Iframe Interaction Example

This example demonstrates how to interact with elements within nested iframes using Cypress. The test script navigates through multiple levels of iframes to interact with input fields.

## Overview

The test performs the following actions:

1. Visits a specific page that contains nested iframes.
2. Traverses to an iframe within a list of elements and types a message into an input field (`input#inputFieldL1`).
3. Traverses deeper into nested iframes to find another input field (`input#inputFieldL3`) and types a message into it.

## Test Script

The core of the test script is outlined below:

```javascript
describe('Nested Iframe Interaction', () => {
    it('should interact with elements within nested iframes', () => {
        cy.visit('cypress/html/index.html');

        // Traverse to an iframe within a list of elements
        cy.collectIframeSelectors().then((iframeSelectors) => {
            cy.traverseToIframeWithinElements(iframeSelectors, 'input#inputFieldL1', () => {
                cy.get('input#inputFieldL1').type("Hello iFrame 1");
            });
        });

        // Traverse to the deepest iframe within a list of elements
        cy.collectIframeSelectors().then((iframeSelectors) => {
            cy.traverseDeepIframe(iframeSelectors, () => {
                cy.get('input#inputFieldL3').type("Hello iFrame 3");
            });
        });
    });
});
```

## Setup

To run this example, make sure you have Cypress installed in your project. You may need to implement or install additional commands or utilities (`collectIframeSelectors`, `traverseToIframeWithinElements`, `traverseDeepIframe`) used in this script for iframe traversal, as these are not standard Cypress commands.

## Running the Test

To run the test, execute the following command in your terminal:

```
npx cypress open
```

Then, select the test file from the Cypress Test Runner UI.

## Conclusion

This example illustrates a method to interact with elements inside nested iframes using Cypress, showcasing the flexibility and power of Cypress for testing complex web applications.

