describe("Filter", function () {
    var catalog = null;
    var $rootScope = null;
    var $compile = null;

    beforeEach(module("gettext"));

    beforeEach(inject(function ($injector, gettextCatalog) {
        $rootScope = $injector.get("$rootScope");
        $compile = $injector.get("$compile");
        catalog = gettextCatalog;
        catalog.setStrings("nl", {
            Hello: "Hallo",
            "Hello {{name}}!": "Hallo {{name}}!",
            "One boat": ["Een boot", "{{count}} boten"]
        });
    }));

    it("Should have a translate filter", function () {
        var el = $compile("<h1>{{\"Hello!\"|translate}}</h1>")($rootScope);
        $rootScope.$digest();
        assert.equal(el.text(), "Hello!");
    });

    it("Should translate known strings", function () {
        catalog.currentLanguage = "nl";
        var el = $compile("<span>{{\"Hello\"|translate}}</span>")($rootScope);
        $rootScope.$digest();
        assert.equal(el.text(), "Hallo");
    });

    it("Can use filter in attribute values", function () {
        catalog.currentLanguage = "nl";
        var el = $compile("<input type=\"text\" placeholder=\"{{'Hello'|translate}}\" />")($rootScope);
        $rootScope.$digest();
        assert.equal(el.attr("placeholder"), "Hallo");
    });
});

describe("Filter: translatePlural", function () {
    var catalog = null;
    var $rootScope = null;
    var $compile = null;

    beforeEach(module("gettext"));

    beforeEach(inject(function ($injector, gettextCatalog) {
        $rootScope = $injector.get("$rootScope");
        $compile = $injector.get("$compile");
        catalog = gettextCatalog;
        catalog.setStrings("nl", {
            Hello: "Hallo",
            "Hello {{name}}!": "Hallo {{name}}!",
            "One boat": ["Een boot", "{} boten"]
        });

        $rootScope.n = 1;
    }));

    it("Should have a translatePlural filter", function () {
        var el = $compile("<h1>{{\"One boat\"|translatePlural:n:\"{} boats\"}}</h1>")($rootScope);
        $rootScope.$digest();
        assert.equal(el.text(), "One boat");

        $rootScope.n = 2;
        $rootScope.$digest();
        assert.equal(el.text(), "2 boats");
    });

    it("Should translate known strings", function () {
        catalog.currentLanguage = "nl";
        var el = $compile("<span>{{\"One boat\"|translatePlural:n:\"{} boten\"}}</span>")($rootScope);
        $rootScope.$digest();
        assert.equal(el.text(), "Een boot");

        $rootScope.n = 2;
        $rootScope.$digest();
        assert.equal(el.text(), "2 boten");
    });

    it("Can use filter in attribute values", function () {
        catalog.currentLanguage = "nl";
        var el = $compile("<input type=\"text\" placeholder=\"{{'One boat'|translatePlural:n:'{} boten'}}\" />")($rootScope);
        $rootScope.$digest();
        assert.equal(el.attr("placeholder"), "Een boot");

        $rootScope.n = 2;
        $rootScope.$digest();
        assert.equal(el.attr("placeholder"), "2 boten");
    });
});
