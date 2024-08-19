//1st method
describe("Issue comments creating, editing and deleting", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });

  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');

  it("Should create a comment successfully", () => {
    const comment = "TEST_COMMENT";

    getIssueDetailsModal().within(() => {
      cy.contains("Add a comment...").click();

      cy.get('textarea[placeholder="Add a comment..."]').type(comment);

      cy.contains("button", "Save").click().should("not.exist");

      cy.contains("Add a comment...").should("exist");
      cy.get('[data-testid="issue-comment"]').should("contain", comment);
    });
  });

  it("Should edit a comment successfully", () => {
    const previousComment = "An old silent pond...";
    const comment = "TEST_COMMENT_EDITED";

    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="issue-comment"]')
        .first()
        .contains("Edit")
        .click()
        .should("not.exist");

      cy.get('textarea[placeholder="Add a comment..."]')
        .should("contain", previousComment)
        .clear()
        .type(comment);

      cy.contains("button", "Save").click().should("not.exist");

      cy.get('[data-testid="issue-comment"]')
        .should("contain", "Edit")
        .and("contain", comment);
    });
  });

  it("Should delete a comment successfully", () => {
    getIssueDetailsModal()
      .find('[data-testid="issue-comment"]')
      .contains("Delete")
      .click();

    cy.get('[data-testid="modal:confirm"]')
      .contains("button", "Delete comment")
      .click()
      .should("not.exist");

    getIssueDetailsModal()
      .find('[data-testid="issue-comment"]')
      .should("not.exist");
  });
});

//2nd method
describe("Creating, editing, and deleting comment", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });

  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');
  const commentInputField = () =>
    cy.get('textarea[placeholder="Add a comment..."]');
  const savedCommentSection = () => cy.get('[data-testid="issue-comment"]');
  const saveCommentButton = () =>
    cy.contains("button", "Save").click().should("not.exist");
  const editCommentButton = () =>
    cy.contains("Edit").click().should("not.exist");
  const deleteCommentButton = () => cy.contains("button", "Delete");
  const deletionConfirmationDialog = () =>
    cy.get('[data-testid="modal:confirm"]');

  it("Creating, editing, and deleting comment", () => {
    const comment = "Original comment";
    const newComment = "New comment";

    //Creating a comment:
    getIssueDetailsModal().within(() => {
      cy.contains("Add a comment...").type(comment);
      saveCommentButton().wait(6000);
      savedCommentSection()
        .should("have.length", "2")
        .first()
        .should("contain", comment);

      //Editing the comment:
      savedCommentSection()
        .first()
        .within(() => {
          editCommentButton();
        });
      commentInputField().should("contain", comment).clear().type(newComment);
      saveCommentButton();
      savedCommentSection()
        .should("have.length", "2")
        .first()
        .should("contain", newComment)
        .and("not.contain", comment);
    });
    //Deleting the comment:
    savedCommentSection().first().contains("Delete").click();
    deletionConfirmationDialog().should(
      "contain",
      "Are you sure you want to delete this comment?"
    );
    deleteCommentButton().click().wait(5000);
    savedCommentSection()
      .should("have.length", "1")
      .should("not.contain", newComment)
      .and("not.contain", comment);
  });
});
