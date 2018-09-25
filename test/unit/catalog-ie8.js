describe("Catalog", function () {
    var catalog = null;
    var $window;

    beforeEach(module("gettext"));

    beforeEach(function () {
        $window =  {
            navigator: {
                userAgent: "Mozilla/5.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0; GTB7.4; InfoPath.2; SV1; .NET CLR 3.3.69573; WOW64; en-US)"
            }
        };

        module(function ($provide) {
            $provide.value("$window", $window);
        });
    });

    beforeEach(inject(function (gettextCatalog) {
        catalog = gettextCatalog;
    }));

    it("Should transform uppercase tags in IE8 or lower", function () {
        var strings = { "<SPAN><b>Hello</b> Ruben</SPAN>": "Hello Ruben" };
        assert.deepEqual(catalog.strings, {});
        catalog.setStrings("nl", strings);
        assert.deepEqual(catalog.strings.nl["<span><b>Hello</b> Ruben</span>"].$$noContext[0], "Hello Ruben");
    });
});
