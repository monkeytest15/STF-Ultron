# stf-appstore-db

**stf-appstore-db** provides the simple app store database used by [STF](https://github.com/openstf/stf). We have mainly focused on Android app stores for now. All data may not be complete yet.

## Features and provided data

Store information is provided in the following format in [`inventory.json`](inventory.json).

```json
{
  "google-play-store": {
    "name": "Google Play Store",
    "android": {
      "package": "com.google"
    }
  }
}
```

Additionally, an icon is provided for each store in the `dist` folder (after building or installing).

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
npm install --save stf-appstore-db
```

_The module is prebuilt before publishing, so you don't need the build requirements if you just want to use the library._

You are then able to access the inventory by requiring the module:

```js
var inventory = require('stf-appstore-db')
```

The unique key of each store also works as the icon filename (after adding the `.png` suffix). The icons can be found from the `dist` folder after building or installing the module. It can be served as a static folder.

## Adding a new app store

First you must find an icon for the app store. Try to get the best quality PNG you can find.

After you've got the icon, rename it to match the unique ID you gave to the store in `inventory.json`, and place the icon to the corresponding platform folder inside the `static` folder. It needs to be in PNG format.

Running `make` will then load the icon from the `static` folder, resize it, and place the resized images into the `dist` folder.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

See [LICENSE](LICENSE).

Copyright © CyberAgent, Inc. All Rights Reserved.

All app stores are trademarks of their respective owners.
