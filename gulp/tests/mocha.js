import gulp from 'gulp';
import PATHS from './../helpers/src-paths';

import istanbul from 'gulp-istanbul';
import {Instrumenter} from 'isparta';
import mocha from 'gulp-mocha';

gulp.task('mocha', done => {
    gulp.src(PATHS.APP_ALL)
        .pipe(istanbul({
            instrumenters: {isparta: Instrumenter},
            instrumenter: {
                '**/*.js': 'isparta'
            },
            includeUntested: true
        }))
        .pipe(istanbul.hookRequire()) // Force `require` to return covered files
        .on('finish', () => {
            return gulp.src(PATHS.TEST_SRC, {read: false})
                .pipe(mocha({
                    compilers: 'js:babel-core/register',
                    recursive: true
                }))
                .pipe(istanbul.writeReports({
                    dir: './coverage',
                    reporters: ['lcov'],
                    reportOpts: {dir: './coverage'}
                }))
                .on('end', done);
        });
});

gulp.task('tdd', () => {
    return gulp.watch(['src/*.js', 'test/*.js'], ['mocha']);
});
