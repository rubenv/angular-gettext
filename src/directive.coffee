angular.module('gettext').directive 'translate', (gettextCatalog, $interpolate, $parse) ->
    return {
        compile: (element, attrs) ->
            err = (missing, found) ->
                throw new Error("You should add a #{missing} attribute whenever you add a #{found} attribute.")
            err('translate-n', 'translate-plural') if attrs.translatePlural && !attrs.translateN
            err('translate-plural', 'translate-n') if attrs.translateN && !attrs.translatePlural

            input = element.html()

            return (scope) ->
                countFn = $parse(attrs.translateN)

                process = () ->
                    prev = element.html()
                    if attrs.translatePlural
                        translated = gettextCatalog.getPlural(countFn(scope), input, attrs.translatePlural)
                    else
                        translated = gettextCatalog.getString(input)
                    interpolated = $interpolate(translated)(scope)
                    return if prev == interpolated # Skip DOM change
                    element.html(interpolated)

                scope.$watch(process)
    }
