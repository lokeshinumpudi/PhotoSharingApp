var gulp = require('gulp');
var csso = require('gulp-csso');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var recess = require('gulp-recess');
var header = require('gulp-header');
var gulpFilter = require('gulp-filter');
var complexity = require('gulp-complexity');
var ngAnnotate = require('gulp-ng-annotate');
var templateCache = require('gulp-angular-templatecache');

var banner = ['/**',
    ' * Lokis',
    ' * Last Updated: <%= new Date().toUTCString() %>',
    ' */',
    ''
].join('\n');



gulp.task('minify', function() {
   // var templatesFilter = gulpFilter('client/views/*.html');
   // .pipe(templatesFilter)
    //    .pipe(templateCache({ root: 'views', module: 'Instagram' }))
   //     .pipe(templatesFilter.restore())

    return gulp.src([
        'client/vendors/angular/angular.min.js',
        'client/vendors/angular/angular-route.min.js',
        'client/vendors/angular/angular-messages.min.js',
        'client/vendors/*.js',
        'client/app.js',
        'client/templates.js',
        'client/controllers/*.js',
        'client/services/*.js',
        'client/directives/*.js'
    ])
       
        .pipe(concat('app.min.js'))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(header(banner))
        .pipe(gulp.dest('client'));
});


//task complexity

gulp.task('complexity', function() {
    return gulp.src([
            '!client/vendors/*.*',
            '!client/app.min.js',
            'client/**/*.js'
        ])
        .pipe(complexity());
});
//task styles
gulp.task('styles', function() {
    gulp.src([
            '!client/vendors/bootstrap/bootstrap-paper.css',
            'client/css/animate.css',
            'client/css/styles.css'
        ])
        .pipe(concat('styles.min.css'))
        .pipe(csso())
        .pipe(gulp.dest('client/css'));
});

gulp.task('recess', function() {
    gulp.src('client/css/styles.css')
        .pipe(recess())
        .pipe(recess.reporter())
        .pipe(gulp.dest('client/css'));
});


gulp.task('watch', function() {
  gulp.watch(['client/css/*.css', '!client/css/styles.min.css'], ['styles']);
  gulp.watch([
    'client/app.js',
    'client/services/*.js',
    'client/directives/*.js',
    'client/controllers/*.js',
    'client/views/*.html'
  ], ['minify']);
});
gulp.task('default', ['minify']);