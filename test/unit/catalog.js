describe("Catalog", function () {
    var catalog = null;

    beforeEach(module("gettext"));

    beforeEach(inject(function (gettextCatalog) {
        catalog = gettextCatalog;
    }));

    it("Can set strings", function () {
        var strings = { Hello: "Hallo" };
        assert.deepEqual(catalog.strings, {});
        catalog.setStrings("nl", strings);
        assert.deepEqual(catalog.strings.nl.Hello.$$noContext[0], "Hallo");
    });

    it("Can retrieve strings", function () {
        var strings = { Hello: "Hallo" };
        catalog.setStrings("nl", strings);
        catalog.setCurrentLanguage("nl");
        assert.equal(catalog.getString("Hello"), "Hallo");
    });

    it("Can set and retrieve strings when default plural is not zero", function () {
        var strings = { Hello: "Hallo" };
        catalog.setStrings("ar", strings);
        catalog.setCurrentLanguage("ar");
        assert.equal(catalog.getString("Hello"), "Hallo");
    });

    it("Should return original for unknown strings", function () {
        var strings = { Hello: "Hallo" };
        catalog.setStrings("nl", strings);
        catalog.setCurrentLanguage("nl");
        assert.equal(catalog.getString("Bye"), "Bye");
    });

    it("Should return original for unknown languages", function () {
        catalog.setCurrentLanguage("fr");
        assert.equal(catalog.getString("Hello"), "Hello");
    });

    it("Should add prefix for untranslated strings when in debug", function () {
        catalog.debug = true;
        catalog.setCurrentLanguage("fr");
        assert.equal(catalog.getString("Hello"), "[MISSING]: Hello");
    });

    it("Should add custom prefix for untranslated strings when in debug", function () {
        catalog.debug = true;
        catalog.debugPrefix = "#X# ";
        catalog.setCurrentLanguage("fr");
        assert.equal(catalog.getString("Hello"), "#X# Hello");
    });

    it("Should not add prefix for untranslated strings in English", function () {
        catalog.debug = true;
        catalog.setCurrentLanguage("en");
        assert.equal(catalog.getString("Hello"), "Hello");
    });

    it("Should not add prefix for untranslated strings in preferred language", function () {
        catalog.debug = true;
        catalog.setCurrentLanguage(catalog.baseLanguage);
        assert.equal(catalog.getString("Hello"), "Hello");
    });

    it("Should return singular for unknown singular strings", function () {
        assert.equal(catalog.getPlural(1, "Bird", "Birds"), "Bird");
    });

    it("Should return plural for unknown plural strings", function () {
        assert.equal(catalog.getPlural(2, "Bird", "Birds"), "Birds");
    });

    it("Should return singular for singular strings", function () {
        catalog.setCurrentLanguage("nl");
        catalog.setStrings("nl", {
            Bird: ["Vogel", "Vogels"]
        });
        assert.equal(catalog.getPlural(1, "Bird", "Birds"), "Vogel");
    });

    it("Should return plural for plural strings", function () {
        catalog.setCurrentLanguage("nl");
        catalog.setStrings("nl", {
            Bird: ["Vogel", "Vogels"]
        });
        assert.equal(catalog.getPlural(2, "Bird", "Birds"), "Vogels");
    });

    it("Should add prefix for untranslated plural strings when in debug (single)", function () {
        catalog.debug = true;
        catalog.setCurrentLanguage("nl");
        assert.equal(catalog.getPlural(1, "Bird", "Birds"), "[MISSING]: Bird");
    });

    it("Should add prefix for untranslated plural strings when in debug", function () {
        catalog.debug = true;
        catalog.setCurrentLanguage("nl");
        assert.equal(catalog.getPlural(2, "Bird", "Birds"), "[MISSING]: Birds");
    });

    it("Can return an interpolated string", function () {
        var strings = { "Hello {{name}}!": "Hallo {{name}}!" };
        assert.deepEqual(catalog.strings, {});
        catalog.setCurrentLanguage("nl");
        catalog.setStrings("nl", strings);
        assert.equal(catalog.getString("Hello {{name}}!", { name: "Andrew" }), "Hallo Andrew!");
    });

    it("Can return a pure interpolated string", function () {
        var strings = { "{{name}}": "{{name}}" };
        assert.deepEqual(catalog.strings, {});
        catalog.setCurrentLanguage("nl");
        catalog.setStrings("nl", strings);
        assert.equal(catalog.getString("{{name}}", { name: "Andrew" }), "Andrew");
    });

    it("Can return an interpolated plural string", function () {
        assert.deepEqual(catalog.strings, {});
        catalog.setCurrentLanguage("en");
        catalog.setStrings("en", {
            "There is {{count}} bird": ["There is {{count}} bird", "There are {{count}} birds"]
        });
        assert.equal(catalog.getPlural(2, "There is {{count}} bird", "There are {{count}} birds", { count: 2 }), "There are 2 birds");
        assert.equal(catalog.getPlural(1, "There is {{count}} bird", "There are {{count}} birds", { count: 1 }), "There is 1 bird");
    });

    it("Should add translation markers when enabled", function () {
        catalog.showTranslatedMarkers = true;
        assert.equal(catalog.getString("Bye"), "[Bye]");
    });

    it("Should add custom translation markers when enabled", function () {
        catalog.showTranslatedMarkers = true;
        catalog.translatedMarkerPrefix = "(TRANS: ";
        catalog.translatedMarkerSuffix = ")";
        assert.equal(catalog.getString("Bye"), "(TRANS: Bye)");
    });

    it("Should add prefix for untranslated strings and add translation markers when enabled", function () {
        catalog.debug = true;
        catalog.showTranslatedMarkers = true;
        catalog.setCurrentLanguage("fr");
        assert.equal(catalog.getString("Bye"), "[[MISSING]: Bye]");
    });

    it("Understands contexts in the string catalog format", function () {
        catalog.setCurrentLanguage("nl");
        catalog.setStrings("nl", {
            Cat: "Kat", // Single string
            "1 boat": ["1 boot", "{{$count}} boten"], // Plural
            Archive: { verb: "Archiveren", noun: "Archief" } // Contexts
        });

        assert.equal(catalog.getString("Cat"), "Kat");
        assert.equal(catalog.getPlural(1, "1 boat", "{{$count}} boats", {}), "1 boot");
        assert.equal(catalog.getPlural(2, "1 boat", "{{$count}} boats", {}), "2 boten");
        assert.equal(catalog.getString("Archive", {}, "verb"), "Archiveren");
        assert.equal(catalog.getString("Archive", {}, "noun"), "Archief");
    });

    it("Should return string from fallback language if current language has no translation", function () {
        var strings = { Hello: "Hallo" };
        catalog.setStrings("nl", strings);
        catalog.setCurrentLanguage("nl_NL");
        assert.equal(catalog.getString("Bye"), "Bye");
        assert.equal(catalog.getString("Hello"), "Hallo");
    });

    it("Should not return string from fallback language if current language has translation", function () {
        var stringsEn   = { Baggage: "Baggage" };
        var stringsEnGB = { Baggage: "Luggage" };
        catalog.setStrings("en", stringsEn);
        catalog.setStrings("en_GB", stringsEnGB);
        catalog.setCurrentLanguage("en_GB");
        assert.equal(catalog.getString("Bye"), "Bye");
        assert.equal(catalog.getString("Baggage"), "Luggage");
    });

    it("Should handle multiple context when loaded from separate files", function () {
        catalog.setStrings("en", { "Multibillion-Dollar": { rich: "nothing" } });
        catalog.setStrings("en", { "Multibillion-Dollar": { poor: "dream" } });
        catalog.setCurrentLanguage("en");
        assert.equal(catalog.getString("Multibillion-Dollar", null, "rich"), "nothing");
        assert.equal(catalog.getString("Multibillion-Dollar", null, "poor"), "dream");
    });
});
