describe("Visit Catholic Webpage and Check DOM Element", () => {
  let targetChatID, isDebug;

  before(() => {
    // Access environment variable to get the target chat ID from variables
    targetChatID = Cypress.env("TARGET_CHAT_ID");
    isDebug = Cypress.env("DEBUG");
  });

  it("visits the webpage and checks for a DOM element", () => {
    cy.visit(
      "https://cccfl.as.me/schedule.php?location=1771+N.+Semoran+Blvd%2C+Orlando+FL+32807"
    );

    const date = new Date();
    // Take a screenshot of a specific element
    cy.get("#step-pick-appointment").screenshot(
      date.getTime() + "-appointment-screenshot"
    );

    // Check if a specific DOM element exists
    // Select the element and hold it in a variable
    cy.get("#no-times-available-message").as("apptSlot");

    cy.get("@apptSlot").then(($element) => {
      if ($element) {
        cy.log("No appointment times");
        // the following task is just for testing and we can remove
        if (isDebug) {
          cy.task("telegramNotification", {
            chatID: targetChatID,
            message: "Testing!!!",
          }).then((response) => {
            expect("message_id" in response).to.be.true;
          });
        }
      } else {
        cy.log("Hurry up, new appointment times available!!!");
        cy.task("telegramNotification", {
          chatID: targetChatID,
          message: "*Hurry Apurate!!!*, hay nuevas citas disponibles.",
        }).then((response) => {
          // response is the telegram message response
          expect("message_id" in response).to.be.true;
          cy.log("Message ID " + response.message_id);
        });
      }
    });
  });
});
