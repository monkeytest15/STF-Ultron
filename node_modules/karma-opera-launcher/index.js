var fs = require('fs')
var path = require('path')
var PREFS = fs.readFileSync(path.join(__dirname, '/config/prefs.ini'))
var OperaClassicBrowser
var OperaBrowser
var DEFAULT_CMD

function isJSFlags (flag) {
  return flag.indexOf('--js-flags=') === 0
}

function sanitizeJSFlags (flag) {
  var test = /--js-flags=(['"])/.exec(flag)
  if (!test) return flag
  var escapeChar = test[1]
  var endExp = new RegExp(escapeChar + '$')
  var startExp = new RegExp('--js-flags=' + escapeChar)
  return flag.replace(startExp, '--js-flags=').replace(endExp, '')
}

function findWindowsOperaExecutable () {
  // First we need the directory where Opera is installed.
  var operaPath

  var defaultPaths = [
    process.env['ProgramFiles'],
    process.env['ProgramFiles(X86)']
  ]

  var executable = null
  var found = defaultPaths.some(function (progFiles) {
    if (progFiles === undefined) {
      return false
    }

    var oP = path.join(progFiles, 'Opera')
    try {
      fs.statSync(oP)
      operaPath = oP
      return true
    } catch (e) {
      return false
    }
  })

  if (!found) {
    return null
  }

  // Check if there is an opera.exe
  try {
    executable = path.join(operaPath, 'opera.exe')
    fs.statSync(executable)
    return executable
  } catch (e) {}

  // If not, check the directories inside Opera; the directory structure is, for example,
  // Opera
  // + 20.0.1750.51
  //   + opera.exe
  // i.e. opera is in a versioned directory, so we have to scan them.
  found = fs.readdirSync(operaPath)
    .map(function (name) {
      return path.join(operaPath, name)
    })
    .filter(function (name) {
      return fs.statSync(name).isDirectory()
    })
    .sort()
    .some(function (dir) {
      executable = path.join(dir, 'opera.exe')

      try {
        if (fs.statSync(executable).isFile()) {
          return true
        }
      } catch (e) {
        // console.log('Not found')
      }
    })

  if (found) {
    // Weeee!
    return executable
  }

  return null

}

OperaClassicBrowser = function (baseBrowserDecorator) {
  baseBrowserDecorator(this)

  this._getOptions = function (url) {
    // Opera CLI options
    // http://www.opera.com/docs/switches/
    return [
      '-pd', this._tempDir,
      '-nomail',
      url
    ]
  }

  this._start = function (url) {
    var self = this

    var prefsFile = this._tempDir + '/operaprefs.ini'
    fs.writeFile(prefsFile, PREFS, function (err) {
      if (err) {
        console.error('Can not write perferences files')
        console.error(err)
      }
      self._execCommand(self._getCommand(), self._getOptions(url))
    })
  }
}

OperaBrowser = function (baseBrowserDecorator, args) {
  baseBrowserDecorator(this)

  var flags = args.flags || []

  this._getOptions = function (url) {
    // Opera CLI options
    // http://peter.sh/experiments/chromium-command-line-switches/
    flags.forEach(function (flag, i) {
      if (isJSFlags(flag)) flags[i] = sanitizeJSFlags(flag)
    })

    return [
      '--user-data-dir=' + this._tempDir,
      '--no-default-browser-check',
      '--no-first-run',
      '--disable-default-apps',
      '--disable-popup-blocking',
      '--disable-translate',
      '--new-window'
    ].concat(flags, [url])
  }
}

DEFAULT_CMD = {
  linux: 'opera',
  darwin: '/Applications/Opera.app/Contents/MacOS/Opera',
  win32: findWindowsOperaExecutable()
}

OperaClassicBrowser.prototype = {
  name: 'OperaClassic',

  DEFAULT_CMD: DEFAULT_CMD,
  ENV_CMD: 'OPERA_BIN'
}

OperaClassicBrowser.$inject = ['baseBrowserDecorator']

OperaBrowser.prototype = {
  name: 'Opera',

  DEFAULT_CMD: DEFAULT_CMD,
  ENV_CMD: 'OPERA_BIN'
}

OperaBrowser.$inject = ['baseBrowserDecorator', 'args']

// PUBLISH DI MODULE
module.exports = {
  'launcher:OperaClassic': ['type', OperaClassicBrowser],
  'launcher:Opera': ['type', OperaBrowser]
}
