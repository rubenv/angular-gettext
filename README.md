# angular-gettext - gettext utilities for angular.js

> Translate your Angular.JS applications with gettext.

[![Build Status](https://travis-ci.org/rubenv/angular-gettext.png?branch=master)](https://travis-ci.org/rubenv/angular-gettext)

## Getting started

Add angular-gettext to your project:

1. Grab the files, either by copying the files from the `dist` folder or (preferably) through bower: `bower install --save angular-gettext`.
2. Include the angular-gettext source files in your app:
   
   ```html
   <script src="bower_components/angular-gettext/dist/angular-gettext.min.js"></script>
   ```
   
3. Add a dependency to angular-gettext in your Angular app:

   ```js
   angular.module('myApp', ['gettext']);
   ```
   
You can now start using the `translate` directive to mark strings as translatable.

Next steps:

* Annotate strings with the `translate` directive.
* Extract strings from the source code.
* Translate strings
* Integrate translated strings back into the application.
* Set the correct language for translations.

## Using the `translate` directive

Strings are marked as translatable using the `translate` directive. Here's a simple example:

```html
 <h1 translate>Hello!</h1>
```

This div will automatically be translated using the translated strings (which we'll define later on). For instance, in Dutch, it might read `Hallo!`.

### Plurals

Plural strings can be annotated using two extra attributes: `translate-n` and `translate-plural`:

```html
 <div translate translate-n="count" translate-plural="{{count}} boats">One boat</div>
```

The general format is:

```html
 <div translate translate-n="COUNTEXPR" translate-plural="PLURALSTR">SINGULARSTR</div>
```

Depending on the value of `COUNTEXPR`, either the singular string or the plural string will be selected.

### Interpolation

Full interpolation support is available in translated strings, so the following will work as expected:

```html
 <div translate>Hello {{name}}!</div>
```

## Extracting strings

Use [`grunt-angular-gettext`](https://github.com/rubenv/grunt-angular-gettext) to extract strings from your HTML templates into a `.pot` catalog.

## Translate strings

Use a tool like [poedit](http://www.poedit.net/), [Pootle](http://pootle.translatehouse.org/) or [Transifex](https://www.transifex.com/) to translate the strings.

## Setting translated strings

You can set translated strings by injecting the `gettextCatalog` and using the `setStrings` method.

As an example, you may have the following code in your application:

```js
angular.module('myApp').run(function (gettextCatalog) {
    // Load the strings automatically during initialization.
    gettextCatalog.setStrings('nl', {
        'Hello': 'Hallo',
        'One boat': ['Een boot', '{{count}} boats']
    });
});
```

Converting translated `.po` files into angular-compatible JavaScript files can be done automatically using the [`grunt-angular-gettext`](https://github.com/rubenv/grunt-angular-gettext) module.

## Setting the language

Set the language by setting a language code on the catalog:

```js
angular.module('myApp').run(function (gettextCatalog) {
    gettextCatalog.currentLanguage = 'nl';
});
```

You can do this anywhere in your application, the use of a `run` block above is just an example.

## Contributing
All code lives in the `src` folder and is written in CoffeeScript. Try to stick to the style conventions used in existing code.

Tests can be run using `grunt test`. A convenience command to automatically run the tests is also available: `grunt watch`. Please add test cases when adding new functionality: this will prove that it works and ensure that it will keep working in the future.
    
## License 

    (The MIT License)

    Copyright (C) 2013 by Ruben Vermeersch <ruben@savanne.be>

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.
