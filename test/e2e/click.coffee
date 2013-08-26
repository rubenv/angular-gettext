describe 'Click', ->
    it 'Should not break ng-click', ->
        browser().navigateTo("/test/fixtures/click.html")
        element('button#test1').click()
        expect(element('#field').text()).toBe('Success')

    it 'Should not break ng-click for translated strings', ->
        browser().navigateTo("/test/fixtures/click.html")
        element('button#test2').click()
        expect(element('#field').text()).toBe('Success')
