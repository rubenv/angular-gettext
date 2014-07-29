describe("Catalog", function () {
    var gettext = null;

    beforeEach(module("gettext"));

    beforeEach(inject(function ($injector) {
        gettext = $injector.get("gettext");
    }));

    it("gettext function is a noop", function () {
        assert.equal(3, gettext(3));
    });

    it("gettext function is a noop (string)", function () {
        assert.equal("test", gettext("test"));
    });
});
