/**
 /* This is an example file and approach for POM in Cypress.
 Add following method to IssueModal.js file

 * validateNrOfIssues(amountOfIssues) {
    cy.get('[data-testid="board-list:backlog"]').within(() => {
      cy.get('[data-testid="list-issue"]').should(
        "have.length",
        amountOfIssues
      );
    });
 */

import IssueModal from "../../pages/IssueModal";
const issueTitle = "This is an issue of type: Task.";
const expectedAmountofIssuesDlt = 3;
const expectedAmountofIssuesCncl = 4;
let isVisible = true;

describe("Issue delete", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.contains(issueTitle).click();
      });
  });

  //Test case 1
  it("Should delete issue successfully", () => {
    IssueModal.clickDeleteButton();
    IssueModal.confirmDeletion();
    IssueModal.validateIssueVisibilityState(issueTitle, !isVisible);
    IssueModal.validateNrOfIssues(expectedAmountofIssuesDlt);
  });

  //Test case 2
  it("Should cancel deletion process successfully", () => {
    IssueModal.clickDeleteButton();
    IssueModal.cancelDeletion();
    IssueModal.closeDetailModal();
    IssueModal.ensureIssueIsVisibleOnBoard(issueTitle, isVisible);
    IssueModal.validateNrOfIssues(expectedAmountofIssuesCncl);
  });
});
