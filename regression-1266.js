// https://github.com/substack/node-browserify/issues/1266

var fs = require('fs');
var spawn = require('child_process').spawn;
var path = require('path');

var browserify = require('browserify');
var concat = require('concat-stream');
var test = require('tap').test;

var cwd = process.cwd();
process.chdir(__dirname + '/fixtures/regression-1266');

var testFiles = [
  'a.js',
  'b.js'
];

var expected = fs.readFileSync('_expected.js', 'utf8');

test('CLI: a.js b.js', function(t) {
  t.plan(2);

  var ps = spawn(process.execPath, [
      path.resolve(__dirname, 'node_modules/.bin/browserify'),
      testFiles[0],
      testFiles[1]
  ]);
  ps.stderr.pipe(concat({encoding: 'string'}, function(err) {
    t.notOk(err);
  }));
  ps.stdout.pipe(concat({encoding: 'string'}, function(src) {
    t.equal(src, expected);
  }));
});

test('CLI: ./a.js ./b.js', function(t) {
  t.plan(2);

  var ps = spawn(process.execPath, [
      path.resolve(__dirname, 'node_modules/.bin/browserify'),
      './' + testFiles[0],
      './' + testFiles[1]
  ]);
  ps.stderr.pipe(concat({encoding: 'string'}, function(err) {
    t.notOk(err);
  }));
  ps.stdout.pipe(concat({encoding: 'string'}, function(src) {
    t.equal(src, expected);
  }));
});

test('API: a.js b.js', function(t) {
  t.plan(2);

  var b = browserify({
    entries: [testFiles[0], testFiles[1]]
  });
  b.bundle(function(err, src) {
    t.error(err);
    src = String(src);
    t.equal(src, expected);
  });
});

test('API: ./a.js ./b.js', function(t) {
  t.plan(2);

  var b = browserify({
    entries: [
      './' + testFiles[0],
      './' + testFiles[1]
    ]
  });
  b.bundle(function(err, src) {
    t.error(err);
    src = String(src);
    t.equal(src, expected);
  });
});
