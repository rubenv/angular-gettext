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

    it 'Should return string unchanged when no translation is available', ->
        el = $compile('<div translate>Hello!</div>')($rootScope)
        $rootScope.$digest()
        assert.equal(el.text(), 'Hello!')

    it 'Should translate known strings', ->
        catalog.currentLanguage = 'nl'
        el = $compile('<div translate>Hello</div>')($rootScope)
        $rootScope.$digest()
        assert.equal(el.text(), 'Hallo')
