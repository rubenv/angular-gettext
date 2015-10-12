var options = {
  "version": "2.1.2",
  "where": "client",
  "packageName": "rubenv:angular-gettext"
};

// meta data
Package.describe({
  name: options.packageName,
  version: options.version,
  summary: 'Gettext support for Angular.js',
  git: 'git://github.com/rubenv/angular-gettext.git',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@0.9.0', 'METEOR@1.0');
  api.use('angular:angular@1.2.0', options.where);
  api.addFiles('dist/angular-gettext.js', options.where);
});
