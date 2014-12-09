describe("Filter", function () {
    var catalog;
    var filter;
    var $rootScope;
    var $compile;
    var $injector;

    beforeEach(module("gettext"));

    beforeEach(inject(function (_$injector_, gettextCatalog, translateFilter) {
        $injector = _$injector_;
        $rootScope = $injector.get("$rootScope");
        $compile = $injector.get("$compile");
        filter = translateFilter;
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
        var el = $compile("<span>{{'Archive' | translate:'{context:\"verb\"}'}}</span>")($rootScope);
        $rootScope.$digest();
        assert.equal(el.text(), "Archiveren");
        el = $compile("<span>{{'Archive' | translate:'{context:\"noun\"}'}}</span>")($rootScope);
        $rootScope.$digest();
        assert.equal(el.text(), "Archief");
        el = $compile("<span>{{'Archive' | translate}}</span>")($rootScope);
        $rootScope.$digest();
        assert.equal(el.text(), "Archief (no context)");
    });

    it("Should support passing object directly to filter", function () {
        catalog.setCurrentLanguage("nl");
        assert.equal(filter("Archive", { context: "verb" }), "Archiveren");
    });

    it("Can use filter in attribute values", function () {
        catalog.setCurrentLanguage("nl");
        var el = $compile("<input type=\"text\" placeholder=\"{{'Hello'|translate}}\" />")($rootScope);
        $rootScope.$digest();
        assert.equal(el.attr("placeholder"), "Hallo");
    });

    describe("plurals", function () {
        it("Should work if n is a number", function () {
            catalog.setCurrentLanguage("nl");
            var scope = $rootScope.$new();

            assert.equal(filter("Een boot", { plural: "{{$count}} boten", n: 2, scope: scope }), "2 boten");
            assert.equal(filter("Een boot", { plural: "{{$count}} boten", n: 1, scope: scope }), "Een boot");
        });

        it("Should work if n is an expression string", function () {
            catalog.setCurrentLanguage("nl");
            var scope = $rootScope.$new();

            scope.count = 2;
            $rootScope.$digest();
            assert.equal(filter("Een boot", { plural: "{{$count}} boten", n: "count", scope: scope }), "2 boten");

            scope.count = 1;
            $rootScope.$digest();
            assert.equal(filter("Een boot", { plural: "{{$count}} boten", n: "count", scope: scope }), "Een boot");
        });
    });

});
