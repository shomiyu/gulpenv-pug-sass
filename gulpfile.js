const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const mqpacker = require('css-mqpacker');
const autoprefixer = require('gulp-autoprefixer');
const cssmin = require('gulp-cssmin');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const browsersync = require('browser-sync');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const del = require('del');

const paths = {
  src: 'src',
  dist: 'dist'
};

//Sass
gulp.task('css', function () {
  return gulp.src([
    paths.src + '/scss/**/*.scss',
    '!' + paths.src + '/scss/**/_*.scss'
  ])
    .pipe(sourcemaps.init()) // map生成
    .pipe(plumber({ //エラーを検知しデスクトップ通知
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(sass({
      outputStyle: 'expanded'
    })) //Sass -> CSS
    .pipe(autoprefixer({ //ベンダープレフィックスを付与
      overrideBrowserslist: 'last 2 versions'
    }))
    .pipe(postcss([mqpacker()]))
    .pipe(cssmin())
    .pipe(sourcemaps.write('/'))
    .pipe(gulp.dest(paths.dist + '/css'))
});

//Pug
gulp.task('html', function () {
  return gulp.src([
    paths.src + '/pages/**/*.pug',
    '!' + paths.src + '/pages/_include/*.pug'
  ])
    .pipe(plumber({ //エラーを検知しデスクトップ通知
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(pug({ pretty: true })) // 読みやすいコードに整形
    .pipe(gulp.dest(paths.dist))
});

//JavaScript
gulp.task('js', function () {
  return gulp.src(
    paths.src + '/js/**/*'
  )
    .pipe(uglify())//圧縮
    .pipe(gulp.dest(paths.dist + '/js'))
});

//Image File
gulp.task('image', function () {
  return gulp.src(
    paths.src + '/images/**/*'
  )
    .pipe(gulp.dest(paths.dist + '/images'))
});

//Browser Sync
gulp.task('browser-sync', function (done) {
  browsersync({
    server: {
      baseDir: paths.dist
    }
  });
  done();
});

//Watch
gulp.task('watch', function () {
  const reload = () => {
    browserSync.reload(); //リロード
  };
  gulp.watch(paths.src + '/scss/**/*.scss').on('change', gulp.series('css', reload));
  gulp.watch(paths.src + '/pages/**/*.pug').on('change', gulp.series('html', reload));
  gulp.watch(paths.src + '/js/**/*').on('change', gulp.series('js', reload));
  gulp.watch(paths.src + '/images/**/*').on('change', gulp.series('image', reload));
});

//Clean
gulp.task('clean', function (done) {
  del.sync(paths.dist + '/**', '！' + paths.dist);
  done();
});

//Default
gulp.task('default',
  gulp.series(
    'clean',
    gulp.parallel(
      'html',
      'css',
      'js',
      'image',
      'watch',
      'browser-sync'
    )));
