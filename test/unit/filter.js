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
            "One boat": ["Een boot", "{{count}} boten"],
            Archive: { verb: "Archiveren", noun: "Archief", $$noContext: "Archief (no context)" }
        });
    }));

    it("Should have a translate filter", function () {
        var el = $compile("<h1>{{\"Hello!\"|translate}}</h1>")($rootScope);
        $rootScope.$digest();
        assert.equal(el.text(), "Hello!");
    });

    it("Should translate known strings", function () {
        catalog.setCurrentLanguage("nl");
        var el = $compile("<span>{{\"Hello\"|translate}}</span>")($rootScope);
        $rootScope.$digest();
        assert.equal(el.text(), "Hallo");
    });

    it("Should translate known strings according to translate context", function () {
        catalog.setCurrentLanguage("nl");
        var el = $compile("<span>{{\"Archive\"|translate:'verb'}}</span>")($rootScope);
        $rootScope.$digest();
        assert.equal(el.text(), "Archiveren");
        el = $compile("<span>{{\"Archive\"|translate:'noun'}}</span>")($rootScope);
        $rootScope.$digest();
        assert.equal(el.text(), "Archief");
        el = $compile("<span>{{\"Archive\"|translate}}</span>")($rootScope);
        $rootScope.$digest();
        assert.equal(el.text(), "Archief (no context)");
    });

    it("Can use filter in attribute values", function () {
        catalog.setCurrentLanguage("nl");
        var el = $compile("<input type=\"text\" placeholder=\"{{'Hello'|translate}}\" />")($rootScope);
        $rootScope.$digest();
        assert.equal(el.attr("placeholder"), "Hallo");
    });
});
