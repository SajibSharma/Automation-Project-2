import { issueCreationMessage, taskDetails, taskTitle } from "../constants";
import {
  backlogListSelector,
  timeInputField,
  trackingModalSelector,
  stopwatchButton,
} from "../pages/selectors";

const initialEstimation = "10";
const updatedEstimation = "20";
const initialLogTime = "2";
const remainingLogTime = "5";
const newLogTime = "3";
const newRemainingTime = "4";

const estimationText = "h estimated";
const logText = "h logged";
const remainingText = "h remaining";

const showNoLoggedTime = true;
const hideEstimatedTime = false;

describe('"Issue Time-tracking Test Suite"', () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board?modal-issue-create=true");

        // Create new issue for time tracking
        cy.get('[data-testid="modal:issue-create"]').within(() => {
          cy.get('[data-testid="select:type"]').click();
          cy.get('[data-testid="select-option:Bug"]').click();
          cy.get(".ql-editor").type(taskDetails);
          cy.get('input[name="title"]').type(taskTitle);
          selectReporterBabyYoda();
          cy.get('[data-testid="select:userIds"]').click();
          cy.get('[data-testid="select-option:Lord Gaben"]').click();
          cy.get('button[type="submit"]').click();
        });

        cy.contains(issueCreationMessage).should("be.visible");
        cy.get(backlogListSelector)
          .should("be.visible")
          .contains(taskTitle)
          .click();
      });
  });

  it("Should add, edit, and remove the time estimate successfully", () => {
    validateNoLoggedTime(showNoLoggedTime);
    cy.get(timeInputField).type(initialEstimation);
    cy.get(timeInputField).should("have.value", initialEstimation);
    assertTimeLogged(initialEstimation, estimationText);

    cy.get(timeInputField).clear().type(updatedEstimation);
    cy.get(timeInputField).should("have.value", updatedEstimation);
    assertTimeLogged(updatedEstimation, estimationText);

    cy.get(timeInputField).click().clear();
    validateNoLoggedTime(showNoLoggedTime);
  });

  it("Should add and remove the time logging successfully", () => {
    const clearTimes = true;

    cy.get(timeInputField).type(initialEstimation);
    cy.get(timeInputField).should("have.value", initialEstimation);
    assertTimeLogged(initialEstimation, estimationText);

    // Logging time and remaining time, then validate
    accessTimeTrackingAndChangeTimes(initialLogTime, remainingLogTime);

    assertTimeLogged(initialLogTime, logText);
    assertTimeLogged(remainingLogTime, remainingText);
    assertTimeLogged(initialEstimation, estimationText, hideEstimatedTime);
    validateNoLoggedTime();

    // Update logged time and remaining time, then validate
    accessTimeTrackingAndChangeTimes(newLogTime, newRemainingTime);

    assertTimeLogged(newLogTime, logText);
    assertTimeLogged(newRemainingTime, remainingText);
    assertTimeLogged(initialEstimation, estimationText, hideEstimatedTime);
    validateNoLoggedTime();

    // Clear logged time and remaining time, then validate
    accessTimeTrackingAndChangeTimes(
      initialLogTime,
      remainingLogTime,
      clearTimes
    );

    assertTimeLogged(initialLogTime, logText, hideEstimatedTime);
    assertTimeLogged(remainingLogTime, remainingText, hideEstimatedTime);
    assertTimeLogged(initialEstimation, estimationText);
    validateNoLoggedTime(showNoLoggedTime);
  });
});

function assertTimeLogged(timeValue, expectedText, isVisible = true) {
  if (isVisible) {
    cy.contains(`${timeValue}${expectedText}`).should("be.visible");
  } else {
    cy.contains(`${timeValue}${expectedText}`).should("not.exist");
  }
}

function accessTimeTrackingAndChangeTimes(
  loggedTime,
  remainingTime,
  clearValues = false
) {
  cy.get(stopwatchButton).click();
  cy.get(trackingModalSelector)
    .should("be.visible")
    .within(() => {
      if (clearValues) {
        cy.get(timeInputField).eq(0).clear();
        cy.get(timeInputField).eq(1).clear();
      } else {
        cy.get(timeInputField).eq(0).type(loggedTime);
        cy.get(timeInputField).eq(1).type(remainingTime);
      }

      cy.contains("button", "Done").click();
    });

  cy.get(trackingModalSelector).should("not.exist");
}

function validateNoLoggedTime(shouldShow = false) {
  if (shouldShow) {
    cy.contains("No time logged").should("be.visible");
  } else {
    cy.contains("No time logged").should("not.exist");
  }
}

function selectReporterBabyYoda() {
  cy.get('[data-testid="select:reporterId"]').click();
  cy.get('[data-testid="select-option:Baby Yoda"]').click();
}
