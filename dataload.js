//const fs = require("fs");
const axios = require('axios');


/**
 * Load SmartAPI Specifications from the SmartAPI programming interface into memory
 * @return {Array} An array of objects, with each object representing one SmartAPI Specification
 */
exports.loadSpecsFromRemote = async () => {
    const smartapi_url = 'https://smart-api.info/api/query?q=tags.name:translator&size=100';
    let response = await axios.get(smartapi_url);
    response = response.data.hits;
    return response.map(spec => {
        spec.paths = spec.paths.reduce((obj, path) => {
            obj[path.path] = path.pathitem;
            return obj;
        }, {});
        return spec;
    })
}

/**
 * Load All Local SmartAPI Specifications into memory
 * @return {Array} An array of objects, with each object representing one SmartAPI Specification
 */
// exports.loadSpecsFromLocalCache = async () => {
//     const specs_folder = __dirname + '/smartapi_specs/';
//     let specs = [];
//     let files = fs.readdirSync(specs_folder);
//     for (let i = 0; i < files.length; i++) {
//         try {
//             let spec = await loadJsonFile(specs_folder + files[i]);
//             specs.push(spec);
//         } catch (err) {
//             //console.log(err);
//         }
//     }
//     return specs;
// }

/**
 * Load All SmartAPI Specifications into memory
 * @param {String} source - where SmartAPI specifications come from, should be either "local" or "remote"
 * @return {Array} An array of objects, with each object representing one SmartAPI Specification
 */
exports.loadSpecs = async () => {
    let specs;
    // if (source === 'local') {
    //     specs = await this.loadSpecsFromLocalCache();
    // } else if (source === 'remote') {
    //     specs = await this.loadSpecsFromRemote();
    // }
    specs = await this.loadSpecsFromRemote();
    return specs;
}

exports.loadSpecsSync = () => {
    const smartapi_specs = require("./specs");
    return smartapi_specs.hits.map(spec => {
        if (Array.isArray(spec.paths)) {
            spec.paths = spec.paths.reduce((obj, path) => {
                obj[path.path] = path.pathitem;
                return obj;
            }, {});
        }
        return spec;
    })
}

exports.loadBioThingsSpecsSync = () => {
    const smartapi_specs = require("./specs");
    return smartapi_specs.hits.map(spec => {
        let tags = spec.tags.map(item => item.name);
        if (Array.isArray(spec.paths) && tags.includes("biothings")) {
            spec.paths = spec.paths.reduce((obj, path) => {
                obj[path.path] = path.pathitem;
                return obj;
            }, {});
        }
        return spec;
    })
}