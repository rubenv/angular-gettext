angular.module('gettext').factory 'gettextCatalog', (gettextPlurals) ->
    class Catalog
        constructor: () ->
            @debug = false
            @strings = {}
            @currentLanguage = 'en'

        setStrings: (language, strings) ->
            @strings[language] = strings

        getString: (string) ->
            return @strings[@currentLanguage]?[string] || (if @debug then "[MISSING]: #{string}" else string)

        getPlural: (n, string, stringPlural) ->
            form = gettextPlurals(@currentLanguage, n)
            plurals = @strings[@currentLanguage]?['_plurals']?[string] || []
            return plurals[form] || (if n == 1 then string else stringPlural)


    return new Catalog()
