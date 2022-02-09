describe("My first test", () => {
  it("should login with valid credentials", async () => {
    // admin
    await browser.url("http://localhost:3000/admin");
    await browser.saveScreenshot("./here.png");
    await $("button").click();
    const id = await $("#roomId").getText();
    await browser.saveScreenshot("./here2.png");

    // get into game
    await browser.newWindow("/");
    await browser.saveScreenshot("./here3.png");
    const name = $("#name");
    await name.setValue("Nika");
    const room = $("#room");
    await room.setValue(id);
    await browser.saveScreenshot("./here4.png");
    await $("button").click();
    await browser.saveScreenshot("./here5.png");
    await browser.pause(2000);

    // back to admin
    await browser.switchWindow("http://localhost:3000/admin");
    await browser.pause(2000);
    await browser.saveScreenshot("./here6.png");
  });
});
