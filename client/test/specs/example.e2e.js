describe("My first test", () => {
  it("should login with valid credentials", async () => {
    // admin
    await browser.url("http://localhost:3000/admin");
    await browser.pause(2000);
    await browser.saveScreenshot("./here.png");
    await $("button").click();
    const id = await $("#roomId").getText();
    await browser.saveScreenshot("./here2.png");
    await browser.pause(1000);

    // get into game
    await browser.newWindow("/");
    await browser.pause(2000);
    await browser.saveScreenshot("./here3.png");
    const name = $("#name");
    await name.setValue("Nika");
    const room = $("#room");
    await room.setValue(id);
    await browser.saveScreenshot("./here4.png");
    await browser.pause(1500);
    await $("button").click();
    await browser.saveScreenshot("./here5.png");
    await browser.pause(2000);

    // user 2
    await browser.newWindow("/");
    await browser.pause(2000);
    const name2 = $("#name");
    await name2.setValue("Sonny");
    const room2 = $("#room");
    await room2.setValue(id);
    await browser.pause(1500);
    await $("button").click();
    await browser.pause(2000);

    // back to admin
    await browser.switchWindow("http://localhost:3000/admin");
    await browser.pause(2000);
    await $("button").click();
    await browser.pause(2000);

    const handles = await browser.getWindowHandles();
    await browser.saveScreenshot("./here6.png");
    await browser.switchToWindow(handles[1]);
    await browser.pause(1500);
    await $("button").click();
    await browser.pause(3000);
    await $("button").click();
    await browser.pause(3000);
    await $("button").click();
    await browser.pause(3000);
    await $("button").click();
    await browser.pause(3000);
    await $("button").click();
    await browser.pause(3000);
    await browser.switchToWindow(handles[2]);
    await browser.pause(3000);
    await $("button").click();
    await browser.pause(6000);
  });
});
