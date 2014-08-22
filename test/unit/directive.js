describe("Directive", function () {
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
        catalog.setStrings("af", {
            "This link: <a class=\"extra-class\" ng-href=\"{{url}}\">{{url}}</a> will have the 'ng-binding' class attached before the translate directive can capture it.": "Die skakel: <a ng-href=\"{{url}}\">{{url}}</a> sal die 'ng-binding' klass aangevoeg hê voor die translate directive dit kan vasvat."
        });
    }));

    it("Should return string unchanged when no translation is available", function () {
        var el = $compile("<div><h1 translate>Hello!</h1></div>")($rootScope);
        $rootScope.$digest();
        assert.equal(el.text(), "Hello!");
    });

    it("Should translate known strings", function () {
        catalog.currentLanguage = "nl";
        var el = $compile("<div><h1 translate>Hello</h1></div>")($rootScope);
        $rootScope.$digest();
        assert.equal(el.text(), "Hallo");
    });

    it("Should still allow for interpolation", function () {
        $rootScope.name = "Ruben";
        catalog.currentLanguage = "nl";
        var el = $compile("<div><div translate>Hello {{name}}!</div></div>")($rootScope);
        $rootScope.$digest();
        assert.equal(el.text(), "Hallo Ruben!");
    });

    it("Can provide plural value and string, should translate", function () {
        $rootScope.count = 3;
        catalog.currentLanguage = "nl";
        var el = $compile("<div><div translate translate-n=\"count\" translate-plural=\"{{count}} boats\">One boat</div></div>")($rootScope);
        $rootScope.$digest();
        assert.equal(el.text(), "3 boten");
    });

    it("Can provide plural value and string, should translate even for unknown languages", function () {
        $rootScope.count = 2;
        catalog.currentLanguage = "fr";
        var el = $compile("<div><div translate translate-n=\"count\" translate-plural=\"{{count}} boats\">One boat</div></div>")($rootScope);
        $rootScope.$digest();
        assert.equal(el.text(), "2 boats");
    });

    it("Can provide plural value and string, should translate even for default strings", function () {
        $rootScope.count = 0;
        var el = $compile("<div><div translate translate-n=\"count\" translate-plural=\"{{count}} boats\">One boat</div></div>")($rootScope);
        $rootScope.$digest();
        assert.equal(el.text(), "0 boats");
    });

    it("Can provide plural value and string, should translate even for default strings, singular", function () {
        $rootScope.count = 1;
        var el = $compile("<div><div translate translate-n=\"count\" translate-plural=\"{{count}} boats\">One boat</div></div>")($rootScope);
        $rootScope.$digest();
        assert.equal(el.text(), "One boat");
    });

    it("Can provide plural value and string, should translate even for default strings, plural", function () {
        $rootScope.count = 2;
        var el = $compile("<div><div translate translate-n=\"count\" translate-plural=\"{{count}} boats\">One boat</div></div>")($rootScope);
        $rootScope.$digest();
        assert.equal(el.text(), "2 boats");
    });

    it("Can provide plural value and string, should translate with hardcoded count", function () {
        $rootScope.count = 3;
        var el = $compile("<div><div translate translate-n=\"0\" translate-plural=\"{{count}} boats\">One boat</div></div>")($rootScope);
        $rootScope.$digest();
        assert.equal(el.text(), "3 boats");
    });

    it("Can provide plural value and string, should translate with injected $count", function () {
        $rootScope.some = {
            custom: {
                elements: {
                    length: 6
                }
            }
        };
        var el = $compile("<div><div translate translate-n=\"some.custom.elements.length\" translate-plural=\"{{$count}} boats\">One boat</div></div>")($rootScope);
        $rootScope.$digest();
        assert.equal(el.text(), "6 boats");
    });

    it("Changing the scope should update the translation, fixed count", function () {
        $rootScope.count = 3;
        var el = $compile("<div><div translate translate-n=\"count\" translate-plural=\"{{count}} boats\">One boat</div></div>")($rootScope);
        $rootScope.$digest();
        assert.equal(el.text(), "3 boats");
        $rootScope.$apply(function () {
            $rootScope.count = 2;
        });
        assert.equal(el.text(), "2 boats");
    });

    it("Changing the scope should update the translation, changed count", function () {
        $rootScope.count = 3;
        var el = $compile("<div><div translate translate-n=\"count\" translate-plural=\"{{count}} boats\">One boat</div></div>")($rootScope);
        $rootScope.$digest();
        assert.equal(el.text(), "3 boats");
        $rootScope.$apply(function () {
            $rootScope.count = 1;
        });
        assert.equal(el.text(), "One boat");
    });

    it("Child elements still respond to scope correctly", function () {
        $rootScope.name = "Ruben";
        var el = $compile("<div><div translate>Hello {{name}}!</div></div>")($rootScope);
        $rootScope.$digest();
        assert.equal(el.text(), "Hello Ruben!");
        $rootScope.$apply(function () {
            $rootScope.name = "Joe";
        });
        assert.equal(el.text(), "Hello Joe!");
    });

    it("Child elements still respond to scope correctly, plural", function () {
        $rootScope.name = "Ruben";
        $rootScope.count = 1;
        var el = $compile("<div><div translate translate-n=\"count\" translate-plural=\"Hello {{name}} ({{count}} messages)!\">Hello {{name}} (one message)!</div></div>")($rootScope);
        $rootScope.$digest();
        assert.equal(el.text(), "Hello Ruben (one message)!");
        $rootScope.$apply(function () {
            $rootScope.name = "Joe";
        });
        assert.equal(el.text(), "Hello Joe (one message)!");
        $rootScope.$apply(function () {
            $rootScope.count = 3;
        });
        assert.equal(el.text(), "Hello Joe (3 messages)!");
        $rootScope.$apply(function () {
            $rootScope.name = "Jack";
        });
        assert.equal(el.text(), "Hello Jack (3 messages)!");
        $rootScope.$apply(function () {
            $rootScope.count = 1;
            $rootScope.name = "Jane";
        });
        assert.equal(el.text(), "Hello Jane (one message)!");
    });

    it("Changing language should translate again", function () {
        catalog.currentLanguage = "nl";
        var el = $compile("<div><div translate>Hello</div></div>")($rootScope);
        $rootScope.$digest();
        assert.equal(el.text(), "Hallo");
        catalog.setCurrentLanguage("en");
        $rootScope.$digest();
        assert.equal(el.text(), "Hello");
    });

    it("Should warn if you forget to add attributes (n)", function () {
        assert.throws(function () {
            $compile("<div translate translate-plural=\"Hello {{name}} ({{count}} messages)!\">Hello {{name}} (one message)!</div>")($rootScope);
        }, "You should add a translate-n attribute whenever you add a translate-plural attribute.");
    });

    it("Should warn if you forget to add attributes (plural)", function () {
        assert.throws(function () {
            $compile("<div translate translate-n=\"count\">Hello {{name}} (one message)!</div>")($rootScope);
        }, "You should add a translate-plural attribute whenever you add a translate-n attribute.");
    });

    it("Translates inside an ngIf directive", function () {
        $rootScope.flag = true;
        catalog.currentLanguage = "nl";
        var el = $compile("<div><div ng-if=\"flag\"><div translate>Hello</div></div></div>")($rootScope);
        $rootScope.$digest();
        assert.equal(el.text(), "Hallo");
    });

    it("Does not translate inside a false ngIf directive", function () {
        $rootScope.flag = false;
        catalog.currentLanguage = "nl";
        var el = $compile("<div><div ng-if=\"flag\"><div translate>Hello</div></div></div>")($rootScope);
        $rootScope.$digest();
        assert.equal(el.text(), "");
    });

    it("Does not have a ng-binding class", function () {
        $rootScope.url = "http://google.com";
        catalog.currentLanguage = "af";
        var el = $compile("<div><p translate>This link: <a class=\"extra-class\" ng-href=\"{{url}}\">{{url}}</a> will have the 'ng-binding' class attached before the translate directive can capture it.</p></div>")($rootScope);
        $rootScope.$digest();
        assert.equal(el.text(), "Die skakel: http://google.com sal die 'ng-binding' klass aangevoeg hê voor die translate directive dit kan vasvat.");
    });
});
