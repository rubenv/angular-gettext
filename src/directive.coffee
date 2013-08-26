angular.module('gettext').directive 'translate', (gettextCatalog, $interpolate, $parse) ->
    return {
        transclude: 'element'
        priority: 900
        compile: (element, attrs, transclude) ->
            return ($scope, $element) ->
                err = (missing, found) ->
                    throw new Error("You should add a #{missing} attribute whenever you add a #{found} attribute.")
                err('translate-n', 'translate-plural') if attrs.translatePlural && !attrs.translateN
                err('translate-plural', 'translate-n') if attrs.translateN && !attrs.translatePlural

                countFn = $parse(attrs.translateN)

                transclude $scope, (clone) ->
                    input = clone.html()
                    clone.removeAttr('translate')
                    $element.replaceWith(clone)

                    process = () ->
                        prev = clone.html()
                        if attrs.translatePlural
                            translated = gettextCatalog.getPlural(countFn($scope), input, attrs.translatePlural)
                        else
                            translated = gettextCatalog.getString(input)
                        interpolated = $interpolate(translated)($scope)
                        return if prev == interpolated # Skip DOM change
                        clone.html(interpolated)

                    $scope.$watch(process)
    }
