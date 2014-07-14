describe 'Controller $scope (gettext)', ->
    it 'Should jump over the lazy dog', ->
        browser().navigateTo("/test/fixtures/controller.html")
        expect(element('#test1').text()).toBe('The quick brown fox jumps over the lazy dog')