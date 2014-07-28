var tests = {
    "Should not allow XSS": function (file) {
        return function () {
            browser().navigateTo("/test/fixtures/xss" + file + ".html");
            expect(element("body").text()).not().toBe("fail");
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
