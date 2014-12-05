describe('gettextCatalogProvider', function () {
    var catalogProvider;
    var $injector;

    beforeEach(function () {
        var testModule = angular.module('gettext.test', function () {});
        testModule.config(function (gettextCatalogProvider) {
            catalogProvider = gettextCatalogProvider;
        });

        module('gettext', 'gettext.test');
        inject(function (_$injector_) {
            $injector = _$injector_;
        });
    });

    it('Can set strings', function () {
        var strings = { Hello: 'Hallo' };
        assert.deepEqual(catalogProvider.strings, {});
        catalogProvider.setStrings('nl', strings);
        assert.equal(catalogProvider.strings.nl.Hello.$$noContext[0], 'Hallo');

        var catalog = $injector.invoke(catalogProvider.$get);
        assert.equal(catalog.strings.nl.Hello.$$noContext[0], 'Hallo');
    });

    it('Should allow setting debug', function () {
        assert.equal(catalogProvider.debug, false);
        catalogProvider.debug = true;
        catalogProvider.currentLanguage = 'fr';

        var catalog = $injector.invoke(catalogProvider.$get);
        assert.equal(catalog.getString('Hello'), '[MISSING]: Hello');
    });

    it('Should allow calling setCurrentLanguage', function () {
        assert.equal(catalogProvider.currentLanguage, 'en');
        catalogProvider.setCurrentLanguage('fr');
        assert.equal(catalogProvider.currentLanguage, 'fr');

        var catalog = $injector.invoke(catalogProvider.$get);
        assert.equal(catalog.currentLanguage, 'fr');
    });

});
