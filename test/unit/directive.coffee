assert = chai.assert

describe 'Directive', ->
    catalog = null
    $rootScope = null
    $compile = null

    beforeEach module('gettext')

    beforeEach inject (_$rootScope_, _$compile_, gettextCatalog) ->
        $rootScope = _$rootScope_
        $compile = _$compile_
        catalog = gettextCatalog
        catalog.setStrings 'nl',
            'Hello': 'Hallo'
            'Hello {{name}}!': 'Hallo {{name}}!'
            _plurals:
                'One boat': [ 'Een boot', '{{count}} boten' ]

    it 'Should return string unchanged when no translation is available', ->
        el = $compile('<div translate>Hello!</div>')($rootScope)
        $rootScope.$digest()
        assert.equal(el.text(), 'Hello!')

    it 'Should translate known strings', ->
        catalog.currentLanguage = 'nl'
        el = $compile('<div translate>Hello</div>')($rootScope)
        $rootScope.$digest()
        assert.equal(el.text(), 'Hallo')

    it 'Should still allow for interpolation', ->
        $rootScope.name = 'Ruben'
        catalog.currentLanguage = 'nl'
        el = $compile('<div translate>Hello {{name}}!</div>')($rootScope)
        $rootScope.$digest()
        assert.equal(el.text(), 'Hallo Ruben!')

    it 'Can provide plural value and string, should translate', ->
        $rootScope.count = 3
        catalog.currentLanguage = 'nl'
        el = $compile('<div translate translate-n="count" translate-plural="{{count}} boats">One boat</div>')($rootScope)
        $rootScope.$digest()
        assert.equal(el.text(), '3 boten')

    it 'Can provide plural value and string, should translate even for unknown languages', ->
        $rootScope.count = 2
        catalog.currentLanguage = 'fr'
        el = $compile('<div translate translate-n="count" translate-plural="{{count}} boats">One boat</div>')($rootScope)
        $rootScope.$digest()
        assert.equal(el.text(), '2 boats')

    it 'Can provide plural value and string, should translate even for default strings', ->
        $rootScope.count = 0
        el = $compile('<div translate translate-n="count" translate-plural="{{count}} boats">One boat</div>')($rootScope)
        $rootScope.$digest()
        assert.equal(el.text(), '0 boats')

    it 'Can provide plural value and string, should translate with hardcoded count', ->
        $rootScope.count = 3
        el = $compile('<div translate translate-n="0" translate-plural="{{count}} boats">One boat</div>')($rootScope)
        $rootScope.$digest()
        assert.equal(el.text(), '3 boats')
