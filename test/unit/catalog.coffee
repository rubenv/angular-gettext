assert = chai.assert

describe 'Catalog', ->
    catalog = null

    beforeEach module('gettext')

    beforeEach inject (gettextCatalog) ->
        catalog = gettextCatalog

    it 'Can set strings', ->
        strings = { 'Hello': 'Hallo' }
        assert.deepEqual(catalog.strings, {})
        catalog.setStrings('nl', strings)
        assert.deepEqual(catalog.strings.nl.Hello[0], 'Hallo')

    it 'Can retrieve strings', ->
        strings = { 'Hello': 'Hallo' }
        catalog.setStrings('nl', strings)
        catalog.currentLanguage = 'nl'
        assert.equal(catalog.getString('Hello'), 'Hallo')

    it 'Should return original for unknown strings', ->
        strings = { 'Hello': 'Hallo' }
        catalog.setStrings('nl', strings)
        catalog.currentLanguage = 'nl'
        assert.equal(catalog.getString('Bye'), 'Bye')

    it 'Should return original for unknown languages', ->
        catalog.currentLanguage = 'fr'
        assert.equal(catalog.getString('Hello'), 'Hello')

    it 'Should add prefix for untranslated strings when in debug', ->
        catalog.debug = true
        catalog.currentLanguage = 'fr'
        assert.equal(catalog.getString('Hello'), '[MISSING]: Hello')

    it 'Should not add prefix for untranslated strings in English', ->
        catalog.debug = true
        catalog.currentLanguage = 'en'
        assert.equal(catalog.getString('Hello'), 'Hello')

    it 'Should interpolate untranslated strings without adding prefix in English', ->
        catalog.debug = true
        catalog.currentLanguage = 'en'
        assert.equal(catalog.getString('Hello {{ value }}', { value: 'World!'}), 'Hello World!')

    it 'Should interpolate translated strings', ->
        catalog.debug = true
        strings = { 'Hello {{ value }}!': 'Hallo {{ value }} !' }
        catalog.setStrings('nl', strings)
        catalog.currentLanguage = 'nl'
        assert.equal(catalog.getString('Hello {{ value }}!', { value: 'Martin'}), 'Hallo Martin !')

    it 'Should add prefix before untranslated strings and interpolate them', ->
        catalog.debug = true
        catalog.currentLanguage = 'nl'
        assert.equal(catalog.getString('Hello {{ value }}', { value: 'World!'}), '[MISSING]: Hello World!')

    it 'Should return singular for unknown singular strings', ->
        assert.equal(catalog.getPlural(1, 'Bird', 'Birds'), 'Bird')

    it 'Should return plural for unknown plural strings', ->
        assert.equal(catalog.getPlural(2, 'Bird', 'Birds'), 'Birds')

    it 'Should return singular for singular strings', ->
        catalog.currentLanguage = 'nl'
        catalog.setStrings('nl', {
            'Bird': [ 'Vogel', 'Vogels' ]
        })
        assert.equal(catalog.getPlural(1, 'Bird', 'Birds'), 'Vogel')

    it 'Should return plural for plural strings', ->
        catalog.currentLanguage = 'nl'
        catalog.setStrings('nl', {
            'Bird': [ 'Vogel', 'Vogels' ]
        })
        assert.equal(catalog.getPlural(2, 'Bird', 'Birds'), 'Vogels')

    it 'Should add prefix for untranslated plural strings when in debug (single)', ->
        catalog.debug = true
        catalog.currentLanguage = 'nl'
        assert.equal(catalog.getPlural(1, 'Bird', 'Birds'), '[MISSING]: Bird')

    it 'Should add prefix for untranslated plural strings when in debug', ->
        catalog.debug = true
        catalog.currentLanguage = 'nl'
        assert.equal(catalog.getPlural(2, 'Bird', 'Birds'), '[MISSING]: Birds')

    it 'Should return singular for singular strings with interpolation', ->
        catalog.currentLanguage = 'nl'
        catalog.setStrings('nl', {
            '{{ count }} bird': [ '{{ count }} vogel', '{{ count }} vogels' ]
        })
        assert.equal(catalog.getPlural(1, '{{ count }} bird', '{{ count }} birds', { count: 1 }), '1 vogel')

    it 'Should return plural for plural strings with interpolation', ->
        catalog.currentLanguage = 'nl'
        catalog.setStrings('nl', {
            '{{ count }} bird': [ '{{ count }} vogel', '{{ count }} vogels' ]
        })
        assert.equal(catalog.getPlural(2, '{{ count }} bird', '{{ count }} birds', { count: 2 }), '2 vogels')

    it 'Should add prefix for untranslated plural strings when in debug (single)', ->
        catalog.debug = true
        catalog.currentLanguage = 'nl'
        assert.equal(catalog.getPlural(1, '{{ count }} bird', '{{ count }} birds', { count: 1 }), '[MISSING]: 1 bird')

    it 'Should add prefix for untranslated plural strings when in debug', ->
        catalog.debug = true
        catalog.currentLanguage = 'nl'
        assert.equal(catalog.getPlural(2, '{{ count }} bird', '{{ count }} birds', { count: 2 }), '[MISSING]: 2 birds')





