import axios from 'axios';
const SMARTAPI_URL = require("./config").SMARTAPI_URL;
const fs = require("fs");
var path = require('path');
const util = require('util');
const readFile = util.promisify(fs.readFile);
import { InvalidSmartAPIIDError } from "./utils/errors/invalid_smartapi_id_error";
import { SmartAPISpec, SmartAPIQueryResponse } from "./utils/types";
const debug = require("debug")("smartapi-kg:load-specs");

/**
 * Load SmartAPI Specifications from the SmartAPI API
 * @return {Array} An array of objects, with each object representing one SmartAPI Specification
 */
exports.loadSpecsFromRemote = async (smartapiID: string | undefined = undefined): Promise<object> => {
    const urlTemplate = 'https://smart-api.info/api/metadata/{smartapi_id}';
    let apiResponse;
    let response: SmartAPISpec[];
    if (smartapiID === undefined) {
        apiResponse = await axios.get(SMARTAPI_URL);
        response = apiResponse.data.hits;
    } else {
        apiResponse = await axios.get(urlTemplate.replace("{smartapi_id}", smartapiID));
        if (apiResponse.status === 200) {
            if (Array.isArray(apiResponse.data) && apiResponse.data.length === 0) {
                throw new InvalidSmartAPIIDError();
            }
            response = [apiResponse.data];
            return response
        } else {
            return [];
        }
    }
    return response.map(spec => {
        if (spec.paths) {
            spec.paths = spec.paths.reduce((obj: any, path: any) => {
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
exports.loadSpecsSync = async (tag: string = "translator"): object => {
    const smartapi_specs = await readFile(path.resolve(__dirname, './data/smartapi_specs.json'));
    return smartapi_specs.hits.map(spec => {
        let tags = spec.tags.map(item => item.name);
        debug(`SmartAPI ${(spec) ? spec.info.title : spec} has the following tags: ${tags}`);
        if (Array.isArray(spec.paths) && tags.includes(tag)) {
            debug(`This SmartAPI qualifies the tag specification: ${tag}`)
            spec.paths = spec.paths.reduce((obj, path) => {
                obj[path.path] = path.pathitem;
                return obj;
            }, {});
        }
        return spec;
    })
}
