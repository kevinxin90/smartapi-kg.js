//const fs = require("fs");
const axios = require('axios');
const InvalidSmartAPIIDError = require('./utils/errors/invalid_smartapi_id_error');
const SMARTAPI_URL = require("./config").SMARTAPI_URL;
const invalidSmartAPIIDError = require("./utils/errors/invalid_smartapi_id_error")
/**
 * Load SmartAPI Specifications from the SmartAPI API
 * @return {Array} An array of objects, with each object representing one SmartAPI Specification
 */
exports.loadSpecsFromRemote = async (smartapiID = undefined) => {
    let url_template = 'https://smart-api.info/api/metadata/{smartapi_id}';
    let response;
    if (smartapiID === undefined) {
        response = await axios.get(SMARTAPI_URL);
        response = response.data.hits;
    } else {
        response = await axios.get(url_template.replace("{smartapi_id}", smartapiID));
        if (response.status === 200) {
            if (Array.isArray(response.data) && response.data.length === 0) {
                throw InvalidSmartAPIIDError();
            }
            response = [response.data];
            return response
        } else {
            return [];
        }
    }
    return response.map(spec => {
        if (spec.paths) {
            spec.paths = spec.paths.reduce((obj, path) => {
                obj[path.path] = path.pathitem;
                return obj;
            }, {});
            return spec;
        }
    })
}

/**
 * Load SmartAPI Specifications from a local copy of SmartAPI registry
 * @param {string} tag - The SmartAPI tag to be filtered on
 * @return {Array} An array of objects, with each object representing one SmartAPI Specification
 */
exports.loadSpecsSync = (tag = "translator") => {
    const smartapi_specs = require("./specs");
    return smartapi_specs.hits.map(spec => {
        let tags = spec.tags.map(item => item.name);
        if (Array.isArray(spec.paths) && tags.includes(tag)) {
            spec.paths = spec.paths.reduce((obj, path) => {
                obj[path.path] = path.pathitem;
                return obj;
            }, {});
        }
        return spec;
    })
}
