const camelcase = require("camelcase");
const axios = require("axios");

const parsePredicatesEndpoint = (doc) => {
    let ops = [];
    if (Object.keys(doc).length > 0) {
        Object.keys(doc).map(sbj => {
            Object.keys(doc[sbj]).map(obj => {
                if (typeof doc[sbj][obj] === "string") {
                    doc[sbj][obj] = [doc[sbj][obj]]
                }
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

const constructQueryUrl = (serverUrl) => {
    if (serverUrl.endsWith('/')) {
        serverUrl = serverUrl.slice(0, -1);
    }
    return serverUrl + "/predicates";
}

const fetchReasonerOps = async (metadata) => {
    let ops = [];
    await Promise.allSettled(Object.keys(metadata).map(apiName => {
        return axios.get(constructQueryUrl(metadata[apiName].metadata.url))
            .then(res => {
                let result = parsePredicatesEndpoint(res.data);
                result.map(op => {
                    op.association.api_name = apiName;
                    op.association.smartapi = metadata[apiName].metadata.smartapi;
                    ops.push(op);
                })
            })
            .catch(err => {
                console.log(err);
            })
    }));
    return ops;
}



exports.parsePredicatesEndpoint = parsePredicatesEndpoint;
exports.fetchReasonerOps = fetchReasonerOps;