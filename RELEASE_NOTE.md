## 0.4.6 (February 24 2017)

* Add options generateComponentTests and generateContainerTests that allows to specify whether 
component unit tests should be created (defaults to true) ([@macrozone](https://github.com/macrozone))

## 0.4.5 (November 30 2016)

* Add missing dependency ([#108](https://github.com/mantrajs/mantra-cli/pull/108)) [@StorytellerCZ](https://github.com/StorytellerCZ)

## 0.4.4 (October 21 2016)

* Avoid creating a new project when already inside a Meteor project ([#103](https://github.com/mantrajs/mantra-cli/pull/103)) [@thancock20](https://github.com/thancock20)

## 0.4.3  (October  8 2016)

* Stop updating index.js if a file already exists ([#99](https://github.com/mantrajs/mantra-cli/pull/99)) [@thancock20](https://github.com/thancock20)

## 0.4.2 (September 25 2016)

* Make Storybook optional ([#98](https://github.com/mantrajs/mantra-cli/pull/98))

## 0.4.1 (September 13 2016)

* Fix an import path ([#95](https://github.com/mantrajs/mantra-cli/pull/95)) [@Cyval](https://github.com/Cyval)

## 0.4.0 (September 10 2016)

* Customizable templates for all entities
* Customizable templates for tests ([@macrozone](https://github.com/macrozone))
* Storybook integration ([@macrozone](https://github.com/macrozone))
* Stop generating files if file name is empty ([@fermuch](https://github.com/fermuch))
* Stop destroying files if file name is empty ([@macrozone](https://github.com/macrozone))

## 0.3.13 (June 12 2016)

* Astronomy support ([@PolGuixe](https://github.com/PolGuixe))

## 0.3.12 (May 29 2016)

* Generate parent directory if missing. ([#66](https://github.com/mantrajs/mantra-cli/pull/66)) [@THPubs](https://github.com/THPubs)

## 0.3.11 (April 24 2016)

* Fix generator error for apps created with mantra-cli version prior to 0.3.10 ([#62](https://github.com/mantrajs/mantra-cli/issues/62))

## 0.3.10 (April 23 2016)

* Generate tests for `action`, `component`, and `container`.
* Add constructor to classical React components ([#57](https://github.com/mantrajs/mantra-cli/issues/57))

## 0.3.9 (April 17 2016)

* Update ESLint to `2.x.x` ([#56](https://github.com/mantrajs/mantra-cli/pull/56)). [@haizi-zh](https://github.com/haizi-zh)
* Fix the case of collection name in `index.js` ([#55](https://github.com/mantrajs/mantra-cli/issues/55))
* Generate libs directory under modules. ([#51](https://github.com/mantrajs/mantra-cli/issues/51))
* Initialize methods ([#50](https://github.com/mantrajs/mantra-cli/issues/50))

## 0.3.8 (April 2 2016)

* Use the latest Meteor version for apps created by `mantra create` ([#47](https://github.com/mantrajs/mantra-cli/pull/47)) [@merlinpatt](https://github.com/merlinpatt)

## 0.3.7 (March 25 2016)

* Make sure destroy command updates index.js correctly (fix [#41](https://github.com/mantrajs/mantra-cli/issues/41))
* Stop importing SimpleSchema by default (fix [#40](https://github.com/mantrajs/mantra-cli/issues/40))

## 0.3.6 (March 20 2016)

* Fix the syntax error in the generated `package.json` file ([#39](https://github.com/mantrajs/mantra-cli/issues/39))

## 0.3.5 (March 15 2016)

* Add verbose option for `mantra create`
* Include ESLint when generating a new app
* Fix file path in the import statements ([#38](https://github.com/mantrajs/mantra-cli/issues/38), [9dc97f](https://github.com/mantrajs/mantra-cli/commit/9dc97fa494a0b5a867f059ec350ed2d83b0c6461))
* Bump the Meteor version to Meteor 1.3-rc.1
* Better error handling for `mantra create` by checking the required argument
([#31](https://github.com/mantrajs/mantra-cli/pull/31)) [@mayankchhabra](https://github.com/mayankchhabra)

## 0.3.4 (March 11 2016)

* Correct the import path in publication files ([#29](https://github.com/mantrajs/mantra-cli/pull/29/files)) [@sgasser](https://github.com/sgasser)
* Update Meteor version to 1.3-beta.16

## 0.3.3 (March 8 2016)

* Update Meteor version to 1.3-beta.12 ([#28](https://github.com/mantrajs/mantra-cli/pull/28)) [@vjau](https://github.com/vjau)

## 0.3.2 (March 5 2016)

* Make collection2 optional when generating a collection. You can generate
a collection with collection2 by using `-schema` option with a value
`collection`.

* Fix the alias for `--use-class` option for components. It is now `-c`.


## 0.3.1 (March 1 2016)

* Add Windows support ([#18](https://github.com/mantrajs/mantra-cli/pull/18)) [@varavut](https://github.com/varavut)
* Capitalize entity names ([869c64](https://github.com/mantrajs/mantra-cli/commit/869c642b4e5b3f3adbe42f4d89c8880c778c3dd4))
