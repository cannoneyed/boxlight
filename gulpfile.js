const gulp = require('gulp')
const sass = require('gulp-sass')
const rename = require('gulp-rename')
const cssmin = require('gulp-minify-css')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')
const scsslint = require('gulp-sass-lint')
const cache = require('gulp-cached')
const prefix = require('gulp-autoprefixer')
const minifyHTML = require('gulp-minify-html')
const size = require('gulp-size')
const imagemin = require('gulp-imagemin')
const pngquant = require('imagemin-pngquant')
const plumber = require('gulp-plumber')
const deploy = require('gulp-gh-pages')
const notify = require('gulp-notify')
const browserify = require('browserify')
const babelify = require('babelify')
const source = require('vinyl-source-stream')
const serve = require('gulp-serve')
const urlAdjuster = require('gulp-css-url-adjuster')

gulp.task('scss', function() {
  function onError(err) {
    notify.onError({
      title: 'Gulp',
      subtitle: 'Failure!',
      message: 'Error: <%= error.message %>',
      sound: 'Beep',
    })(err)
    this.emit('end')
  }

  return gulp.src('src/scss/main.scss')
    .pipe(plumber({errorHandler: onError}))
    .pipe(sass())
    .pipe(urlAdjuster({
      prependRelative: '/',
    }))
    .pipe(size({ gzip: true, showFiles: true }))
    .pipe(prefix())
    .pipe(rename('bundle.css'))
    .pipe(gulp.dest('dist/css'))
    // .pipe(reload({stream: true}))
    // .pipe(cssmin())
    .pipe(size({ gzip: true, showFiles: true }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/css'))
})

gulp.task('serve', serve('dist'))

gulp.task('deploy', function() {
  return gulp.src('dist/**/*')
    .pipe(deploy())
})

gulp.task('js', function() {
  return browserify({entries: 'src/js/index.js', extensions: ['.js'], debug: true})
    .transform(babelify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('dist/js'))
})

gulp.task('scss-lint', function() {
  gulp.src('scss/**/*.scss')
    .pipe(cache('scsslint'))
    .pipe(scsslint())
})

gulp.task('minify-html', function() {
  const opts = {
    comments: true,
    spare: true,
  }

  gulp.src('./*.html')
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest('dist/'))
    // .pipe(reload({stream: true}))
})

gulp.task('watch', function() {
  gulp.watch('src/scss/**/*.scss', ['scss'])
  gulp.watch('src/js/**/*.js', ['js'])
  gulp.watch('./*.html', ['minify-html'])
  gulp.watch('img/*', ['imgmin'])
})

gulp.task('imgmin', function() {
  return gulp.src('img/*')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()],
    }))
    .pipe(gulp.dest('dist/img'))
})


gulp.task('default', ['js', 'imgmin', 'minify-html', 'scss', 'watch', 'serve'])
