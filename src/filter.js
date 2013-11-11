angular.module('gettext').filter('translate', function (gettextCatalog, $interpolate, $parse) {
    return function (input) {
        var translation = gettextCatalog.getString(input),
            argumentsForSprintf = Array.prototype.slice.call(arguments, 1);
        return vsprintf(translation, argumentsForSprintf);
    };
});

angular.module('gettext').filter('translateN', function (gettextCatalog) {
    return function (input, n, translatePlural) {
        // Validate filter parameters
        var nIsNumber = typeof(n) === "number",
            nIsStringNumber = !isNaN(parseInt(n, 10));
        if (!nIsNumber && !nIsStringNumber) {
            throw new Error("First parameter of translateN must be a number, or a string with number, not " + n + ".");
        }
        if (typeof(translatePlural) !== "string") {
            throw new Error("Second parameter of translateN must be a string with plural form, not " + n + ".");
        }
        var translated = gettextCatalog.getPlural(n, input, translatePlural),
            isArgumentObject =
                typeof(arguments[3]) === "object" && arguments[3] !== null;

        return isArgumentObject ?
            sprintf(translated, arguments[3]) :
            vsprintf(translated, Array.prototype.slice.call(arguments, 3));
    };
});
