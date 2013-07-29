angular.module('gettext').filter 'translate', (gettextCatalog, $interpolate, $parse) ->
    return (input) ->
        return gettextCatalog.getString(input)

