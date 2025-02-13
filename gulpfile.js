const gulp = require('gulp');
require('dotenv').config();

// CONFIGURE ENVIRONMENT VARIABLES
gulp.task('set', function () {
  const argv = require('yargs').argv;
  const rename = require('gulp-rename');

  return gulp
    .src(`.env.${argv.env}`)
    .pipe(rename('.env'))
    .pipe(gulp.dest('./'));
});

gulp.task('dev', function () {
  const rename = require('gulp-rename');

  return gulp
    .src(`serverless.local.yml`)
    .pipe(rename('serverless.yml'))
    .pipe(gulp.dest('./'));
});

gulp.task('deploy', function () {
  const rename = require('gulp-rename');

  return gulp
    .src(`serverless.deploy.yml`)
    .pipe(rename('serverless.yml'))
    .pipe(gulp.dest('./'));
});
