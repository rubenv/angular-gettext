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
        assert.deepEqual(catalog.strings.nl.Hello[0], "Hallo");
    });

    it("Can retrieve strings", function () {
        var strings = { Hello: "Hallo" };
        catalog.setStrings("nl", strings);
        catalog.currentLanguage = "nl";
        assert.equal(catalog.getString("Hello"), "Hallo");
    });

    it("Should return original for unknown strings", function () {
        var strings = { Hello: "Hallo" };
        catalog.setStrings("nl", strings);
        catalog.currentLanguage = "nl";
        assert.equal(catalog.getString("Bye"), "Bye");
    });

    it("Should return original for unknown languages", function () {
        catalog.currentLanguage = "fr";
        assert.equal(catalog.getString("Hello"), "Hello");
    });

    it("Should add prefix for untranslated strings when in debug", function () {
        catalog.debug = true;
        catalog.currentLanguage = "fr";
        assert.equal(catalog.getString("Hello"), "[MISSING]: Hello");
    });

    it("Should add custom prefix for untranslated strings when in debug", function () {
        catalog.debug = true;
        catalog.debugPrefix = "#X# ";
        catalog.currentLanguage = "fr";
        assert.equal(catalog.getString("Hello"), "#X# Hello");
    });

    it("Should not add prefix for untranslated strings in English", function () {
        catalog.debug = true;
        catalog.currentLanguage = "en";
        assert.equal(catalog.getString("Hello"), "Hello");
    });

    it("Should not add prefix for untranslated strings in preferred language", function () {
        catalog.debug = true;
        catalog.currentLanguage = catalog.baseLanguage;
        assert.equal(catalog.getString("Hello"), "Hello");
    });

    it("Should return singular for unknown singular strings", function () {
        assert.equal(catalog.getPlural(1, "Bird", "Birds"), "Bird");
    });

    it("Should return plural for unknown plural strings", function () {
        assert.equal(catalog.getPlural(2, "Bird", "Birds"), "Birds");
    });

    it("Should return singular for singular strings", function () {
        catalog.currentLanguage = "nl";
        catalog.setStrings("nl", {
            Bird: ["Vogel", "Vogels"]
        });
        assert.equal(catalog.getPlural(1, "Bird", "Birds"), "Vogel");
    });

    it("Should return plural for plural strings", function () {
        catalog.currentLanguage = "nl";
        catalog.setStrings("nl", {
            Bird: ["Vogel", "Vogels"]
        });
        assert.equal(catalog.getPlural(2, "Bird", "Birds"), "Vogels");
    });

    it("Should add prefix for untranslated plural strings when in debug (single)", function () {
        catalog.debug = true;
        catalog.currentLanguage = "nl";
        assert.equal(catalog.getPlural(1, "Bird", "Birds"), "[MISSING]: Bird");
    });

    it("Should add prefix for untranslated plural strings when in debug", function () {
        catalog.debug = true;
        catalog.currentLanguage = "nl";
        assert.equal(catalog.getPlural(2, "Bird", "Birds"), "[MISSING]: Birds");
    });

    it("Can return an interpolated string", function () {
        var strings = { "Hello {{name}}!": "Hallo {{name}}!" };
        assert.deepEqual(catalog.strings, {});
        catalog.currentLanguage = "nl";
        catalog.setStrings("nl", strings);
        assert.equal(catalog.getString("Hello {{name}}!", { name: "Andrew" }), "Hallo Andrew!");
    });

    it("Can return an interpolated plural string", function () {
        assert.deepEqual(catalog.strings, {});
        catalog.currentLanguage = "gb";
        catalog.setStrings("gb", {
            "There is {{count}} bird": ["There is {{count}} bird", "There are {{count}} birds"]
        });
        assert.equal(catalog.getPlural(2, "There is {{count}} bird", "There are {{count}} birds", { count: 2 }), "There are 2 birds");
        assert.equal(catalog.getPlural(1, "There is {{count}} bird", "There are {{count}} birds", { count: 1 }), "There is 1 bird");
    });

    it("Can return an interpolated plural string for special {} pattern", function () {
        assert.deepEqual(catalog.strings, {});
        catalog.currentLanguage = "gb";
        catalog.setStrings("gb", {
            "There is {} bird": ["There is {} bird", "There are {} birds"]
        });
        assert.equal(catalog.getPlural(2, "There is {} bird", "There are {} birds"), "There are 2 birds");
        assert.equal(catalog.getPlural(1, "There is {} bird", "There are {} birds"), "There is 1 bird");
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
        catalog.currentLanguage = "fr";
        assert.equal(catalog.getString("Bye"), "[[MISSING]: Bye]");
    });
});
