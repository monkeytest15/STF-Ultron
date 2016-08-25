(function() {
  var Path;

  Path = require('path');

  module.exports = (function() {
    switch (Path.extname(__filename)) {
      case '.coffee':
        return require('./src/apkreader');
      default:
        return require('./lib/apkreader');
    }
  })();

}).call(this);
