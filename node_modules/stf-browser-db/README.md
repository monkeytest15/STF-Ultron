# stf-browser-db

**stf-browser-db** provides the simple browser database used by [STF](https://github.com/openstf/stf). While it aims to be platform agnostic, we have only sampled Android browsers so far.

## Features and provided data

Browser information is provided in the following format in [`inventory.json`](inventory.json).

```json
{
  "android-browser": {
    "developer": "Google Inc.",
    "name": "Browser",
    "platforms": {
      "android": {
        "package": "com.android.browser",
        "system": true
      }
    }
  }
}
```

Additionally, an icon is provided for each system browser in the `static` folder. These have been grabbed manually using a separate tool. For non-system browsers, an icon is fetched automatically from the corresponding app store.

## Requirements for building

* [Node.js](https://nodejs.org/) >= 0.10
* [make](http://www.gnu.org/software/make/)
* [jq](http://stedolan.github.io/jq/)
* [pngcrush](http://pmt.sourceforge.net/pngcrush/)
* [GraphicsMagick](http://www.graphicsmagick.org/)

On OS X, you can install the last three with:

```bash
brew install jq pngcrush graphicsmagick
```

## Building

Simply run `make` at the top of the repo after making sure you have the requirements installed. You will then have a complete list of resized icons in the `dist` folder.

## Usage

Install via NPM:

```bash
npm install --save stf-browser-db
```

_The module is prebuilt before publishing, so you don't need the build requirements if you just want to use the library._

You are then able to access the inventory by requiring the module:

```js
var inventory = require('stf-browser-db')
```

The unique key of each browser also works as the icon filename (after adding the `.png` suffix). The icons can be found from the `dist` folder after building or installing the module. It can be served as a static folder.

## Adding a new browser

### Non-system browsers

If you are adding a non-system browser (i.e. a browser that can be found from the platform's app store), simply modify `inventory.json` making sure to insert the correct package name.

Running `make` will then fetch the app's icon, resize it, and place the resized images into the `dist` folder.

### System browsers

If you're adding a new system browser, you're in for some trouble. First you must find a way to import the app's icon from your device. We do have a tool for this but it's not convenient enough for open sourcing - yet! Try to get the best quality PNG you can find.

After you've got the icon, rename it to match the unique ID you gave to the app in `inventory.json`, and place the icon to the corresponding platform folder inside the `static` folder. It needs to be in PNG format. You will also need to place a JSON file with the same name there. The JSON file mimics (in a very minimal way) a response from the app store. Currently, its contents are not being used in the Makefile, but we may do so in the future. Open one of the existing JSON files to see the expected format.

Running `make` will then load the icon from the `static` folder, resize it, and place the resized images into the `dist` folder.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

See [LICENSE](LICENSE).

Copyright © CyberAgent, Inc. All Rights Reserved.
