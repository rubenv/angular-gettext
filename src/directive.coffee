angular.module('gettext').directive 'translate', (gettextCatalog) ->
    return {
        compile: (element, attrs) ->
            input = element.html()

            if attrs.translatePlural && attrs.translateN == null
                throw new Error("You should add a translate-plural attribute whenever you add a translate-n attribute.")

            if !attrs.translatePlural
                translated = gettextCatalog.getString(input)
            else
                translated = gettextCatalog.getPlural(attrs.translateN, input, attrs.translatePlural)

            element.html(translated)
    }
