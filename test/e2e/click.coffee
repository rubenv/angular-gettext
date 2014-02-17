describe 'Click', ->
    it 'Should not break ng-click', ->
        browser().navigateTo("/test/fixtures/click.html")
        element('button#test1').click()
        expect(element('#field').text()).toBe('Success')

    it 'Should not break ng-click for translated strings', ->
        browser().navigateTo("/test/fixtures/click.html")
        element('button#test2').click()
        expect(element('#field').text()).toBe('Success')

describe 'Click (no jQuery)', ->
    it 'Should not break ng-click', ->
        browser().navigateTo("/test/fixtures/click-nojquery.html")
        element('button#test1').click()
        expect(element('#field').text()).toBe('Success')

    it 'Should not break ng-click for translated strings', ->
        browser().navigateTo("/test/fixtures/click-nojquery.html")
        element('button#test2').click()
        expect(element('#field').text()).toBe('Success')
