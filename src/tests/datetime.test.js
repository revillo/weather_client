import DateTime from "../util/datetime"

test("Moment.js returns correct time", () => {
    const m = DateTime.momentFromUnix(1599588000, "America/Chicago");
    expect(m.format("MMMM Do YYYY, ddd, h:mm a")).toBe("September 8th 2020, Tue, 1:00 pm");
});
