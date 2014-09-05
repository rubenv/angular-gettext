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
        catalog.setStrings("pt-BR", {
            Hello: [{ Bull: "Olé", Person: "Olá" }]
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

    it("Should translate known strings according to translate context", function () {
        catalog.currentLanguage = "pt-BR";
        var el = $compile("<span>{{\"Hello\"|translate:{translateContext:'Bull'}}}</span>")($rootScope);
        $rootScope.$digest();
        assert.equal(el.text(), "Olé");
        el = $compile("<span>{{\"Hello\"|translate:{translateContext:'Person'}}}</span>")($rootScope);
        $rootScope.$digest();
        assert.equal(el.text(), "Olá");
        el = $compile("<span>{{\"Hello\"|translate}}</span>")($rootScope);
        $rootScope.$digest();
        assert.equal(el.text(), "Hello");
    });

    it("Can use filter in attribute values", function () {
        catalog.currentLanguage = "nl";
        var el = $compile("<input type=\"text\" placeholder=\"{{'Hello'|translate}}\" />")($rootScope);
        $rootScope.$digest();
        assert.equal(el.attr("placeholder"), "Hallo");
    });
});
