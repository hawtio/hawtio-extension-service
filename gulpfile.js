var gulp = require('gulp'),
    wiredep = require('wiredep').stream,
    gulpLoadPlugins = require('gulp-load-plugins');

var plugins = gulpLoadPlugins({ lazy: false });
var pkg = require('./package.json');

var config = {
  src: 'plugins/**/*.js',
  templates: 'plugins/**/*.html',
  js: pkg.name + '.js',
  template: pkg.name + '-template.js',
  templateModule: pkg.name + '-template'
};

gulp.task('bower', function() {
  gulp.src('index.html')
    .pipe(wiredep({
    }))
    .pipe(gulp.dest('.'));
});

gulp.task('templates', function() {
  return gulp.src(config.templates)
    .pipe(plugins.angularTemplatecache({
      filename: 'templates.js',
      root: 'plugins/',
      standalone: true,
      module: config.templateModule,
      templateFooter: '}]); hawtioPluginLoader.addModule("' + config.templateModule + '");'
    }))
    .pipe(gulp.dest('.'));
});

gulp.task('concat', ['templates'], function() {
  return gulp.src([config.src, './templates.js'])
    .pipe(plugins.concat(config.js))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('clean', ['concat'], function() {
  return gulp.src('./templates.js', { read: false })
    .pipe(plugins.clean());
});

gulp.task('connect', function() {
  plugins.watch([config.src, config.templates], function() {
    gulp.start('build');
  });
  plugins.watch(['libs/**/*.js', 'libs/**/*.css', 'index.html', 'dist/' + config.js], function() {
    gulp.start('reload');
  });
  plugins.connect.server({
    root: '.',
    livereload: true,
    port: 2772,
    fallback: 'index.html'
  });
});

gulp.task('reload', function() {
  gulp.src('.')
    .pipe(plugins.connect.reload());
});

gulp.task('build', ['templates', 'concat', 'clean']);
gulp.task('default', ['build', 'connect']);
