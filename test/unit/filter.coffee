assert = chai.assert

describe 'Filter', ->
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
            'One boat': [ 'Een boot', '{{count}} boten' ]

    it 'Should have a translate filter', ->
        el = $compile('<h1>{{"Hello!"|translate}}</h1>')($rootScope)
        $rootScope.$digest()
        assert.equal(el.text(), 'Hello!')

    it 'Should translate known strings', ->
        catalog.currentLanguage = 'nl'
        el = $compile('<span>{{"Hello"|translate}}</span>')($rootScope)
        $rootScope.$digest()
        assert.equal(el.text(), 'Hallo')

    it 'Can use filter in attribute values', ->
        catalog.currentLanguage = 'nl'
        el = $compile('<input type="text" placeholder="{{\'Hello\'|translate}}" />')($rootScope)
        $rootScope.$digest()
        assert.equal(el.attr('placeholder'), 'Hallo')
