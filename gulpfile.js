/**
 * Created by Mars on 2016/7/6.
 */
var path = require('path');
var gulp = require('gulp');
var eslint = require('gulp-eslint');
var excludeGitignore = require('gulp-exclude-gitignore');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var nsp = require('gulp-nsp');
var plumber = require('gulp-plumber');
var coveralls = require('gulp-coveralls');
var babel = require('gulp-babel');
var del = require('del');
var isparta = require('isparta');

// Initialize the babel transpiler so ES2015 files gets compiled
// when they're loaded
require('babel-core/register');

/**
 * 代码检查
 * ESLint is an open source project originally created by Nicholas C. Zakas in June 2013. Its goal is to provide a pluggable linting utility for JavaScript.
 * http://eslint.org/
 */
gulp.task('eslint', function () {
  return gulp.src('**/*.js')
      .pipe(excludeGitignore())
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError());
});

/**
 * 代码安全性检查
 * A gulp plugin that runs the Node Security Project audit for you
 * https://nodesecurity.io/
 */
gulp.task('nsp', function (cb) {
  nsp({
    package: path.resolve('package.json'),
    output: 'summary',
    stopOnError: false
  }, cb);
});

/**
 * 测试覆盖率
 * Istanbul unit test coverage plugin for gulp. Works on top of any Node.js unit test framework.
 * https://github.com/SBoudrias/gulp-istanbul
 */
gulp.task('istanbul', function () {
  return gulp.src('routes/**/*.js')
      .pipe(excludeGitignore())
      .pipe(istanbul({
        includeUntested: true,
        instrumenter: isparta.Instrumenter
      }))
      .pipe(istanbul.hookRequire());
});

/**
 * 单元测试
 * Mocha is a feature-rich JavaScript test framework running on Node.js and in the browser,
 * making asynchronous testing simple and fun. Mocha tests run serially, allowing for flexible and accurate reporting,
 * while mapping uncaught exceptions to the correct test cases. Hosted on GitHub.
 * https://mochajs.org/
 * https://www.npmjs.com/package/gulp-mocha
 */
gulp.task('mocha', ['istanbul'], function (cb) {
  var mochaErr;
  gulp.src('test/**/*.js')
      .pipe(plumber())
      .pipe(mocha({reporter: 'spec'}))
      .on('error', function (err) {
        mochaErr = err;
      })
      .pipe(istanbul.writeReports())
      .on('end', function () {
        cb(mochaErr);
      });
});

/**
 *
 */
gulp.task('watch', function () {
  gulp.watch(['routes/**/*.js', 'test/**'], ['test']);
});


gulp.task('coveralls', ['mocha'], function () {
  if (!process.env.CI) {
    return;
  }
  return gulp.src(path.join(__dirname, 'coverage/lcov.info'))
      .pipe(coveralls());
});

gulp.task('clean', function () {
  return del('dist');
});

gulp.task('babel', ['clean'], function () {
  return gulp.src('routes/**/*.js')
      .pipe(babel())
      .pipe(gulp.dest('dist'));
});
/**
 * 启动node
 */
var server = require('gulp-develop-server');
gulp.task('server:start',function () {
  server.listen({path:'./bin/www'});
})


gulp.task('prepublish', ['nsp', 'babel']);
gulp.task('default', ['eslint', 'mocha', 'coveralls']);