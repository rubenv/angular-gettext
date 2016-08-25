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
            "Hello {{author}}!": "Hallo {{author}}!",
            "One boat": ["Een boot", "{{count}} boten"],
            Archive: { verb: "Archiveren", noun: "Archief" }
        });
        catalog.setStrings("af", {
            "This link: <a class=\"extra-class\" ng-href=\"{{url}}\">{{url}}</a> will have the 'ng-binding' class attached before the translate directive can capture it.": "Die skakel: <a ng-href=\"{{url}}\">{{url}}</a> sal die 'ng-binding' klass aangevoeg hê voor die translate directive dit kan vasvat."
        });
        catalog.setStrings("pl", {
            "This product: {{product}} costs {{cost}}.": "Ten produkt: {{product}} kosztuje {{cost}}.",
            "This product: {{product}} costs {{cost}}{{currency}}.": "Ten produkt: {{product}} kosztuje {{cost}}{{currency}}.",
            "Product of the week: {{product}}.": "Produkt tygodnia: {{product}}."
        });
    }));

    it("Should work on empty strings", function () {
        var el = $compile("<div><h1 translate></h1></div>")($rootScope);
        $rootScope.$digest();
        assert.equal(el.text(), "");
    });

    it("Should return string unchanged when no translation is available", function () {
        var el = $compile("<div><h1 translate>Hello!</h1></div>")($rootScope);
        $rootScope.$digest();
        assert.equal(el.text(), "Hello!");
    });

    it("Should translate known strings", function () {
        catalog.setCurrentLanguage("nl");
        var el = $compile("<div><h1 translate>Hello</h1></div>")($rootScope);
        $rootScope.$digest();
        assert.equal(el.text(), "Hallo");
    });

    it("Should translate known strings according to defined translation context", function () {
        catalog.setCurrentLanguage("nl");
        var el = $compile("<div><h1 translate translate-context=\"verb\">Archive</h1></div>")($rootScope);
        $rootScope.$digest();
        assert.equal(el.text(), "Archiveren");
        el = $compile("<div><h1 translate translate-context=\"noun\">Archive</h1></div>")($rootScope);
        $rootScope.$digest();
        assert.equal(el.text(), "Archief");
    });

    it("Should still allow for interpolation", function () {
        $rootScope.name = "Ruben";
        catalog.setCurrentLanguage("nl");
        var el = $compile("<div><div translate>Hello {{name}}!</div></div>")($rootScope);
        $rootScope.$digest();
        assert.equal(el.text(), "Hallo Ruben!");
    });

    it("Can provide plural value and string, should translate", function () {
        $rootScope.count = 3;
        catalog.setCurrentLanguage("nl");
        var el = $compile("<div><div translate translate-n=\"count\" translate-plural=\"{{count}} boats\">One boat</div></div>")($rootScope);
        $rootScope.$digest();
        assert.equal(el.text(), "3 boten");
    });

    it("Can provide plural value and string, should translate even for unknown languages", function () {
        $rootScope.count = 2;
        catalog.setCurrentLanguage("fr");
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
        catalog.setCurrentLanguage("nl");
        var el = $compile("<div><div translate>Hello</div></div>")($rootScope);
        $rootScope.$digest();
        assert.equal(el.text(), "Hallo");
        catalog.setCurrentLanguage("en");
        $rootScope.$digest();
        assert.equal(el.text(), "Hello");
    });

    it("Changing language should translate again not loosing scope", function () {
        catalog.setCurrentLanguage("nl");
        $rootScope.providedName = "Ruben";
        var el = $compile("<div><div translate translate-params-name='providedName'>Hello {{name}}!</div></div>")($rootScope);
        $rootScope.$digest();
        assert.equal(el.text(), "Hallo Ruben!");
        catalog.setCurrentLanguage("en");
        $rootScope.$digest();
        assert.equal(el.text(), "Hello Ruben!");
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
        catalog.setCurrentLanguage("nl");
        var el = $compile("<div><div ng-if=\"flag\"><div translate>Hello</div></div></div>")($rootScope);
        $rootScope.$digest();
        assert.equal(el.text(), "Hallo");
    });

    it("Does not translate inside a false ngIf directive", function () {
        $rootScope.flag = false;
        catalog.setCurrentLanguage("nl");
        var el = $compile("<div><div ng-if=\"flag\"><div translate>Hello</div></div></div>")($rootScope);
        $rootScope.$digest();
        assert.equal(el.text(), "");
    });

    it("Does not have a ng-binding class", function () {
        $rootScope.url = "http://google.com";
        catalog.setCurrentLanguage("af");
        var el = $compile("<div><p translate>This link: <a class=\"extra-class\" ng-href=\"{{url}}\">{{url}}</a> will have the 'ng-binding' class attached before the translate directive can capture it.</p></div>")($rootScope);
        $rootScope.$digest();
        assert.equal(el.text(), "Die skakel: http://google.com sal die 'ng-binding' klass aangevoeg hê voor die translate directive dit kan vasvat.");
    });

    it("Should work as an element", function () {
        catalog.currentLanguage = "nl";
        var el = $compile("<translate>Hello</translate>")($rootScope);
        $rootScope.$digest();
        assert.equal(el.text(), "Hallo");
    });

    it("Should translate with context param", function () {
        $rootScope.name = "Ernest";
        catalog.setCurrentLanguage("nl");
        var el = $compile("<div><h1 translate translate-params-author=\"name\">Hello {{author}}!</h1></div>")($rootScope);
        $rootScope.$digest();
        assert.equal(el.text(), "Hallo Ernest!");
    });

    it("Should translate with filters used in translate params", function () {
        $rootScope.name = "Ernest";
        catalog.setCurrentLanguage("nl");
        var el = $compile("<div><h1 translate translate-params-author=\"name | uppercase\">Hello {{author}}!</h1></div>")($rootScope);
        $rootScope.$digest();
        assert.equal(el.text(), "Hallo ERNEST!");
    });

    it("Should translate with multiple translate params", function () {
        $rootScope.item = "Headphones";
        $rootScope.cost = 5;
        catalog.setCurrentLanguage("pl");
        var el = $compile("<div><h1 translate translate-params-product=\"item | uppercase\" translate-params-cost=\"cost | currency\">This product: {{product}} costs {{cost}}.</h1></div>")($rootScope);
        $rootScope.$digest();
        assert.equal(el.text(), "Ten produkt: HEADPHONES kosztuje $5.00.");
    });

    it("Should translate with multiple translate params along with normal scope interpolation", function () {
        $rootScope.item = "Headphones";
        $rootScope.cost = 5;
        $rootScope.currency = "$";
        catalog.setCurrentLanguage("pl");
        var el = $compile("<div><h1 translate translate-params-product=\"item | uppercase\">This product: {{product}} costs {{cost}}{{currency}}.</h1></div>")($rootScope);
        $rootScope.$digest();
        assert.equal(el.text(), "Ten produkt: HEADPHONES kosztuje 5$.");
    });

    it("Should update translation with translate params when context changes", function () {
        $rootScope.item = "Headphones";
        catalog.setCurrentLanguage("pl");
        var el = $compile("<div><h1 translate translate-params-product=\"item | uppercase\">Product of the week: {{product}}.</h1></div>")($rootScope);
        $rootScope.$digest();
        assert.equal(el.text(), "Produkt tygodnia: HEADPHONES.");

        $rootScope.item = "Smart TV";
        $rootScope.$digest();
        assert.equal(el.text(), "Produkt tygodnia: SMART TV.");
    });

    describe("Translation's with plurals", function () {
        var sourceString;

        beforeEach(inject(function () {
            sourceString = "Today {{someone}} meets with {{someoneElse}} for {{duration}} minute.";

            catalog.setStrings("pl", {
                "Today {{someone}} meets with {{someoneElse}} for {{duration}} minute.": [
                    "Dziś {{someone}} spotyka się z {{someoneElse}} przez jedną minutę.",
                    "Dziś {{someone}} spotyka się z {{someoneElse}} przez {{duration}} minuty.",
                    "Dziś {{someone}} spotyka się z {{someoneElse}} przez {{duration}} minut."
                ]
            });
        }));

        it("Should properly handle plural translation for 1", function () {
            catalog.setCurrentLanguage("pl");
            $rootScope.someone = "Ruben";
            $rootScope.someoneElse = "Ernest";

            var el = $compile("<h1 translate translate-n=\"duration\" translate-plural=\"Today {{someone}} meets with {{someoneElse}} for {{duration}} minute.\">Today {{someone}} meets with {{someoneElse}} for {{duration}} minute.</h1>")($rootScope);

            $rootScope.duration = 1;
            $rootScope.$digest();
            assert.equal(el.text(), "Dziś Ruben spotyka się z Ernest przez jedną minutę.");
        });

        it("Should properly handle plural translation for 0, 5, 6, 7, ...", function () {
            catalog.setCurrentLanguage("pl");
            $rootScope.someone = "Ruben";
            $rootScope.someoneElse = "Ernest";

            var el = $compile("<h1 translate translate-n=\"duration\" translate-plural=\"Today {{someone}} meets with {{someoneElse}} for {{duration}} minute.\">Today {{someone}} meets with {{someoneElse}} for {{duration}} minute.</h1>")($rootScope);

            $rootScope.duration = 0;
            $rootScope.$digest();
            assert.equal(el.text(), "Dziś Ruben spotyka się z Ernest przez 0 minut.");

            $rootScope.duration = 5;
            $rootScope.$digest();
            assert.equal(el.text(), "Dziś Ruben spotyka się z Ernest przez 5 minut.");

            $rootScope.duration = 26;
            $rootScope.$digest();
            assert.equal(el.text(), "Dziś Ruben spotyka się z Ernest przez 26 minut.");
        });

        it("Should properly handle plural translation for 2, 3, 4, 22, ...", function () {
            catalog.setCurrentLanguage("pl");
            $rootScope.someone = "Ruben";
            $rootScope.someoneElse = "Ernest";

            var el = $compile("<h1 translate translate-n=\"duration\" translate-plural=\"Today {{someone}} meets with {{someoneElse}} for {{duration}} minute.\">Today {{someone}} meets with {{someoneElse}} for {{duration}} minute.</h1>")($rootScope);

            $rootScope.duration = 2;
            $rootScope.$digest();
            assert.equal(el.text(), "Dziś Ruben spotyka się z Ernest przez 2 minuty.");

            $rootScope.duration = 3;
            $rootScope.$digest();
            assert.equal(el.text(), "Dziś Ruben spotyka się z Ernest przez 3 minuty.");

            $rootScope.duration = 4;
            $rootScope.$digest();
            assert.equal(el.text(), "Dziś Ruben spotyka się z Ernest przez 4 minuty.");

            $rootScope.duration = 22;
            $rootScope.$digest();
            assert.equal(el.text(), "Dziś Ruben spotyka się z Ernest przez 22 minuty.");
        });

        it("Should properly handle plural translation for 1 with language code that includes locale (e.g. pl_PL, en_US)", function () {
            catalog.setCurrentLanguage("pl_PL");
            $rootScope.someone = "Ruben";
            $rootScope.someoneElse = "Ernest";

            var el = $compile("<h1 translate translate-n=\"duration\" translate-plural=\"Today {{someone}} meets with {{someoneElse}} for {{duration}} minute.\">Today {{someone}} meets with {{someoneElse}} for {{duration}} minute.</h1>")($rootScope);

            $rootScope.duration = 1;
            $rootScope.$digest();
            assert.equal(el.text(), "Dziś Ruben spotyka się z Ernest przez jedną minutę.");
        });

        it("Should properly handle plural translation for 0, 5, 6, 7, ... with language code that includes locale (e.g. pl_PL, en_US)", function () {
            catalog.setCurrentLanguage("pl_PL");
            $rootScope.someone = "Ruben";
            $rootScope.someoneElse = "Ernest";

            var el = $compile("<h1 translate translate-n=\"duration\" translate-plural=\"Today {{someone}} meets with {{someoneElse}} for {{duration}} minute.\">Today {{someone}} meets with {{someoneElse}} for {{duration}} minute.</h1>")($rootScope);

            $rootScope.duration = 0;
            $rootScope.$digest();
            assert.equal(el.text(), "Dziś Ruben spotyka się z Ernest przez 0 minut.");

            $rootScope.duration = 5;
            $rootScope.$digest();
            assert.equal(el.text(), "Dziś Ruben spotyka się z Ernest przez 5 minut.");

            $rootScope.duration = 26;
            $rootScope.$digest();
            assert.equal(el.text(), "Dziś Ruben spotyka się z Ernest przez 26 minut.");
        });

        it("Should properly handle plural translation for 2, 3, 4, 22, ... with language code that includes locale (e.g. pl_PL, en_US)", function () {
            catalog.setCurrentLanguage("pl_PL");
            $rootScope.someone = "Ruben";
            $rootScope.someoneElse = "Ernest";

            var el = $compile("<h1 translate translate-n=\"duration\" translate-plural=\"Today {{someone}} meets with {{someoneElse}} for {{duration}} minute.\">Today {{someone}} meets with {{someoneElse}} for {{duration}} minute.</h1>")($rootScope);

            $rootScope.duration = 2;
            $rootScope.$digest();
            assert.equal(el.text(), "Dziś Ruben spotyka się z Ernest przez 2 minuty.");

            $rootScope.duration = 3;
            $rootScope.$digest();
            assert.equal(el.text(), "Dziś Ruben spotyka się z Ernest przez 3 minuty.");

            $rootScope.duration = 4;
            $rootScope.$digest();
            assert.equal(el.text(), "Dziś Ruben spotyka się z Ernest przez 4 minuty.");

            $rootScope.duration = 22;
            $rootScope.$digest();
            assert.equal(el.text(), "Dziś Ruben spotyka się z Ernest przez 22 minuty.");
        });
    });
});
