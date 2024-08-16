const LogSource = require("../lib/log-source");

describe("Log Source Behaviors", () => {
  test("It should synchronously drain a log source", () => {
    const source = new LogSource();
    let entry = source.pop();
    expect(new Date() > entry.date).toBeTruthy();
    expect(entry.msg).toBeTruthy();
    entry = source.pop();
    expect(new Date() > entry.date).toBeTruthy();
    expect(entry.msg).toBeTruthy();
    source.last.date = new Date();
    entry = source.pop();
    expect(entry).toBeFalsy();
  });

  test("It should asynchronously drain a log source", async () => {
    const source = new LogSource();
    let entry = await source.popAsync();
    expect(new Date() > entry.date).toBeTruthy();
    expect(entry.msg).toBeTruthy();
    entry = await source.popAsync();
    expect(new Date() > entry.date).toBeTruthy();
    expect(entry.msg).toBeTruthy();
    source.last.date = new Date();
    entry = await source.popAsync();
    expect(entry).toBeFalsy();
  });

  test("It should print in order ", ()=>{
    const mockSourceA = [
      { date: new Date("2021-01-04"), msg: "E" },
      { date: new Date("2021-01-03"), msg: "D" },
      { date: new Date("2021-01-01"), msg: "A" },
    ];
    const mockSourceB = [
      { date: new Date("2021-01-05"), msg: "F" },
      { date: new Date("2021-01-03"), msg: "C" },
      { date: new Date("2021-01-02"), msg: "B" },
    ];

    const printerMemory = [];

    const mockPrinter = {
      print: i => printerMemory.push(i),
      done: jest.fn()
    }

    const logSources = [
      {
        pop:(()=>mockSourceA.pop() || false)
      },
      {
        pop:(()=>mockSourceB.pop() || false)
      }
    ];

    require("../solution/sync-sorted-merge")(logSources, mockPrinter);

    expect(printerMemory[0].msg) === "A";
    expect(printerMemory[1].msg) === "B";
    expect(printerMemory[2].msg) === "D";
    expect(printerMemory[3].msg) === "E";
    expect(printerMemory[4].msg) === "C";
    expect(printerMemory[5].msg) === "F";

  })
});
