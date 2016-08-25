# karma-opera-launcher

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/karma-runner/karma-opera-launcher)
 [![npm version](https://img.shields.io/npm/v/karma-opera-launcher.svg?style=flat-square)](https://www.npmjs.com/package/karma-opera-launcher) [![npm downloads](https://img.shields.io/npm/dm/karma-opera-launcher.svg?style=flat-square)](https://www.npmjs.com/package/karma-opera-launcher)

[![Build Status](https://img.shields.io/travis/karma-runner/karma-opera-launcher/master.svg?style=flat-square)](https://travis-ci.org/karma-runner/karma-opera-launcher) [![Dependency Status](https://img.shields.io/david/karma-runner/karma-opera-launcher.svg?style=flat-square)](https://david-dm.org/karma-runner/karma-opera-launcher) [![devDependency Status](https://img.shields.io/david/dev/karma-runner/karma-opera-launcher.svg?style=flat-square)](https://david-dm.org/karma-runner/karma-opera-launcher#info=devDependencies)

> Launcher for Opera.

## Installation

The easiest way is to keep `karma-opera-launcher` as a devDependency.
You can simple do it by:
```bash
npm install karma-opera-launcher --save-dev
```

## Configuration

#### Opera Classic (up to and including v12)
```js
// karma.conf.js
module.exports = function(config) {
  config.set({
    browsers: ['OperaClassic']
  });
};
```

#### Opera (v15 and above)
```js
// karma.conf.js
module.exports = function(config) {
  config.set({
    browsers: ['Opera']
  });
};
```

You can pass list of browsers as a CLI argument too:
```bash
karma start --browsers Opera,OperaClassic
```

----

For more information on Karma see the [homepage].


[homepage]: http://karma-runner.github.com
