describe 'Click', ->
    it 'Should not break ng-click', ->
        browser().navigateTo("/test/fixtures/click.html")
        element('button#test1').click()
        expect(element('#field').text()).toBe('Success')

    it 'Should not break ng-click for translated strings', ->
        browser().navigateTo("/test/fixtures/click.html")
        element('button#test2').click()
        expect(element('#field').text()).toBe('Success')

    it 'Should compile ng-click', ->
        browser().navigateTo("/test/fixtures/click.html")
        element('#test3 button').click()
        expect(element('#field').text()).toBe('Success')

    it 'Should not compile ng-click', ->
        browser().navigateTo("/test/fixtures/click-nojquery.html")
        element('#test4 button').click()
        expect(element('#field').text()).toBe('')

describe 'Click (no jQuery)', ->
    it 'Should not break ng-click', ->
        browser().navigateTo("/test/fixtures/click-nojquery.html")
        element('button#test1').click()
        expect(element('#field').text()).toBe('Success')

    it 'Should not break ng-click for translated strings', ->
        browser().navigateTo("/test/fixtures/click-nojquery.html")
        element('button#test2').click()
        expect(element('#field').text()).toBe('Success')

    it 'Should compile ng-click', ->
        browser().navigateTo("/test/fixtures/click-nojquery.html")
        element('#test3 button').click()
        expect(element('#field').text()).toBe('Success')

    it 'Should not compile ng-click', ->
        browser().navigateTo("/test/fixtures/click-nojquery.html")
        element('#test4 button').click()
        expect(element('#field').text()).toBe('')
