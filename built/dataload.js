"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//const fs = require("fs");
const axios_1 = __importDefault(require("axios"));
const SMARTAPI_URL = require("./config").SMARTAPI_URL;
const invalid_smartapi_id_error_1 = require("./utils/errors/invalid_smartapi_id_error");
const debug = require("debug")("smartapi-kg:load-specs");
/**
 * Load SmartAPI Specifications from the SmartAPI API
 * @return {Array} An array of objects, with each object representing one SmartAPI Specification
 */
exports.loadSpecsFromRemote = async (smartapiID = undefined) => {
    let url_template = 'https://smart-api.info/api/metadata/{smartapi_id}';
    let apiResponse;
    let response;
    if (smartapiID === undefined) {
        apiResponse = await axios_1.default.get(SMARTAPI_URL);
        response = apiResponse.data.hits;
    }
    else {
        apiResponse = await axios_1.default.get(url_template.replace("{smartapi_id}", smartapiID));
        if (apiResponse.status === 200) {
            if (Array.isArray(apiResponse.data) && apiResponse.data.length === 0) {
                throw new invalid_smartapi_id_error_1.InvalidSmartAPIIDError();
            }
            response = [apiResponse.data];
            return response;
        }
        else {
            return [];
        }
    }
    return response.map(spec => {
        if (Array.isArray(spec.paths)) {
            spec.paths = spec.paths.reduce((obj, path) => {
                obj[path.path] = path.pathitem;
                return obj;
            }, {});
            return spec;
        } else {
            return spec;
        }
    });
};

const processSpecs = (smartapi_specs, tag) => {
    return smartapi_specs.hits.map(spec => {
        let tags = spec.tags.map(item => item.name);
        debug(`SmartAPI ${(spec) ? spec.info.title : spec} has the following tags: ${tags}`);
        if (Array.isArray(spec.paths) && tags.includes(tag)) {
            debug(`This SmartAPI qualifies the tag specification: ${tag}`);
            spec.paths = spec.paths.reduce((obj, path) => {
                obj[path.path] = path.pathitem;
                return obj;
            }, {});
        }
        return spec;
    });
}
/**
 * Load SmartAPI Specifications from a local copy of SmartAPI registry
 * @param {string} tag - The SmartAPI tag to be filtered on
 * @return {Array} An array of objects, with each object representing one SmartAPI Specification
 */
exports.loadSpecsSync = (tag = "translator") => {
    const smartapi_specs = require("./specs");
    return processSpecs(smartapi_specs, tag);
};

exports.loadsSpecsFromUser = (smartapi_specs) => {
    return smartapi_specs.hits.map(spec => {
        if (Array.isArray(spec.paths)) {
            spec.paths = spec.paths.reduce((obj, path) => {
                obj[path.path] = path.pathitem;
                return obj;
            }, {});
            return spec;
        } else {
            return spec;
        }
    });
}
