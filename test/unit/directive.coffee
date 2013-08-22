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
            'One boat': [ 'Een boot', '{{count}} boten' ]

    it 'Should return string unchanged when no translation is available', ->
        el = $compile('<div><h1 translate>Hello!</h1></div>')($rootScope)
        $rootScope.$digest()
        assert.equal(el.text(), 'Hello!')

    it 'Should translate known strings', ->
        catalog.currentLanguage = 'nl'
        el = $compile('<div><h1 translate>Hello</h1></div>')($rootScope)
        $rootScope.$digest()
        assert.equal(el.text(), 'Hallo')

    it 'Should still allow for interpolation', ->
        $rootScope.name = 'Ruben'
        catalog.currentLanguage = 'nl'
        el = $compile('<div><div translate>Hello {{name}}!</div></div>')($rootScope)
        $rootScope.$digest()
        assert.equal(el.text(), 'Hallo Ruben!')

    it 'Can provide plural value and string, should translate', ->
        $rootScope.count = 3
        catalog.currentLanguage = 'nl'
        el = $compile('<div><div translate translate-n="count" translate-plural="{{count}} boats">One boat</div></div>')($rootScope)
        $rootScope.$digest()
        assert.equal(el.text(), '3 boten')

    it 'Can provide plural value and string, should translate even for unknown languages', ->
        $rootScope.count = 2
        catalog.currentLanguage = 'fr'
        el = $compile('<div><div translate translate-n="count" translate-plural="{{count}} boats">One boat</div></div>')($rootScope)
        $rootScope.$digest()
        assert.equal(el.text(), '2 boats')

    it 'Can provide plural value and string, should translate even for default strings', ->
        $rootScope.count = 0
        el = $compile('<div><div translate translate-n="count" translate-plural="{{count}} boats">One boat</div></div>')($rootScope)
        $rootScope.$digest()
        assert.equal(el.text(), '0 boats')

    it 'Can provide plural value and string, should translate even for default strings, singular', ->
        $rootScope.count = 1
        el = $compile('<div><div translate translate-n="count" translate-plural="{{count}} boats">One boat</div></div>')($rootScope)
        $rootScope.$digest()
        assert.equal(el.text(), 'One boat')

    it 'Can provide plural value and string, should translate even for default strings, plural', ->
        $rootScope.count = 2
        el = $compile('<div><div translate translate-n="count" translate-plural="{{count}} boats">One boat</div></div>')($rootScope)
        $rootScope.$digest()
        assert.equal(el.text(), '2 boats')

    it 'Can provide plural value and string, should translate with hardcoded count', ->
        $rootScope.count = 3
        el = $compile('<div><div translate translate-n="0" translate-plural="{{count}} boats">One boat</div></div>')($rootScope)
        $rootScope.$digest()
        assert.equal(el.text(), '3 boats')

    it 'Changing the scope should update the translation, fixed count', ->
        $rootScope.count = 3
        el = $compile('<div><div translate translate-n="count" translate-plural="{{count}} boats">One boat</div></div>')($rootScope)
        $rootScope.$digest()
        assert.equal(el.text(), '3 boats')
        $rootScope.$apply () ->
            $rootScope.count = 2
        assert.equal(el.text(), '2 boats')

    it 'Changing the scope should update the translation, changed count', ->
        $rootScope.count = 3
        el = $compile('<div><div translate translate-n="count" translate-plural="{{count}} boats">One boat</div></div>')($rootScope)
        $rootScope.$digest()
        assert.equal(el.text(), '3 boats')
        $rootScope.$apply () ->
            $rootScope.count = 1
        assert.equal(el.text(), 'One boat')

    it 'Child elements still respond to scope correctly', ->
        $rootScope.name = 'Ruben'
        el = $compile('<div><div translate>Hello {{name}}!</div></div>')($rootScope)
        $rootScope.$digest()
        assert.equal(el.text(), 'Hello Ruben!')
        $rootScope.$apply () ->
            $rootScope.name = 'Joe'
        assert.equal(el.text(), 'Hello Joe!')

    it 'Child elements still respond to scope correctly, plural', ->
        $rootScope.name = 'Ruben'
        $rootScope.count = 1
        el = $compile('<div><div translate translate-n="count" translate-plural="Hello {{name}} ({{count}} messages)!">Hello {{name}} (one message)!</div></div>')($rootScope)
        $rootScope.$digest()
        assert.equal(el.text(), 'Hello Ruben (one message)!')
        $rootScope.$apply () ->
            $rootScope.name = 'Joe'
        assert.equal(el.text(), 'Hello Joe (one message)!')
        $rootScope.$apply () ->
            $rootScope.count = 3
        assert.equal(el.text(), 'Hello Joe (3 messages)!')
        $rootScope.$apply () ->
            $rootScope.name = 'Jack'
        assert.equal(el.text(), 'Hello Jack (3 messages)!')
        $rootScope.$apply () ->
            $rootScope.count = 1
            $rootScope.name = 'Jane'
        assert.equal(el.text(), 'Hello Jane (one message)!')

    it 'Changing language should translate again', ->
        catalog.currentLanguage = 'nl'
        el = $compile('<div><div translate>Hello</div></div>')($rootScope)
        $rootScope.$digest()
        assert.equal(el.text(), 'Hallo')

        catalog.currentLanguage = 'en'
        $rootScope.$digest()
        assert.equal(el.text(), 'Hello')

    it 'Should warn if you forget to add attributes (n)', ->
        assert.throws ->
            $compile('<div translate translate-plural="Hello {{name}} ({{count}} messages)!">Hello {{name}} (one message)!</div>')($rootScope)
        , 'You should add a translate-n attribute whenever you add a translate-plural attribute.'

    it 'Should warn if you forget to add attributes (plural)', ->
        assert.throws ->
            $compile('<div translate translate-n="count">Hello {{name}} (one message)!</div>')($rootScope)
        , 'You should add a translate-plural attribute whenever you add a translate-n attribute.'

    it 'Translates inside an ngIf directive', ->
        $rootScope.flag = true
        catalog.currentLanguage = 'nl'
        el = $compile('<div><div ng-if="flag"><div translate>Hello</div></div></div>')($rootScope)
        $rootScope.$digest()
        assert.equal(el.text(), 'Hallo')

    it 'Does not translate inside a false ngIf directive', ->
        $rootScope.flag = false
        catalog.currentLanguage = 'nl'
        el = $compile('<div><div ng-if="flag"><div translate>Hello</div></div></div>')($rootScope)
        $rootScope.$digest()
        assert.equal(el.text(), '')
