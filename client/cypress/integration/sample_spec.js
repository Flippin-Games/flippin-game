describe("My First Test", () => {
  it("Does not do much!", () => {
    expect(true).to.equal(true);
  });
});

describe("My First Test", () => {
  it("Visits the Kitchen Sink", () => {
    let roomId = 0;
    cy.visit("http://192.168.1.142:3000/admin");
    cy.contains("Hello Admin!");

    cy.contains("Generate Room").click();
    cy.get("#roomId").then(($span) => {
      roomId = $span.text();
      console.log(roomId);

      cy.visit("http://192.168.1.142:3000");
      cy.get("#name").should("be.visible").type("John Doe");
      cy.get("#room").should("be.visible").type(roomId);
      cy.get('button[type="submit"]').should("be.visible").click();

      cy.visit("http://192.168.1.142:3000");
      cy.get("#name").should("be.visible").type("John Doe 2");
      cy.get("#room").should("be.visible").type(roomId);
      cy.get('button[type="submit"]').should("be.visible").click();
    });
  });
});
