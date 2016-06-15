var tests = {
    "Should not allow XSS": function (file) {
        return function () {
            browser.get("http://localhost:9000/test/fixtures/xss" + file + ".html");
            expect(element(by.css("body")).getText()).not.toBe("fail");
        };
    }
};

describe("XSS", function () {
    for (var key in tests) {
        it(key, tests[key](""));
    }
});

describe("XSS (no jQuery)", function () {
    for (var key in tests) {
        it(key, tests[key]("-nojquery"));
    }
});
