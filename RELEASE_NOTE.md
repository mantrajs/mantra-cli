## 0.3.6 (March 20 2016)

* Fix the syntax error in the generated `package.json` file ([#39](https://github.com/mantrajs/mantra-cli/issues/39))

## 0.3.5 (March 15 2016)

* Add verbose option for `mantra create`
* Include ESLint when generating a new app
* Fix file path in the import statements ([#38](https://github.com/mantrajs/mantra-cli/issues/38), [9dc97f](https://github.com/mantrajs/mantra-cli/commit/9dc97fa494a0b5a867f059ec350ed2d83b0c6461))
* Bump the Meteor version to Meteor 1.3-rc.1
* Better error handling for `mantra create` by checking the required argument
([#31](https://github.com/mantrajs/mantra-cli/pull/31))

## 0.3.4 (March 11 2016)

* Correct the import path in publication files ([#29](https://github.com/mantrajs/mantra-cli/pull/29/files))
* Update Meteor version to 1.3-beta.16

## 0.3.3 (March 8 2016)

* Update Meteor version to 1.3-beta.12 ([#28](https://github.com/mantrajs/mantra-cli/pull/28))

## 0.3.2 (March 5 2016)

* Make collection2 optional when generating a collection. You can generate
a collection with collection2 by using `-schema` option with a value
`collection`.

* Fix the alias for `--use-class` option for components. It is now `-c`.


## 0.3.1 (March 1 2016)

* Add Windows support ([#18](https://github.com/mantrajs/mantra-cli/pull/18))
* Capitalize entity names ([869c64](https://github.com/mantrajs/mantra-cli/commit/869c642b4e5b3f3adbe42f4d89c8880c778c3dd4))
