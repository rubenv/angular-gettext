var tests = {
    "Should not break ng-click": function (file) {
        return function () {
            browser.get("http://localhost:9000/test/fixtures/click" + file + ".html");
            element(by.css("button#test1")).click();
            expect(element(by.css("#field")).getText()).toBe("Success");
        };
    },

    "Should not break ng-click for translated strings": function (file) {
        return function () {
            browser.get("http://localhost:9000/test/fixtures/click" + file + ".html");
            element(by.css("button#test2")).click();
            expect(element(by.css("#field")).getText()).toBe("Success");
        };
    },

    "Should compile ng-click": function (file) {
        return function () {
            browser.get("http://localhost:9000/test/fixtures/click" + file + ".html");
            element(by.css("#test3 button")).click();
            expect(element(by.css("#field")).getText()).toBe("Success");
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
