var gulp = require("gulp");
var uglify = require("gulp-uglify");
var readable = require("readable-stream");
let rename = require("gulp-rename");

gulp.task("compress", function() {
  return gulp
    .src("client-side/wasabilib/js/*.js")

    .pipe(rename({ suffix: ".min" }))
    .pipe(
      uglify({
        mangle: true
      }).on("error", function(err) {
        console.error("Error in compress task", err.toString());
      })
    )
    .pipe(gulp.dest("client-side/wasabilib/js/min"));
});
