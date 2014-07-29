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
