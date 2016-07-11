var path = require('path');
var fs = require('fs');
var yargs = require('yargs').argv;
var gulp = require('gulp');
var less = require('gulp-less');
var header = require('gulp-header');
var tap = require('gulp-tap');
var nano = require('gulp-cssnano');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var pkg = require('./package.json');

var option = {base: 'src'};
var dist = __dirname + '/dist';


gulp.task('build:pc:style', function (){
    var banner = [
        '/*!',
        ' * SealUI v<%= pkg.version %>',
        ' * Copyright <%= new Date().getFullYear() %> <%= pkg.author %> (<%= pkg.homepage %>)',
        ' * Licensed under the <%= pkg.license %> license',
        ' */',
        ''].join('\n');
    gulp.src('src/pc/style/sealui-button.less', option)
        .pipe(sourcemaps.init())
        .pipe(tap(function (file) {
            var content = file.contents.toString();
            content = content.replace(/@VERSION/g, pkg.version);
            file.contents = new Buffer(content);
        }))
        .pipe(less().on('error', function (e) {
            console.error(e.message);
            this.emit('end');
        }))
        .pipe(postcss([autoprefixer(['iOS >= 7', 'Android >= 4.1'])]))
        .pipe(header(banner, { pkg : pkg } ))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(dist))
        .pipe(browserSync.reload({stream: true}))
        .pipe(nano({
            zindex: false,
            autoprefixer: false
        }))
        .pipe(rename(function (path) {
            path.basename += '.min';
        }))
        .pipe(gulp.dest(dist));
});

gulp.task('build:mobile:style', function (){
    var banner = [
        '/*!',
        ' * SealUI v<%= pkg.version %>',
        ' * Copyright <%= new Date().getFullYear() %> <%= pkg.author %> (<%= pkg.homepage %>)',
        ' * Licensed under the <%= pkg.license %> license',
        ' */',
        ''].join('\n');
    gulp.src('src/mobile/style/sealui-button.less', option)
        .pipe(sourcemaps.init())
        .pipe(tap(function (file) {
            var content = file.contents.toString();
            content = content.replace(/@VERSION/g, pkg.version);
            file.contents = new Buffer(content);
        }))
        .pipe(less().on('error', function (e) {
            console.error(e.message);
            this.emit('end');
        }))
        .pipe(postcss([autoprefixer(['iOS >= 7', 'Android >= 4.1'])]))
        .pipe(header(banner, { pkg : pkg } ))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(dist))
        .pipe(browserSync.reload({stream: true}))
        .pipe(nano({
            zindex: false,
            autoprefixer: false
        }))
        .pipe(rename(function (path) {
            path.basename += '.min';
        }))
        .pipe(gulp.dest(dist));
});

//编译html
gulp.task('build:html', function (){
    gulp.src('src/**/*.html')
        .pipe(gulp.dest(dist+'/'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('release:pc', ['build:pc:style', 'build:html']);
gulp.task('release:mobile', ['build:mobile:style', 'build:html']);

//监听文件变化
gulp.task('watch', ['release:pc'], function () {
    gulp.watch('./gulpfile.js', ['build:pc:style', 'build:html']);
    gulp.watch('src/pc/style/*', ['build:pc:style']);
    gulp.watch('src/mobile/style/*', ['build:mobile:style']);
    gulp.watch('src/**/*.html', ['build:html']);
});

gulp.task('pc',['release:pc'],function(){

})
gulp.task('mobile',['release:mobile'],function(){

})

//启动一个本地服务器
gulp.task('server', function () {
    yargs.p = yargs.p || 8080;
    browserSync.init({
        server: {
            baseDir: "./dist"
        },
        ui: {
            port: yargs.p + 1,
            weinre: {
                port: yargs.p + 2
            }
        },
        port: yargs.p,
        startPath: yargs.P ? 'pc':'mobile'
    });
});

// 参数说明
//  -w: 实时监听
//  -s: 启动服务器
//  -p: 服务器启动端口，默认8080
gulp.task('default',  function () {
    if (yargs.s) {
        gulp.start('server');
    }

    if (yargs.w) {
        gulp.start('watch');
    }

    if (yargs.P) {
        gulp.start('pc');
    }
    if (yargs.M) {
        gulp.start('mobile');
    }

});