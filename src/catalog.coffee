angular.module('gettext').factory 'gettextCatalog', (gettextPlurals) ->
    class Catalog
        constructor: () ->
            @debug = false
            @strings = {}
            @currentLanguage = 'en'

        prefixDebug = (debug, string) ->
            if debug then "[MISSING]: #{string}" else string

        setStrings: (language, strings) ->
            @strings[language] = {}
            for key, val of strings
                if typeof val == 'string'
                    @strings[language][key] = [val]
                else
                    @strings[language][key] = val

        getString: (string) ->
            return @strings[@currentLanguage]?[string]?[0] || prefixDebug(@debug, string)

        getPlural: (n, string, stringPlural) ->
            form = gettextPlurals(@currentLanguage, n)
            plurals = @strings[@currentLanguage]?[string] || []
            return plurals[form] || prefixDebug(@debug, (if n == 1 then string else stringPlural))


    return new Catalog()
