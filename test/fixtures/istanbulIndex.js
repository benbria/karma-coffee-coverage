if (typeof __coverage__ === 'undefined') __coverage__ = {};
(function(_export) {
    if (typeof _export.__coverage__ === 'undefined') {
        _export.__coverage__ = __coverage__;
    }
})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this);
if (! __coverage__["/Users/calvinwiebe/dev/karma-coffee-coverage/test/fixtures/index.coffee"]) { __coverage__["/Users/calvinwiebe/dev/karma-coffee-coverage/test/fixtures/index.coffee"] = {"path":"/Users/calvinwiebe/dev/karma-coffee-coverage/test/fixtures/index.coffee","s":{"1":0,"2":0,"3":0},"b":{},"f":{"1":0},"fnMap":{"1":{"name":"foo","line":1,"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":17}}}},"statementMap":{"1":{"start":{"line":1,"column":0},"end":{"line":3,"column":0}},"2":{"start":{"line":2,"column":4},"end":{"line":2,"column":22}},"3":{"start":{"line":4,"column":0},"end":{"line":4,"column":10}}},"branchMap":{}} }(function() {
  var foo,
    slice = [].slice;

  __coverage__["/Users/calvinwiebe/dev/karma-coffee-coverage/test/fixtures/index.coffee"].s[1]++;

  foo = function() {
    var args;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    __coverage__["/Users/calvinwiebe/dev/karma-coffee-coverage/test/fixtures/index.coffee"].f[1]++;
    __coverage__["/Users/calvinwiebe/dev/karma-coffee-coverage/test/fixtures/index.coffee"].s[2]++;
    return console.log.apply(console, args);
  };

  __coverage__["/Users/calvinwiebe/dev/karma-coffee-coverage/test/fixtures/index.coffee"].s[3]++;

  foo(1, 2, 3);

}).call(this);
