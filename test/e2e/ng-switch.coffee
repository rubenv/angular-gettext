describe 'ng-switch', ->
    it 'Should replace translated term on load', ->
        browser().navigateTo("/test/fixtures/ng-switch.html")
        expect(element('#visibleSwitchContent').text()).toBe('Hallo')

    it 'Should replace translated term when switch value changes', ->
        browser().navigateTo("/test/fixtures/ng-switch.html")
        element('#goodbyeBtn').click()
        expect(element('#hiddenSwitchContent').text()).toBe('Vaarwel') 