"use strict";
var expect = require('chai').expect;
var addInitCoverage = require('../')['framework:coffee-coverage'][1];
var sinon = require('sinon');
var coffeeCoverage = require('coffee-coverage');
var merge = require('lodash.assign');
var fs = require('fs');
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
        addInitCoverage(config, logger, helper);
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
        addInitCoverage(config, logger, helper);
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
        addInitCoverage(config, logger, helper);
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
        addInitCoverage(config, logger, helper);
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
        addInitCoverage(config, logger, helper);
        expect(stubs.instrumentDirectory.args[0][2].instrumentor).to.equal('jscoverage');
        expect(
            stubs.writeFileSync.calledWith(
                'build-test', 'window.' + instrumentors.jsCoverage.getDefaultOptions().coverageVar + ' = {};'
            )
        ).to.be.ok;
    });
});
