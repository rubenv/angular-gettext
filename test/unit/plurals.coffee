assert = chai.assert

describe 'Plurals', ->
    plurals = null

    beforeEach module('gettext')

    beforeEach inject (gettextPlurals) ->
        plurals = gettextPlurals

    it 'Plural form of singular english is 0', ->
        assert.equal(plurals('en', 1), 0)

    it 'Plural form of plural english is 1', ->
        assert.equal(plurals('en', 2), 1)

    it 'Plural form of zero in english is 1', ->
        assert.equal(plurals('en', 0), 1)

    it 'Plural form of singular dutch is 0', ->
        assert.equal(plurals('nl', 1), 0)

    it 'Plural form of plural dutch is 1', ->
        assert.equal(plurals('nl', 2), 1)

    it 'Plural form of zero in dutch is 1', ->
        assert.equal(plurals('nl', 0), 1)

    it 'Plural form of singular french is 0', ->
        assert.equal(plurals('fr', 1), 0)

    it 'Plural form of plural french is 1', ->
        assert.equal(plurals('fr', 2), 1)

    it 'Plural form of zero in french is 1', ->
        assert.equal(plurals('fr', 0), 0)

    it 'Plural form of 27 in arabic is 4', ->
        assert.equal(plurals('ar', 27), 4)
