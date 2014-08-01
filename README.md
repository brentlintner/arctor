# Arctor

[![Dependency Status](https://david-dm.org/brentlintner/arctor.svg)](https://david-dm.org/brentlintner/arctor)

A CommonJS module dependency mapper and graphing tool.

This is still a WIP (in some ways). Depending on where you scanning from and the specified targets, things might not work as expected.
Also, I started using this with nodejs based projects, so there may be (or is) unexpected behaviour that is not covered. 

## CLI Installation

    npm install -g arctor
    arctor -h

### Scanning Dependencies

You can scan multiple targets with the CLI, by:

    arctor dir file.js dir2 ...

This will output a JSON data object (to be documented..).

### WTF?! Examples?

Indeed!

    git clone https://github.com/brentlintner/arctor.git
    cd arctor/demo
    arctor lib test

### Graph It!

You can generate a visual graph of the dependencies.

    arctor -g lib

## Using The Library On Its Own

    npm install arctor

You can require it as so (exports `lib/arctor.js`):

```javascript
var arctor = require('arctor');
```

..to be documented.

## Hacking

    git clone https://github.com/brentlintner/arctor.git && cd arctor
    ./configure
    jake -T

## Contributions

If you find this useful in any way, and have an issue or contribution, feel free to open pull request or create an issue on [github](http://github.com/brentlintner/arctor).

### Code Guidelines

* 4 spaces per editor tab.
* No style check errors (`jake lint`).
* Tests (`jake test`) are green.
* ASI is tolerated (for funsies..).

## Brought To You By

* [arbor.js](http://arborjs.org)
* [mocha](http://visionmedia.github.com/mocha)
* [chai](http://chaijs.com)
* [sinon](http://sinonjs.org)
* [coverjs](http://github.com/arian/CoverJS)
* [detective](http://github.com/substack/node-detective).
* ..and all other (awesome) software used by this project.
