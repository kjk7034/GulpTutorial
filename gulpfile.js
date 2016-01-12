var gulp = require('gulp');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var webserver = require('gulp-webserver');
var open = require('gulp-open');

// 작업 경로 설정
var devSrc = 'front-src/dev';
var devPaths = {
    js: devSrc + '/js/**/*.js',  // 추후 js폴더 밑에 다른 폴더가 생성되더라도 하위 js를 모두 적용
    css: devSrc + '/css/**/*.scss',
    html : devSrc + '/html/**/*.*'
};

// 결과물 경로 설정
var buildSrc = 'front-src/build';

// gulp.task 를 사용하여 task를 추가한다. '테스트명', function (){ return  }
// misson1 = combine-js
gulp.task('combine-js', function () {
    return gulp.src(devPaths.js)
        .pipe(concat('result.js'))
        .pipe(uglify())
        .pipe(gulp.dest(buildSrc + '/js'));
});

// misson2 = compile-sass
gulp.task('compile-sass', function () {
    return gulp.src(devPaths.css)
        .pipe(concat('result.css'))
        .pipe(sass())
        .pipe(minifyCss())
        .pipe(gulp.dest(buildSrc + '/css'));
});

// misson3 = html-move
gulp.task('html-move', function () {
    return gulp.src(devPaths.html)
        .pipe(gulp.dest(buildSrc + '/html'));
});

// misson4 = server
gulp.task('server', ['watch'], function () {
    var options = {
        uri: "http://localhost:8000/html/index.html",
        app: 'chrome'
    };
    return gulp.src(buildSrc + "/")
        .pipe(webserver({
            livereload : true
        }))
        .pipe(open(options));
});
// 파일 변경 감지 paths.js, paths.css, paths.html 해당 경로의 파일들의 수정이 일어나면 해당 테스크가 실행된다.
gulp.task('watch', function () {
    gulp.watch(devPaths.js, ['combine-js']);
    gulp.watch(devPaths.css, ['compile-sass']);
    gulp.watch(devPaths.html, ['html-move']);
});


gulp.task('clean', function () {
    return gulp.src(buildSrc, {read: false})
        .pipe(clean());
});

gulp.task('compile', ['combine-js', 'compile-sass', 'html-move'], function(){
    gulp.start('server')
});

//기본 task 설정
gulp.task('default', ['clean'], function(){
    gulp.start('compile');
});