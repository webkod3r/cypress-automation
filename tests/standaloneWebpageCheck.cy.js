describe("Visit Webpage and Check DOM Element", () => {
  it("visits the webpage and checks for a DOM element", () => {
    // Visit the webpage
    cy.visit("https://univcell.com");

    // Check if a specific DOM element exists
    cy.get("h1").should("exist");
  });
});
