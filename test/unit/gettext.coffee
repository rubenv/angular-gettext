assert = chai.assert

describe 'Catalog', ->
    gettext = null

    beforeEach module('gettext')

    beforeEach inject (_gettext_) ->
        gettext = _gettext_

    it 'gettext function is a noop', ->
        assert.equal(3, gettext(3))

    it 'gettext function is a noop (string)', ->
        assert.equal('test', gettext('test'))
