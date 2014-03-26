assert = chai.assert

describe 'String loading', ->
    catalog = null
    $httpBackend = null

    beforeEach module('gettext')

    beforeEach inject (gettextCatalog, _$httpBackend_) ->
        catalog = gettextCatalog
        $httpBackend = _$httpBackend_

    afterEach () ->
        $httpBackend.verifyNoOutstandingExpectation()
        $httpBackend.verifyNoOutstandingRequest()

    it 'Will load remote strings', ->
        catalog.loadRemote('/strings/nl.json')
        $httpBackend.expectGET('/strings/nl.json').respond(200)
        $httpBackend.flush()

    it 'Will set the loaded strings', ->
        catalog.loadRemote('/strings/nl.json')
        $httpBackend.expectGET('/strings/nl.json').respond(200, {
            nl: {
                "Hello": "Hallo"
            }
        })
        $httpBackend.flush()
        assert.notEqual(undefined, catalog.strings.nl)

    it 'Gracefully handles failure', ->
        catalog.loadRemote('/strings/nl.json')
        $httpBackend.expectGET('/strings/nl.json').respond(404)
        $httpBackend.flush()

    it 'Returns a promise', ->
        called = false
        catalog.loadRemote('/strings/nl.json').then () ->
            called = true
        $httpBackend.expectGET('/strings/nl.json').respond(200)
        $httpBackend.flush()
        assert(called)

    it 'Returns a promise (failure)', ->
        successCalled = false
        failedCalled = false
        promise = catalog.loadRemote('/strings/nl.json')
        success = () -> successCalled = true
        failed = () -> failedCalled = true
        promise.then(success, failed)
        $httpBackend.expectGET('/strings/nl.json').respond(404)
        $httpBackend.flush()
        assert(!successCalled)
        assert(failedCalled)

    it 'Caches strings', ->
        catalog.loadRemote('/strings/nl.json')
        $httpBackend.expectGET('/strings/nl.json').respond(200, {
            nl: {
                "Hello": "Hallo"
            }
        })
        $httpBackend.flush()

        catalog.loadRemote('/strings/nl.json')
        $httpBackend.verifyNoOutstandingRequest()
