var gulp = require('gulp');
var lambda = require('gulp-awslambda');
var zip = require('gulp-zip');
var del = require('del');
var install = require('gulp-install');

var lambdaParams = {
  FunctionName: 'processComment',
  Role: 'arn:aws:iam::437205210840:role/lambda_basic_execution',
  Handler: 'index.handler',
  Runtime: 'nodejs6.10'
};
var awsOpts = {
  region: 'us-west-2'
}

gulp.task('clean', () =>
  del(['./dist', './dist.zip'])
);

gulp.task('js', () =>
  gulp.src(['index.js', 'comments.js', 'config.json'])
      .pipe(gulp.dest('dist/'))
);

gulp.task('node-modules', () =>
  gulp.src('./package.json')
      .pipe(gulp.dest('dist/'))
      .pipe(install({production: true}))
);

gulp.task('zip', ['js', 'node-modules'], () =>
  gulp.src(['dist/**/*', '!dist/package.json'])
      .pipe(zip('dist.zip'))
      .pipe(gulp.dest('./'))
);

gulp.task('deploy', ['zip'], () =>
  gulp.src('dist.zip')
      .pipe(lambda(lambdaParams, awsOpts))
);

gulp.task('default', ['zip']);
