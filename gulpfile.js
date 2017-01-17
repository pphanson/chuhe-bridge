const webpack = require("webpack");
const gulp = require("gulp");
const del = require("del");
const assetPath = "./public/**/*";
const webpackConfig = require("./webpack.config.js");
const webpackProductionConfig = require("./webpack.config.dist.js");
const runSequence = require("run-sequence");
const express = require('express');
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const cors = require("cors");

gulp.task('clean', cb => {
    del(`${assetPath}`).then(() => cb(), reason => cb(reason));
});


gulp.task('build-app', cb => {
    webpack(webpackProductionConfig, (err, stats) => {
        cb();
    });
});

gulp.task('build-lib-js', cb => {
    gulp.src('./src/lib/**/*.js').pipe(gulp.dest('./public/lib/materialize'));
});

gulp.task('build-lib-css', cb => {
    gulp.src('./src/lib/**/*.css').pipe(gulp.dest('./public/lib/materialize'));
});

gulp.task('build-lib-icon', cb => {
    gulp.src([
        './src/lib/**/*.eot',
        './src/lib/**/*.svg',
        './src/lib/**/*.ttf',
        './src/lib/**/*.woff',
        './src/lib/**/*.woff2'
    ]).pipe(gulp.dest('./public/lib/materialize'));
});

gulp.task('build-lib-image', cb => {
    gulp.src([
        './src/lib/**/*.png',
        './src/lib/**/*.jpg',
        './src/lib/**/*.gif'
    ]).pipe(gulp.dest('./public/lib/materialize'));

    gulp.src('./src/resource/models/**/*')
    .pipe(gulp.dest('./public/models'));
});

gulp.task("build-lib", cb => {
    runSequence(
        [
            'build-lib-js',
            'build-lib-css',
            'build-lib-image',
            'build-lib-icon',
        ],
        cb
    );
});

gulp.task("build", ['clean'], cb => {
    runSequence(
        [
            'build-lib',
            'build-app'
        ],
        cb
    );
});

gulp.task("server:dev", cb => {
    const app = express();
    const compiler = webpack(webpackConfig);
    app.use(express.static("./public"));
    console.log("*".repeat(50) + webpackConfig.output.publicPath + "*".repeat(50));
    app.use(webpackDevMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath,
        stats: {
            colors: true
        }
    }));
    app.use(webpackHotMiddleware(compiler));
    app.use(cors());
    app.options('*', cors());
    app.listen(8080, () => {
        console.log("The dev-server is now running. Please visit http://localhost:8080/");
        cb();
    });
});


gulp.task("dev", ["clean"], cb => {
    runSequence(
        [
            'build-lib',
            'server:dev'
        ],
        cb
    );
});
