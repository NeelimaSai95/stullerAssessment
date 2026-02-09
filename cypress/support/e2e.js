import "./commands";

Cypress.on("uncaught:exception", (err) => {
  const msg = err.message || "";
  if (
    msg.includes("Failed to execute 'removeChild' on 'Node'") ||
    msg.includes("getBoundingClientRect")
  ) {
    return false; // ignore known site flake
  }
  return true;
});
