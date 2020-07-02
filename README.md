<h1 align="center">Welcome to @biothings-explorer/smartapi-kg 👋</h1>
<p>
  <a href="https://www.npmjs.com/package/@biothings-explorer/smartapi-kg" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/@biothings-explorer/smartapi-kg.svg">
  </a>
  <a href="https://github.com/kevinxin90/smartapi-kg.js#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/kevinxin90/smartapi-kg.js/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/kevinxin90/smartapi-kg.js/blob/master/LICENSE" target="_blank">
    <img alt="License: ISC" src="https://img.shields.io/github/license/kevinxin90/@biothings-explorer/smartapi-kg" />
  </a>
</p>

> create a knowledge graph based on SmartAPI Specifications

### 🏠 [Homepage](https://github.com/kevinxin90/smartapi-kg.js#readme)

## Install

```sh
npm i @biothings-explorer/smartapi-kg
```

## Usage

```javascript
const kg = require("@biothings-explorer/smartapi-kg")
//initiate a new knowledge graph class
let meta_kg = new kg()
//async load knowledge graph from SmartAPI
await meta_kg.constructMetaKG()
//Alternatively, you can load additional knowledge graph from SmartAPI for ReasonerStdAPI
await meta_kg.constructMetaKG(includeReasoner = true);
//Alternatively, you can also sync load SmartAPI specs from a local copy within the package
meta_kg.constructMetaKGSync();
//filter based on input/output/predicate
meta_kg.filter({predicate: 'treats'})
meta_kg.filter({predicate: 'treats', input_id: 'CHEMBL.COMPOUND'})
meta_kg.filter({predicate: ['treats', 'physically_interacts_with'], input_type: 'ChemicalSubstance'})

```
[Runkit Notebook Demo](https://runkit.com/kevinxin90/smartapi-kg-demo)

## Run tests

```sh
npm run test
```

## Author

👤 **Jiwen Xin**

* Website: http://github.com/kevinxin90
* Github: [@kevinxin90](https://github.com/kevinxin90)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/kevinxin90/smartapi-kg.js/issues). You can also take a look at the [contributing guide](https://github.com/kevinxin90/smartapi-kg.js/blob/master/CONTRIBUTING.md).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2020 [Jiwen Xin](https://github.com/kevinxin90).<br />
This project is [ISC](https://github.com/kevinxin90/smartapi-kg.js/blob/master/LICENSE) licensed.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_