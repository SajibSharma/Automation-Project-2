const issueSummary = "This is an issue of type: Task.";

describe("Issue Deletion+Cancellation Tests", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("include", "/project")
      .then((url) => {
        cy.visit(`${url}/board`);
        cy.get('[data-testid="board-list:backlog"]')
          .contains(issueSummary)
          .click();
      });
  });

  it("Should delete an issue and validate it is no longer visible", () => {
    const initialIssueCount = 4;

    cy.get('[data-testid="modal:issue-details"]').should("be.visible");
    cy.get('[data-testid="icon:trash"]')
      .should("be.visible")
      .trigger("mouseover")
      .trigger("click");
    cy.get('[data-testid="modal:confirm"]').should("be.visible");

    cy.contains("Are you sure you want to delete this issue?").should(
      "be.visible"
    );
    cy.contains("Once you delete, it's gone for good").should("be.visible");
    cy.get('[data-testid="modal:confirm"]').contains("Delete issue").click();
    cy.get('[data-testid="modal:issue-details"]').should("not.exist");
    cy.get('[data-testid="modal:confirm"]').should("not.exist");

    cy.get('[data-testid="board-list:backlog"]')
      .should("be.visible")
      .and("have.length", "1")
      .within(() => {
        cy.get('[data-testid="list-issue"]')
          .should("have.length", "3")
          .first()
          .should("not.have.text", "This is an issue of type: Task.");
      });
  });

  it("Should cancel the issue deletion and validate it is still visible", () => {
    const initialIssueCount = 4;

    cy.get('[data-testid="modal:issue-details"]').should("be.visible");
    cy.get('[data-testid="icon:trash"]').click();
    cy.get('[data-testid="modal:confirm"]').should("be.visible");

    cy.contains("Are you sure you want to delete this issue?").should(
      "be.visible"
    );
    cy.get('[data-testid="modal:confirm"]').contains("Cancel").click();
    cy.get('[data-testid="modal:confirm"]').should("not.exist");
    cy.get('[data-testid="modal:issue-details"]')
      .should("exist")
      .within(() => {
        cy.get('[data-testid="icon:close"]')
          .first()
          .should("be.visible")
          .click();
      });

    cy.get('[data-testid="board-list:backlog"]')
      .should("be.visible")
      .and("have.length", "1")
      .within(() => {
        cy.get('[data-testid="list-issue"]')
          .should("have.length", "4")
          .first()
          .should("have.text", "This is an issue of type: Task.");
      });
  });
});
