/* tslint:disable */
/* eslint-disable no-console, no-multi-spaces, import/no-extraneous-dependencies */
const gulp         = require('gulp');
const runSequence  = require('run-sequence');
const Spinner      = require('cli-spinner').Spinner;
const gutil        = require('gulp-util');
const del          = require('del');
const fs           = require('fs-extra');
const cssnano      = require('gulp-cssnano');
const sass         = require('gulp-sass');
const notify 	   = require('gulp-notify');
const chalk        = require('chalk');
// ...
gutil.log = gutil.noop;

gulp.task('watch', () => {
	gulp.run('build');
	gulp.watch([`src/**/*`], ['build']);
});

gulp.task('clean:client', () => {
	return del([`app/**/*`]);
});

gulp.task('pullBootstrapCSS:client', () => {
	return gulp.src(['node_modules/bootstrap/dist/css/bootstrap.min.css'])
		.pipe(gulp.dest('app/css'));
});

gulp.task('pullBootstrapJS:client', () => {
	return gulp.src(['node_modules/bootstrap/dist/js/bootstrap.min.js'])
		.pipe(gulp.dest('app/js'));
});

gulp.task('pullJQuery:client', () => {
	return gulp.src(['node_modules/jquery/dist/jquery.min.js'])
		.pipe(gulp.dest('app/js'));
});

gulp.task('copyJS:client', () => {
	return gulp.src(['src/js/**/*'])
		.pipe(gulp.dest('app/js'));
});

gulp.task('copyHTML:client', () => {
	return gulp.src(['src/*.html'])
		.pipe(gulp.dest('app/'));
});

gulp.task('copyImages:client', () => {
	return gulp.src(['src/img/**/*'])
		.pipe(gulp.dest('app/img'));
});

gulp.task('sass:client', () => {
	return gulp.src([`src/sass/main.scss`])
		.pipe(sass())
		.pipe(cssnano())
		.pipe(gulp.dest(`app/css`));
});

gulp.task('default', () => {
	runSequence('build', 'watch');
});

gulp.task('build', (done) => {
	const spinner = new Spinner('processing.. %s');
	spinner.setSpinnerString(18);
	spinner.setSpinnerTitle('%s Rebuilding the application...');
	spinner.start();

	return fs.mkdirp(`app/`, () => {
		runSequence(
			'clean:client',
            'pullBootstrapCSS:client',
			'pullBootstrapJS:client',
            'pullJQuery:client',
            'sass:client',
            'copyJS:client',
            'copyHTML:client',
            'copyImages:client',

			() => {
				spinner.stop();
				console.log(chalk.yellow(`App built in app/`));
				gulp.src('package.json')
					.pipe(notify({
						title: 'Scoreboard build',
						message: 'A new build is ready',
					}));
				done();
			});
	});
});