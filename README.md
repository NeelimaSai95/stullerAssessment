# Cypress E2E Assessment – Stuller

## Project Overview
This project automates a small E2E workflow on https://www.stuller.com using Cypress.

# Setup Instruction:
- Node.js (recommended: v18+)
- npm (comes with Node)
- Git (optional)


# How to run tests:

- Open Project in Visual Studio. 
- Ensure NPM installed or NPM Install
- cypress.env.json contain the environment variables.

  # To run test Open Terminal in VS Code
     - npx cypress open or  npx cypress run

- UI workflow coverage (search → product page → validations → cart flow)
- A debug-focused spec (fixing flaky selectors/assertions and improving stability)
- API -UI Contains the validations for UI and API.
- Reusable Cypress custom commands for common actions

# Framework design decisions:
- Login is executed before each test to reduce session-related failures and improve stability.
- Reusable custom Cypress commands were created to avoid duplicated logic.
- Selectors prefer stable attributes (data-test where available) instead of fragile DOM traversal.
- Hard waits were avoided where possible and replaced with Cypress retry-based assertions.
- Tests validate actual UI behavior rather than relying on assumptions or static values.


# Debugging explanation:

    ### Test Case 1
    - Removed static waits and relied on element-based page load validation.
    - Corrected price validation logic to ensure the value is numeric and greater than zero.
    - Updated ship date validation so the field must contain actual content, not just be visible.

    ### Test Case 2
    - Cart initially did not contain the expected quantity, so logic was added to update it correctly.
    - Fixed selector targeting for the Add to Cart button to ensure the correct element is triggered.
    - Adjusted input handling to validate and set the proper cart quantity value.
    - Removed unnecessary waits and replaced them with element-based synchronization.
    - Ensured login occurs before execution to prevent authentication-related failures.


## Assumptions & Future Improvements
- Test credentials are assumed to be valid and available via environment configuration.
- Product pricing and availability may vary dynamically, so validations focus on format and presence rather than fixed values.

    Future improvements could include:
    - Adding API interception to reduce UI timing dependency
    - Implementing session caching for faster execution
    - Expanding negative and edge case scenarios
    - Integrating CI pipeline execution
    - Creating a dedicated selector/page-object structure for scaling the framework




    