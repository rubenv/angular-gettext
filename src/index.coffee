angular.module('gettext', [])

angular.module('gettext').factory 'gettext', () ->
    # Does nothing, simply returns the input string.
    # 
    # This function serves as a marker for `grunt-angular-gettext` to know that
    # this string should be extracted for translations.
    return (str) -> str
