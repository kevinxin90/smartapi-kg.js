import AsyncOperationsBuilder from './async_operations_builder';
import { SmartAPISpec, ParsedAPIMetadataObject, SmartAPIKGOperationObject } from '../parser/types';
import { ReasonerPredicatesResponse } from '../types';
import API from '../parser/index';
import axios from 'axios';
import Debug from 'debug';
const debug = Debug('smartapi-kg:OperationsBuilder');

export default class AsyncOperationsBuilderWithReasoner extends AsyncOperationsBuilder {

    private getTRAPIWithPredicatesEndpoint(specs: SmartAPISpec[]): ParsedAPIMetadataObject[] {
        const trapi = [] as ParsedAPIMetadataObject[];
        specs.map(spec => {
            try {
                const parser = new API(spec);
                const metadata = parser.metadata;
                if (metadata.paths.includes("/predicates") && !(typeof metadata["x-translator"].team === undefined)) {
                    trapi.push(metadata);
                }
            } catch (err) {
                debug(`[error]: Unable to parse spec, ${(spec) ? spec.info.title : spec}. Error message is ${err.toString()}`);
            }

        })
        return trapi;
    }

    private constructQueryUrl(serverUrl: string): string {
        if (serverUrl.endsWith('/')) {
            serverUrl = serverUrl.slice(0, -1);
        }
        return serverUrl + "/predicates";
    }

    private parsePredicateEndpoint(response: ReasonerPredicatesResponse, metadata: ParsedAPIMetadataObject): SmartAPIKGOperationObject[] {
        const ops = [] as SmartAPIKGOperationObject[];
        Object.keys(response).map(sbj => {
            Object.keys(response[sbj]).map(obj => {
                if (Array.isArray(response[sbj][obj])) {
                    response[sbj][obj].map(pred => {
                        ops.push(
                            {
                                association: {
                                    input_type: sbj,
                                    output_type: obj,
                                    predicate: pred,
                                    api_name: metadata.title,
                                    smartapi: metadata.smartapi,
                                    "x-translator": metadata["x-translator"]
                                },
                                tags: metadata.tags
                            }
                        )
                    })
                }
            })
        });
        return ops;
    }

    private async getOpsFromPredicatesEndpoint(metadata: ParsedAPIMetadataObject): Promise<SmartAPIKGOperationObject[]> {
        return axios.get(this.constructQueryUrl(metadata.url), { timeout: 5000 })
            .then(res => {
                if (res.status === 200) {
                    const data = res.data as ReasonerPredicatesResponse;
                    return this.parsePredicateEndpoint(data, metadata);
                }
                debug(`[error]: Unable to get /predicates for ${metadata.url} due to query failure with status code ${res.status}`);
                return [];
            })
            .catch(err => {
                debug(`[error]: Unable to get /predicates for ${metadata.url} due to error ${err.toString()}`);
                return [];
            })
    }

    private async getOpsFromPredicatesEndpoints(specs: SmartAPISpec[]): Promise<SmartAPIKGOperationObject[]> {
        const metadatas = this.getTRAPIWithPredicatesEndpoint(specs);
        let res = [] as SmartAPIKGOperationObject[];
        await Promise.allSettled(metadatas.map(metadata => this.getOpsFromPredicatesEndpoint(metadata))).then(results => {
            results.map(rec => {
                if (rec.status === "fulfilled") {
                    const ops = rec.value as SmartAPIKGOperationObject[];
                    res = [...res, ...rec.value]
                }
            })
        });
        return res;
    }

    async build(): Promise<SmartAPIKGOperationObject[]> {
        const specs = await this.load();
        const nonTRAPIOps = this.loadOpsFromSpecs(specs);
        const TRAPIOps = await this.getOpsFromPredicatesEndpoints(specs);
        return [...nonTRAPIOps, ...TRAPIOps];
    }
}