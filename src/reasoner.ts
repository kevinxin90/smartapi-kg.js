import camelcase = require("camelcase");
import axios = require("axios");
import { SmartAPIOperation, ReasonerPredicatesResponse } from "./utils/types"
import Debug from "debug";
const debug = Debug("smartapi-kg:reasoner");


const parsePredicatesEndpoint = (doc: ReasonerPredicatesResponse) => {
    const ops: SmartAPIOperation[] = [];
    if (Object.keys(doc).length > 0) {
        Object.keys(doc).map(sbj => {
            Object.keys(doc[sbj]).map(obj => {
                // if (typeof doc[sbj][obj] === "string") {
                //     doc[sbj][obj] = [doc[sbj][obj]]
                // }
                if (Array.isArray(doc[sbj][obj])) {
                    doc[sbj][obj].map(pred => {
                        ops.push(
                            {
                                association: {
                                    input_type: camelcase(sbj, { pascalCase: true }),
                                    output_type: camelcase(obj, { pascalCase: true }),
                                    predicate: pred
                                }
                            }
                        )
                    })
                }
            })
        })
    }
    return ops;
}

const constructQueryUrl = (serverUrl: string): string => {
    if (serverUrl.endsWith('/')) {
        serverUrl = serverUrl.slice(0, -1);
    }
    return serverUrl + "/predicates";
}

const fetchReasonerOps = async (metadata: object): Promise<object[]> => {
    const ops: SmartAPIOperation[] = [];
    await Promise.allSettled(Object.keys(metadata).map(apiName => {
        debug(`Start to fetch metadata for TRAPI ${apiName} with server url ${metadata[apiName].metadata.url}`);
        return axios.get(constructQueryUrl(metadata[apiName].metadata.url))
            .then(res => {
                const result = parsePredicatesEndpoint(res.data);
                result.map(op => {
                    op.tags = ['translator', 'reasoner'];
                    op.association.api_name = apiName;
                    op.association.smartapi = metadata[apiName].metadata.smartapi;
                    op.association["x-translator"] = metadata[apiName].metadata['x-translator'] || [];
                    ops.push(op);
                })
                debug(`[info]: Successfully get /predicates for ${apiName}`);
            })
            .catch(err => {
                debug(`[error]: Unable to get /predicates for ${apiName}`);
            })
    }));
    return ops;
}



exports.parsePredicatesEndpoint = parsePredicatesEndpoint;
exports.fetchReasonerOps = fetchReasonerOps;