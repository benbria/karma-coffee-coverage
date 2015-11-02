"use strict";
var fs = require('fs');
var coffeeCoverage = require('coffee-coverage');
var CoverageInstrumentor = coffeeCoverage.CoverageInstrumentor;
var ISTANBUL_COVERAGE_VAR = '__coverage__';

/**
 * Mimics the `StringStream` class found in `coffee-coverage`. We use it to get init data from all our instrumented
 * files written to us.
 */
var StringStream = (function() {
    function StringStream() {
        this.data = "";
    }

    StringStream.prototype.write = function(data) {
        this.data += data;
    };

    return StringStream;
})();

/**
 * Write a file with all the initialization code for all the files we intend to report on.
 *
 * Will do all of its work as soon as karma requires it. It will walkn `sourcesBasePath`, instrument it, take all the
 * init code and write that code to `dest`. You can then tell karma to include this file to get a zero count for _all_
 * files you wish to know about.
 */
var initCoveragePlugin = function(config, logger, helper) {
    var log = logger.create('framework.coffee-coverage');
    var basePath, dest, defaultOptions, instrumentor, initJs, options, singleOptions;
    config = config || {};
    config.framwork = config.framwork || {};

    if (!config.framework.initAllSources) return;

    basePath = config.framework.sourcesBasePath;
    dest = config.framework.dest;

    if (!basePath || !dest) {
        log.warn('Need `sourcesBasePath` and `dest` for framework');
        return;
    }

    defaultOptions = {};
    if (config.framework.instrumentor === 'istanbul') {
        defaultOptions.coverageVar = ISTANBUL_COVERAGE_VAR;
    }

    options = helper.merge({}, defaultOptions, config.framework);

    instrumentor = new CoverageInstrumentor(options);

    initJs = new StringStream();
    singleOptions = helper.merge(options, {
        initFileStream: initJs
    });
    instrumentor.instrumentDirectory(basePath, null, singleOptions);
    fs.writeFileSync(dest, initJs.data);
};

initCoveragePlugin.$inject = ['config.coffeeCoverage', 'logger', 'helper'];

/**
 * Transform a coffee file into js source that is instrumented with coffee-coverage
 */
var createPreprocessor = function(args, config, logger, helper) {
    var log = logger.create('preprocessor.coffee-coverage');
    var options = {};
    config = config || {};
    config.preprocessor = config.preprocessor || {};

    if (config.preprocessor.instrumentor === 'istanbul') {
        options.coverageVar = ISTANBUL_COVERAGE_VAR;
    }

    options = helper.merge({}, options, config.preprocessor);

    var instrumentor = new CoverageInstrumentor(options);

    return function (content, file, done) {
        try {
            var instrumented = instrumentor.instrumentCoffee(file.originalPath, content);
            var js = options.noInit ? instrumented.js : instrumented.init + instrumented.js;
            file.path = file.originalPath.replace(/\.coffee$/, '.js');
            done(null, js);
        } catch (err) {
            done(err);
        }
    }
};

createPreprocessor.$inject = ['args', 'config.coffeeCoverage', 'logger', 'helper'];

// PUBLISH DI MODULE
module.exports = {
  'framework:coffee-coverage'   : ['factory', initCoveragePlugin],
  'preprocessor:coffee-coverage': ['factory', createPreprocessor]
};
