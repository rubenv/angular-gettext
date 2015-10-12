var packageName = 'rubenv:angular-gettext';

var where = 'client';
var version = '2.1.0';

// meta data
Package.describe({
  name: packageName,
  version: version,
  summary: 'Gettext support for Angular.js',
  git: 'git://github.com/rubenv/angular-gettext.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@0.9.0', 'METEOR@1.0');
  api.use('angular:angular@1.2.0', where);
  api.addFiles('dist/angular-gettext.js', where);
});
