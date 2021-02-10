"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const camelcase = require("camelcase");
const axios = require("axios");
const debug_1 = __importDefault(require("debug"));
const debug = debug_1.default("smartapi-kg:reasoner");
const parsePredicatesEndpoint = (doc) => {
    let ops = [];
    if (Object.keys(doc).length > 0) {
        Object.keys(doc).map(sbj => {
            Object.keys(doc[sbj]).map(obj => {
                // if (typeof doc[sbj][obj] === "string") {
                //     doc[sbj][obj] = [doc[sbj][obj]]
                // }
                if (Array.isArray(doc[sbj][obj])) {
                    doc[sbj][obj].map(pred => {
                        ops.push({
                            association: {
                                input_type: camelcase(sbj, { pascalCase: true }),
                                output_type: camelcase(obj, { pascalCase: true }),
                                predicate: pred
                            }
                        });
                    });
                }
            });
        });
    }
    return ops;
};
const constructQueryUrl = (serverUrl) => {
    if (serverUrl.endsWith('/')) {
        serverUrl = serverUrl.slice(0, -1);
    }
    return serverUrl + "/predicates";
};
const fetchReasonerOps = async (metadata) => {
    let ops = [];
    await Promise.allSettled(Object.keys(metadata).map(apiName => {
        debug(`Start to fetch metadata for TRAPI ${apiName} with server url ${metadata[apiName].metadata.url}`);
        return axios.get(constructQueryUrl(metadata[apiName].metadata.url))
            .then(res => {
            let result = parsePredicatesEndpoint(res.data);
            result.map(op => {
                op.tags = ['translator', 'reasoner'];
                op.association.api_name = apiName;
                op.association.smartapi = metadata[apiName].metadata.smartapi;
                op.association["x-translator"] = metadata[apiName].metadata['x-translator'] || [];
                ops.push(op);
            });
            debug(`[info]: Successfully get /predicates for ${apiName}`);
        })
            .catch(err => {
            debug(`[error]: Unable to get /predicates for ${apiName}`);
        });
    }));
    return ops;
};
exports.parsePredicatesEndpoint = parsePredicatesEndpoint;
exports.fetchReasonerOps = fetchReasonerOps;
