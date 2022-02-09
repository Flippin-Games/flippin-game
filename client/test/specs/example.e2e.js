describe("My first test", () => {
  it("should login with valid credentials", async () => {
    await browser.url("/admin");
    await browser.saveScreenshot("./here.png");
    await $("button").click();
    const id = await $("#roomId").getText();
    await browser.saveScreenshot("./here2.png");
    await browser.url("/");
    await browser.saveScreenshot("./here3.png");
    const name = $("#name");
    await name.setValue("Nika");
    const room = $("#room");
    await room.setValue(id);
    await browser.saveScreenshot("./here4.png");
    await $("button").click();
    await browser.saveScreenshot("./here5.png");
  });
});
