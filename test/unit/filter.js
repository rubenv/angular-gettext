describe("Filter", function () {
    var catalog;
    var $compile;
    var scope;

    beforeEach(module("gettext"));

    beforeEach(inject(function (_$rootScope_, _$compile_, gettextCatalog) {
        scope = _$rootScope_.$new();
        $compile = _$compile_;
        catalog = gettextCatalog;
        catalog.setStrings("nl", {
            Hello: "Hallo",
            "Hello {{name}}!": "Hallo {{name}}!",
            "One boat": ["Een boot", "$count boten"],
            Archive: { verb: "Archiveren", noun: "Archief", $$noContext: "Archief (no context)" }
        });
    }));

    it("Should have a translate filter", function () {
        var el = $compile("<h1>{{'Hello!'|translate}}</h1>")(scope);
        scope.$digest();
        assert.equal(el.text(), "Hello!");
    });

    it("Should translate known strings", function () {
        catalog.setCurrentLanguage("nl");
        var el = $compile("<span>{{'Hello'|translate}}</span>")(scope);
        scope.$digest();
        assert.equal(el.text(), "Hallo");
    });

    it("Can use filter in attribute values", function () {
        catalog.setCurrentLanguage("nl");
        var el = $compile('<input type="text" placeholder="{{\'Hello\'|translate}}" />')(scope);
        scope.$digest();
        assert.equal(el.attr("placeholder"), "Hallo");
    });

    describe("translatePlural", function () {

        // not sure why you'd want to do this, but it's a good test case
        it("Should work if n is a number", function () {
            catalog.setCurrentLanguage("nl");
            var el = $compile("<span>{{'One boat' | translatePlural:2:'$count boten' | translate}}</span>")(scope);
            scope.$digest();
            assert.equal(el.text(), "2 boten");
        });

        it("Should work if n is a reference", function () {
            catalog.setCurrentLanguage("nl");
            scope.count = 2;
            var el = $compile("<span>{{'One boat' | translatePlural:count:'$count boten' | translate}}</span>")(scope);
            scope.$digest();
            assert.equal(el.text(), "2 boten");

            scope.count = 1;
            el = $compile("<span>{{'One boat' | translatePlural:count:'$count boten' | translate}}</span>")(scope);
            scope.$digest();
            assert.equal(el.text(), "Een boot");
        });

        it("Should work if it precedes translateContext", function () {
            catalog.setCurrentLanguage("nl");
            catalog.setStrings("nl", {
                "One boat": { c1: ["Een boot1", "$count boten1"], c2: ["Een boot", "$count boten"] }
            });

            scope.count = 2;
            var el = $compile("<span>{{'One boat' | translatePlural:count:'$count boten' | translateContext:'c2' | translate}}</span>")(scope);
            scope.$digest();
            assert.equal(el.text(), "2 boten");
        });
    });

    describe("translateContext", function () {
        it("Should translate known strings according to translateContext", function () {
            catalog.setCurrentLanguage("nl");
            var el = $compile("<span>{{'Archive' | translateContext:'verb' | translate}}</span>")(scope);
            scope.$digest();
            assert.equal(el.text(), "Archiveren");

            el = $compile("<span>{{'Archive' | translateContext:'noun' | translate}}</span>")(scope);
            scope.$digest();
            assert.equal(el.text(), "Archief");
        });

        it("Should work with no args", function () {
            // translateContext with no args is the same as translate
            catalog.setCurrentLanguage("nl");
            var el = $compile("<span>{{'Archive' | translateContext | translate}}</span>")(scope);
            scope.$digest();

            assert.equal(el.text(), "Archief (no context)");
            el = $compile("<span>{{'Archive' | translate }}</span>")(scope);
            scope.$digest();
            assert.equal(el.text(), "Archief (no context)");
        });

        it("Should work if it precedes translatePlural", function () {
            catalog.setCurrentLanguage("nl");
            catalog.setStrings("nl", {
                "One boat": { c1: ["Een boot1", "$count boten1"], c2: ["Een boot", "$count boten"] }
            });

            scope.count = 2;
            var el = $compile("<span>{{'One boat' | translateContext:'c2' | translatePlural:count:'$count boten' | translate}}</span>")(scope);
            scope.$digest();
            assert.equal(el.text(), "2 boten");
        });
    });
});
