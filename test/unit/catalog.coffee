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

    it 'Should not add prefix for untranslated strings in preferred language', ->
        catalog.debug = true
        catalog.currentLanguage = catalog.baseLanguage
        assert.equal(catalog.getString('Hello'), 'Hello')

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

    it 'Can return an interpolated string', ->
      strings = { 'Hello {{name}}!': 'Hallo {{name}}!' }
      assert.deepEqual(catalog.strings, {})
      catalog.currentLanguage = 'nl'
      catalog.setStrings('nl', strings)
      assert.equal(catalog.getString('Hello {{name}}!', {name: 'Andrew'}), 'Hallo Andrew!')

    it 'Can return an interpolated plural string', ->
      assert.deepEqual(catalog.strings, {})
      catalog.currentLanguage = 'gb'
      catalog.setStrings('gb', {
        'There is {{count}} bird': [ 'There is {{count}} bird', 'There are {{count}} birds' ]
      })
      assert.equal(catalog.getPlural(2, 'There is {{count}} bird', 'There are {{count}} birds', { count: 2}), 'There are 2 birds')
      assert.equal(catalog.getPlural(1, 'There is {{count}} bird', 'There are {{count}} birds', { count: 1}), 'There is 1 bird')
