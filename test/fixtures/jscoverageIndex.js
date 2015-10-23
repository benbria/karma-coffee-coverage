if (typeof _$jscoverage === 'undefined') _$jscoverage = {};
(function(_export) {
    if (typeof _export._$jscoverage === 'undefined') {
        _export._$jscoverage = _$jscoverage;
    }
})(typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : this);
if (! _$jscoverage["index.coffee"]) {
    _$jscoverage["index.coffee"] = [];
    _$jscoverage["index.coffee"][1] = 0;
    _$jscoverage["index.coffee"][2] = 0;
    _$jscoverage["index.coffee"][4] = 0;
}

_$jscoverage["index.coffee"].source = ["foo = (args...) ->", "    console.log args...", "", "foo 1, 2, 3", ""];

(function() {
  var foo,
    slice = [].slice;

  _$jscoverage["index.coffee"][1]++;

  foo = function() {
    var args;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    _$jscoverage["index.coffee"][2]++;
    return console.log.apply(console, args);
  };

  _$jscoverage["index.coffee"][4]++;

  foo(1, 2, 3);

}).call(this);
