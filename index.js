//'use strict'
var fs = require('fs');
var coffeeCoverage = require('coffee-coverage');
var CoverageInstrumentor = coffeeCoverage.CoverageInstrumentor;

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
    }

    return StringStream;
})();

/**
 * Write a file with all the initialization code for all the files we intend to report on.
 *
 * Will do all of its work as soon as karma requires it. It will walkn `sourcesBasePath`, instrument it, take all the
 * init code and write that code to `dest`. You can then tell karma to include this file to get a zero count for _all_
 * files you wish to know about.
 */
var addInitCoverage = function(config, logger, helper) {
    var log = logger.create('framework.coffee-coverage');
    var basePath, dest, defaultOptions, instrumentor, initJs, singleOptions;

    if ("undefined" !== typeof config.framework) {
        if (!config.framework.initAllSources) return;
        basePath = config.framework.sourcesBasePath;
        dest = config.framework.dest;
    }

    if (!basePath || !dest) {
        log.warn('Need `sourcesBasePath` and `dest` for framework');
        return;
    }

    defaultOptions = {
        coverageVar: '__coverage__',
        instrumentor: 'istanbul'
    }

    options = helper.merge(defaultOptions, config.framework || {});

    instrumentor = new CoverageInstrumentor(options);

    initJs = new StringStream();
    singleOptions = helper.merge(options, {
        initFileStream: initJs
    });
    instrumentor.instrumentDirectory(basePath, null, singleOptions);
    fs.writeFileSync(dest, initJs.data);
}

addInitCoverage.$inject = ['config.coffeeCoverage', 'logger', 'helper'];

// PUBLISH DI MODULE
module.exports = {
  'framework:coffee-coverage': ['factory', addInitCoverage]
};