"use strict";

let gulp = require('gulp');
let awspublish = require('gulp-awspublish');

let headers = {
  // 'Cache-Control': 'max-age=315360000, no-transform, public'
};

module.exports = function deployToS3() {
  let publisher = awspublish.create({
    region: 'us-east-1',
    params: {
      Bucket: 'temp.thegovlab.org'
    }
  });

  return gulp.src('./public/**')
    .pipe(publisher.publish(headers))
    .pipe(awspublish.reporter());
};
