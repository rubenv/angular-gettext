var tests = {
    "Should not break ng-click": function (file) {
        return function () {
            browser().navigateTo("/test/fixtures/click" + file + ".html");
            element("button#test1").click();
            expect(element("#field").text()).toBe("Success");
        };
    },

    "Should not break ng-click for translated strings": function (file) {
        return function () {
            browser().navigateTo("/test/fixtures/click" + file + ".html");
            element("button#test2").click();
            expect(element("#field").text()).toBe("Success");
        };
    },

    "Should compile ng-click": function (file) {
        return function () {
            browser().navigateTo("/test/fixtures/click" + file + ".html");
            element("#test3 button").click();
            expect(element("#field").text()).toBe("Success");
        };
    }
};

describe("Click", function () {
    for (var key in tests) {
        it(key, tests[key](""));
    }
});

describe("Click (no jQuery)", function () {
    for (var key in tests) {
        it(key, tests[key]("-nojquery"));
    }
});
