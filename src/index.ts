const parser = require("smartapi-parser");
const dataload = require("./dataload");
const ft = require("./filter");
const reasonerParser = require("./reasoner");
import { SmartAPIOperation, FilterCriteria, SmartAPISpec } from './utils/types'
import Debug from "debug";
const debug = Debug("smartapi-kg");

class MetaKG {
    ops: SmartAPIOperation[];
    /**
     * constructor to build meta knowledge graph from SmartAPI Specifications
     */
    constructor() {
        // store all meta-kg operations
        this.ops = [];
    }

    getOps(): SmartAPIOperation[] {
        return this.ops;
    }

    /**
     * Populate meta-kg operations based on SmartAPI specifications
     * @param {array} specs - an array of SmartAPI specifications
     * @param {boolean} includeReasoner - specify whether to include reasonerStdAPI into meta-kg
     */
    private _populateOpsFromSpecs(specs: SmartAPISpec[], includeReasoner: boolean = false) {
        this.ops = [];
        const reasoner: object = {};
        let api: any;
        specs.map(spec => {
            debug(`[info]: Start to parse spec, ${(spec) ? spec.info.title : spec}`);
            try {
                api = new parser(spec);
                if (api.metadata.operations.length === 0 && includeReasoner === true && api.metadata.tags.includes("reasoner") && api.metadata.paths.includes("/predicates")) {
                    reasoner[api.metadata.title] = {
                        metadata: api.metadata
                    }
                }
                api.metadata.operations.map(op => {
                    op.tags = api.metadata.tags;
                    this.ops.push(op);
                })
            } catch (err) {
                debug(`[error]: Unable to parse spec, ${(spec) ? spec.info.title : spec}. Error message is ${err.toString()}`);
            }
        });
        return reasoner
    }

    /**
     * Construct API Meta Knowledge Graph based on SmartAPI Specifications.
     * @param {boolean} includeReasoner - specify whether to include reasonerStdAPI into meta-kg
     */
    async constructMetaKG(includeReasoner: boolean = false, tag: string = "translator", smartapiID?: string, team?: string): Promise<void> {
        debug(`[info]: Constructing meta-kg by querying SmartAPI alive, includeReasoner -> ${includeReasoner}, tag -> ${tag}, smartapiID -> ${smartapiID}, team -> ${team}`);
        includeReasoner = includeReasoner || false;
        const specs = await dataload.loadSpecsFromRemote(smartapiID);
        const reasoner = this._populateOpsFromSpecs(specs, includeReasoner = includeReasoner);
        if (includeReasoner === true && Object.keys(reasoner).length > 0) {
            debug("[info]: Start ot fetch TRAPI operations from /predicates endpoints.");
            const reasonerOps = await reasonerParser.fetchReasonerOps(reasoner);
            debug(`[info]: Successfully fetched ${reasonerOps.length} kgx operations from TRAPI /predicates endpoints.`);
            this.ops = [...this.ops, ...reasonerOps];
            debug(`[info]: Total kgx operations is ${this.ops.length}`);
        }
        if (tag !== "translator") {
            debug(`[info]: Filtering kgx operations by limiting ops from ${tag} tag only`)
            this.ops = this.ops.filter(op => op.tags.includes(tag));
            debug(`[info]: Total kgx operatioins after filtering is ${this.ops.length}`);
        }
        if (team !== undefined) {
            debug(`[info]: Filtering kgx operations by limiting ops from ${team} team onky.`);
            this.ops = this.ops.filter(op => op.association["x-translator"].team.includes(team));
            debug(`[info]: Total kgx operatioins after filtering is ${this.ops.length}`);
        }
    }

    /**
     * Construct API Meta Knowledge Graph based on SmartAPI Specifications.
     * @param {string} tag - the SmartAPI tag to be filtered on
     */
    async constructMetaKGSync(tag: string = "translator"): void {
        debug(`Constructing meta-kg by querying local smartapi spec, tag -> ${tag}`);
        let specs: SmartAPISpec[];
        if (tag !== "translator") {
            debug(`Start to load local SmartAPI specs with tag ${tag}`);
            specs = await dataload.loadSpecsSync(tag = tag);
        } else {
            debug(`Start to load local SmartAPI specs with tag ${tag}`);
            specs = await dataload.loadSpecsSync();
        }
        this._populateOpsFromSpecs(specs);
    }

    /**
     * Filter the Meta-KG operations based on specific criteria
     * @param {Object} - filtering criteria, each key represents the field to be quried
     */
    filter(criteria: FilterCriteria): SmartAPIOperation[] {
        return ft(this.ops, criteria);
    }
}

module.exports = MetaKG;
