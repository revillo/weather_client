import HTTPRequest from "../util/HTTPRequest"

test("Format get requests properly", () => {
    var result = HTTPRequest.formatGetRequest("url.com", {a:"one", b: 2});
    expect(result).toBe("http://url.com?a=one&b=2");
});
