# karma-coffee-coverage

A set of plugins for the Karma Test Runner to support [coffee-coverage](https://github.com/benbria/coffee-coverage)

# Preprocessor

Use the `coffee-coverage` preprocessor in place of `karma-coffee-preprocessor` to compile `coffee` to `js` that will also be instrumented for `karma-coverage` to use.

## Usage

In your `karma.conf.*`

```javascript
// instrument `coffee` files on the fly
preprocessors: [
    '**/*.coffee': ['coffee-coverage']
],

// configure the processor plugin to use `istanbul` style
coffeeCoverage: {
    preprocessor: {
        instrumentor: 'istanbul'
    }
}
```

## Options

You can pass anything that you would pass to the `coffee-coverage` constructor. Most notably the `instrumentor` option.

# Framework Plugin

_What problem is this solving?_?

Say you have `foo.coffee` and `bar.coffee` as client side files. You only have written tests for `foo.coffee` and, therefore, have not included `bar.coffee` in your karma config's `files` list. If you cover, say, 80% of `foo.coffee` in your tests, your report will mirror that. However, you haven't tested `bar.coffee` at all! A more realistic report would be to say you have covered 80% of `foo.coffee`, and 0% of `bar.coffee`. Therefore, your overall coverage report should say 40%. How to fix that? Use this plugin to create an initial _empty_ coverage object that contains empty entries for _all_ the sources you would like
to report on (usually your entire client side source).

What the plugin will do is run `coffee-coverage` on `basePath`, and generate a javascript file containing all the
coverage intialization code for that directory. You can then include this file in your config `files` property, and
will thus include the _zero_ counts in any reports your generate. `karma-coverage` will merge this with any actual counts that are covered during the tests.

This is useful in conjunction with
[browserify-coffee-coverage](https://github.com/benbria/browserify-coffee-coverage)

## Usage

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

## Options

You can pass anything that you would pass to the `coffee-coverage` constructor, as well as these options.

## `coffeeCoverage.framework.initAllSources`

This needs to be true for the plugin to run.

## `coffeeCoverage.framework.sourcesBasePath`

The root directory which you would like to generate initialization coverage for.

## `coffeeCoverage.framework.dest`

The `.js` file destination to write out the initialization javascript. Include this in your karma `files` config.

# NOTES

Should be used in conjunction with a coverage reporter that supports `istanbul` or `jscoverage`, such as
`karma-coverage`.

Can use both `framework` and `preprocessor` plugins together.
