describe("String loading", function () {
    var catalog = null;
    var $httpBackend = null;

    beforeEach(module("gettext"));
    beforeEach(inject(function ($injector) {
        catalog = $injector.get("gettextCatalog");
        $httpBackend = $injector.get("$httpBackend");
    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("Will load remote strings", function () {
        catalog.loadRemote("/strings/nl.json");
        $httpBackend.expectGET("/strings/nl.json").respond(200);
        $httpBackend.flush();
    });

    it("Will set the loaded strings in the default textdomain", function () {
        catalog.loadRemote("/strings/nl.json");
        $httpBackend.expectGET("/strings/nl.json").respond(200, {
            nl: {
                Hello: "Hallo"
            }
        });
        $httpBackend.flush();
        assert.notEqual(void 0, catalog.strings.nl["default"]);
    });

    it("Will set the loaded strings in a specified textdomain", function () {
        catalog.loadRemote("/strings/nl.json", "testDomain");
        $httpBackend.expectGET("/strings/nl.json").respond(200, {
            nl: {
                Hello: "Hallo"
            }
        });
        $httpBackend.flush();
        assert.notEqual(void 0, catalog.strings.nl.testDomain);
    });

    it("Gracefully handles failure", function () {
        catalog.loadRemote("/strings/nl.json");
        $httpBackend.expectGET("/strings/nl.json").respond(404);
        $httpBackend.flush();
    });

    it("Returns a promise", function () {
        var called;
        called = false;
        catalog.loadRemote("/strings/nl.json").then(function () {
            called = true;
        });
        $httpBackend.expectGET("/strings/nl.json").respond(200);
        $httpBackend.flush();
        assert(called);
    });

    it("Returns a promise (failure)", function () {
        var successCalled = false;
        var failedCalled = false;
        var promise = catalog.loadRemote("/strings/nl.json");
        function success() {
            successCalled = true;
        }
        function failed() {
            failedCalled = true;
        }
        promise.then(success, failed);
        $httpBackend.expectGET("/strings/nl.json").respond(404);
        $httpBackend.flush();
        assert(!successCalled);
        assert(failedCalled);
    });

    it("Caches strings", function () {
        catalog.loadRemote("/strings/nl.json");
        $httpBackend.expectGET("/strings/nl.json").respond(200, {
            nl: {
                Hello: "Hallo"
            }
        });
        $httpBackend.flush();
        catalog.loadRemote("/strings/nl.json");
        $httpBackend.verifyNoOutstandingRequest();
    });
});
