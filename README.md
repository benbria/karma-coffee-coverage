# karma-coffee-coverage

A set of plugins for the Karma Test Runner to support [coffee-coverage](https://github.com/benbria/coffee-coverage)
(Currently only provides one plugin - the framework plugin)

# Framework Plugin

Use this plugin to create an initial _empty_ coverage object that contains entries for _all_ the sources you would like
to cover.

This is useful in conjunction with
[browserify-coffee-coverage](https://github.com/benbria/browserify-coffee-coverage). When browserifying files, you are
fed the files one at a time, and instrument them. If you have only created test browserify bundles for, say, 30% of your
sources, then the other, _not_ covered sources, will be left out of the report. Use this plugin to include those sources
in the report at karma runtime.

What the plugin will do is run `coffee-coverage` on `basePath`, and generate a javascript file containing all the
coverage intialization code for that directory. You can then include this file in your config `files` property, and
will thus include the _zero_ counts in any reports your generate.

__NOTE__: Should be used in conjunction with a coverage reporter that supports `istanbul` or `jscoverage`, such as
`karma-coverage`.

# Usage

In your `karma.conf.*`

```javascript
// add `karma-coffee-coverage` framework plugin
frameworks: ['coffee-coverage'],

// configure the framework plugin
coffeeCoverage: {
    framework: {
        initAllSources: true,
        sourcesBasePath: 'assets',
        dest: 'build-test/coverage-init.js',
        instrumentor: 'istanbul'
    }
},

// Then ensure that `dest` is included in our `files`
files: ['build-test/coverage-init.js', '**/*Test.js']
```

# Options

You can pass anything that you would pass to the `coffee-coverage` constructor, as well as these options.

## `coffeeCoverage.framework.initAllSources`

This needs to be true for the plugin to run.

## `coffeeCoverage.framework.sourcesBasePath`

The root directory which you would like to generate initialization coverage for.

## `coffeeCoverage.framework.dest`

The `.js` file destination to write out the initialization javascript. Include this in your karma `files` config.
