import HTTPRequest from "../util/HTTPRequest"

test("Format Get Request", () => {
    var result = HTTPRequest.formatGetRequest("url.com", {a:"one", b: 2});
    expect(result).toBe("url.com?a=one&b=2");
});
