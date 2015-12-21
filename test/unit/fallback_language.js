describe("Fallback languages", function () {
    var fallback = null;

    beforeEach(module("gettext"));

    beforeEach(inject(function (gettextFallbackLanguage) {
        fallback = gettextFallbackLanguage;
    }));

    it("returns base language as fallback", function () {
        assert.equal(fallback("en_GB"), "en");
    });
    it("returns null for simple language codes", function () {
        assert.isNull(fallback("nl"), null);
    });
    it("returns null for null", function () {
        assert.isNull(fallback(null));
    });
    it("returns consistent values", function () {
        assert.equal(fallback("de_CH"), fallback("de_CH"));
    });
});
