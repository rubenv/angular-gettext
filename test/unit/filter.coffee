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
            'One boat': [ 'Een boot', '%d boten' ]
        catalog.setStrings 'de',
            'One boat': [ 'Een boot', '%(count)d boten' ]

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

    it 'Can use plural filter inside tag', ->
        catalog.currentLanguage = 'nl'
        $rootScope.count = 3
        el = $compile('<div>{{"One boat"|translateN: count:"%d boats":count}}</div>')($rootScope)
        $rootScope.$digest()
        assert.equal(el.text(), '3 boten')

    it 'Can use plural filter without arguments', ->
        catalog.currentLanguage = 'nl'
        $rootScope.count = 1
        el = $compile('<div>{{"One boat"|translateN: count:"%d boats"}}</div>')($rootScope)
        $rootScope.$digest()
        assert.equal(el.text(), 'Een boot')

    it 'Can use object as one argument', ->
        catalog.currentLanguage = 'de'
        $rootScope.count = 3
        el = $compile('<div>{{"One boat"|translateN: count:"%(count)d boats":this}}</div>')($rootScope)
        $rootScope.$digest()
        assert.equal(el.text(), '3 boten')
