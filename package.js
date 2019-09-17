Package.describe({
  name: 'd3k4y:autoform-bs-datetimepicker',
  summary: 'Custom bootstrap-datetimepicker input type with timezone support for AutoForm',
  version: '1.0.8',
  git: 'https://github.com/aldeed/meteor-autoform-bs-datetimepicker.git'
});


Npm.depends({
    // jquery: "3.3.1",
    // "bootstrap-datepicker": "1.8.0",
    "bootstrap-datetime-picker": "2.4.4",
});


Package.onUse(function(api) {
  api.versionsFrom("1.7.0.3");

  api.use('ecmascript');
  api.use('templating@1.0.0');
  api.use('blaze@2.0.0');
  api.use('aldeed:autoform@6.2.0');

  // Ensure momentjs packages load before this one if used
  api.use('momentjs:moment@2.8.4', 'client', {weak: true});
  api.use('mrt:moment-timezone@0.2.1', 'client', {weak: true});

  api.addFiles([
    'autoform-bs-datetimepicker.html',
    'autoform-bs-datetimepicker.js'
  ], 'client');
});
