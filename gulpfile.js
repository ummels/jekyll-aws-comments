var gulp = require('gulp');
var lambda = require('gulp-awslambda');
var zip = require('gulp-zip');
var del = require('del');
var install = require('gulp-install');

var lambdaParams = {
	FunctionName: 'processComment',
	Role: 'arn:aws:iam::437205210840:role/lambda_basic_execution'
};
var awsOpts = {
  region: 'us-west-2'
}

gulp.task('clean', function() {
  return del(['./dist', './dist.zip']);
});

gulp.task('js', function() {
  return gulp.src(['index.js', 'comments.js', 'config.json'])
    .pipe(gulp.dest('dist/'));
});

gulp.task('node-modules', function() {
  return gulp.src('./package.json')
    .pipe(gulp.dest('dist/'))
    .pipe(install({production: true}));
});

gulp.task('zip', ['js', 'node-modules'], function() {
  return gulp.src(['dist/**/*', '!dist/package.json'])
    .pipe(zip('dist.zip'))
    .pipe(gulp.dest('./'));
});

gulp.task('deploy', ['zip'], function() {
  return gulp.src('dist.zip')
    .pipe(lambda(lambdaParams, awsOpts))
});

gulp.task('default', ['zip']);
