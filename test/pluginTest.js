"use strict";
var expect = require('chai').expect;
var initCoveragePlugin = require('../')['framework:coffee-coverage'][1];
var createPreprocessor = require('../')['preprocessor:coffee-coverage'][1];
var sinon = require('sinon');
var coffeeCoverage = require('coffee-coverage');
var merge = require('lodash.assign');
var fs = require('fs');
var path = require('path');
var instrumentors = {
    istanbul: require('coffee-coverage/lib/instrumentors/istanbul'),
    jsCoverage: require('coffee-coverage/lib/instrumentors/JSCoverage')
}

/**
 * Mocks
 */
var helper = {
    merge: merge
};

var loggers = {
    warn: function warn(msg) {
        return;
    }
};

var logger = {
    create: function(name) {
        return {
            warn: loggers.warn
        };
    }
};

/**
 * Stubs
 */
var stubs = {};

describe('Karma Coffee Coverage', function() {

    describe('Framework Plugin', function() {

        beforeEach(function() {
            stubs.instrumentDirectory = sinon
            .stub(coffeeCoverage.CoverageInstrumentor.prototype, 'instrumentDirectory', function(source, out, options) {
                if (!options.initFileStream) return;

                var coverageVar = (function() {
                    if (options.coverageVar) {
                        return options.coverageVar;
                    } else if (options.instrumentor === 'istanbul') {
                        return '__coverage__';
                    } else {
                        return instrumentors.jsCoverage.getDefaultOptions().coverageVar;
                    }
                })();

                options.initFileStream.write('window.' + coverageVar + ' = {};');

                return;
            });

            stubs.writeFileSync = sinon.stub(fs, 'writeFileSync');
        });

        afterEach(function() {
            coffeeCoverage.CoverageInstrumentor.prototype.instrumentDirectory.restore();
            fs.writeFileSync.restore();
        });

        it('should exit unless `initAllSources`', function() {
            var config = {
                framework: {}
            };
            initCoveragePlugin(config, logger, helper);
            expect(stubs.instrumentDirectory.called).to.not.be.ok;
            expect(stubs.writeFileSync.called).to.not.be.ok;
        });

        it('should exit when omitting `basePath` or `dest`', function() {
            var config = {
                framework: {
                    initAllSources: true
                }
            };
            var logSpy = sinon.spy(loggers, 'warn');
            initCoveragePlugin(config, logger, helper);
            expect(logSpy.calledWith('Need `sourcesBasePath` and `dest` for framework')).to.be.ok;
        });

        it('should run with default options', function() {
            var config = {
                framework: {
                    initAllSources: true,
                    sourcesBasePath: 'assets',
                    dest: 'build-test',
                    instrumentor: 'istanbul'
                }
            };
            initCoveragePlugin(config, logger, helper);
            expect(stubs.writeFileSync.calledWith('build-test', 'window.__coverage__ = {};')).to.be.ok;
        });

        it('should use custom coverage var for istanbul', function() {
            var config = {
                framework: {
                    initAllSources: true,
                    sourcesBasePath: 'assets',
                    dest: 'build-test',
                    coverageVar: '__fooFooVar__',
                    instrumentor: 'istanbul'
                }
            };
            initCoveragePlugin(config, logger, helper);
            expect(stubs.instrumentDirectory.args[0][2].coverageVar).to.equal('__fooFooVar__');
            expect(stubs.instrumentDirectory.args[0][2].instrumentor).to.equal('istanbul');
            expect(stubs.writeFileSync.calledWith('build-test', 'window.__fooFooVar__ = {};')).to.be.ok;
        });

        it('should use default jscoverage var', function() {
            var config = {
                framework: {
                    initAllSources: true,
                    sourcesBasePath: 'assets',
                    dest: 'build-test',
                    instrumentor: 'jscoverage'
                }
            };
            initCoveragePlugin(config, logger, helper);
            expect(stubs.instrumentDirectory.args[0][2].instrumentor).to.equal('jscoverage');
            expect(
                stubs.writeFileSync.calledWith(
                    'build-test', 'window.' + instrumentors.jsCoverage.getDefaultOptions().coverageVar + ' = {};'
                )
            ).to.be.ok;
        });

    });

    describe('Preprocessor', function () {
        var cwd = process.cwd();
        var coffeeFilePath = path.resolve(cwd, 'test/fixtures/index.coffee');

        var originalSrc = fs.readFileSync(coffeeFilePath).toString('utf8');
        var istanbulSrc = fs.readFileSync(path.resolve(cwd, 'test/fixtures/istanbulIndex.js')).toString('utf8');
        var jscoverageSrc = fs.readFileSync(path.resolve(cwd, 'test/fixtures/jscoverageIndex.js')).toString('utf8');

        it('should transform coffee code to istanbul js', function (done) {
            var config = {
                preprocessor: {
                    instrumentor: 'istanbul'
                }
            }
            var transformer = createPreprocessor({}, config, logger, helper);
            var file = {
                originalPath: coffeeFilePath,
                path: coffeeFilePath
            }
            transformer(originalSrc, file, function(err, js) {
                var error = null;
                try {
                    expect(js).to.eq(istanbulSrc);
                } catch (err) {
                    error = err;
                } finally {
                    done(error);
                }
            });
        });

        it('should transform coffee code to jsCoverage js', function (done) {
            var config = {}
            var transformer = createPreprocessor({}, config, logger, helper);
            var file = {
                originalPath: coffeeFilePath,
                path: coffeeFilePath
            }
            transformer(originalSrc, file, function(err, js) {
                var error = null;
                try {
                    expect(js).to.eq(jscoverageSrc);
                } catch (err) {
                    error = err;
                } finally {
                    done(error);
                }
            });
        });
    });
});
