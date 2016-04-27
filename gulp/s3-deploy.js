"use strict";

let gulp = require('gulp');
let awspublish = require('gulp-awspublish');

let headers = {
  // TODO: Enable Cache-Control for production.
  // 'Cache-Control': 'max-age=315360000, no-transform, public'
};

module.exports = function deployToS3() {
  let publisher = awspublish.create({
    region: 'us-east-1',
    params: {
      // TODO: Use a real bucket, or use a different bucket depending on
      // production/staging/dev configuration.
      Bucket: 'temp.thegovlab.org'
    }
  });

  // TODO: Use awspublish.gzip() to gzip files.

  return gulp.src('./public/**')
    .pipe(publisher.publish(headers))
    .pipe(awspublish.reporter());
};
