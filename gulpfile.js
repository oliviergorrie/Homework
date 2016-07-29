var gulp = require('gulp');
var sass = require('gulp-sass');
var nodemon = require('gulp-nodemon');

gulp.task('sass', function(){
    console.log('sassing.....')
    return gulp.src('public/company.scss')
        .pipe(sass())
        .pipe(gulp.dest('public/css/', {overwrite: true}))
});

gulp.task('watch', function () {

    //gulp.watch('public/company.scss', ['sass']);
});


gulp.task('demon', function () {
    nodemon({
        script: 'app.js',
        ext: 'js, html, scss',
        env: {
            'NODE_ENV': 'development'
        }
    })
        .on('start', ['sass'])
        .on('change', ['sass'])
        .on('restart', function () {
            console.log('restarted!');
        });
});

// Default Task
gulp.task('default', ['demon', 'sass']);