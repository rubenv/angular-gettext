angular.module('gettext').directive 'translate', (gettextCatalog) ->
    return {
        compile: (element, attrs) ->
            input = element.html()
            translated = gettextCatalog.getString(input)
            element.html(translated)
    }
