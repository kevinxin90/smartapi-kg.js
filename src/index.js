const parser = require("smartapi-parser");
const jsnx = require('jsnetworkx');
const dataload = require("./dataload");
const ft = require("./filter");
const reasonerParser = require("./reasoner");
const debug = require("debug")("smartapi-kg");

class MetaKG {
    /**
     * constructor to build meta knowledge graph from SmartAPI Specifications
     */
    constructor() {
        //store associations in a networkx multidigraph, each node represents an identifier type
        this.graph = new jsnx.MultiDiGraph();
        //store all meta-kg operations
        this.ops = [];
    }

    getOps() {
        return this.ops;
    }

    /**
     * Populate meta-kg operations based on SmartAPI specifications
     * @param {array} specs - an array of SmartAPI specifications
     * @param {boolean} includeReasoner - specify whether to include reasonerStdAPI into meta-kg
     */
    populateOpsFromSpecs(specs, includeReasoner = false) {
        this.ops = [];
        this.graph = new jsnx.MultiDiGraph();
        let reasoner = {}, api;
        specs.map(spec => {
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
                    this.graph.addEdge(
                        op.association.input_id,
                        op.association.output_id,
                        op
                    )
                })
            } catch (err) {
                debug(`[error]: Unable to parse spec, ${(spec) ? spec.info.title : spec}`);
            }
        });
        return reasoner
    }

    /**
     * Construct API Meta Knowledge Graph based on SmartAPI Specifications.
     * @param {boolean} includeReasoner - specify whether to include reasonerStdAPI into meta-kg
     */
    async constructMetaKG(includeReasoner = false, tag = "translator", smartapiID = undefined, team = undefined) {
        debug(`[info]: Constructing meta-kg by querying SmartAPI alive, includeReasoner -> ${includeReasoner}, tag -> ${tag}, smartapiID -> ${smartapiID}, team -> ${team}`);
        includeReasoner = includeReasoner || false;
        let specs = await dataload.loadSpecsFromRemote(smartapiID);
        let reasoner = this.populateOpsFromSpecs(specs, includeReasoner = includeReasoner);
        if (includeReasoner === true && Object.keys(reasoner).length > 0) {
            debug("[info]: Start ot fetch TRAPI operations from /predicates endpoints.");
            let reasonerOps = await reasonerParser.fetchReasonerOps(reasoner);
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
    constructMetaKGSync(tag = "translator") {
        debug(`Constructing meta-kg by querying local smartapi spec, tag -> ${tag}`);
        let specs;
        if (tag !== "translator") {
            specs = dataload.loadSpecsSync(tag = tag);
        } else {
            specs = dataload.loadSpecsSync();
        }
        this.populateOpsFromSpecs(specs);
    }

    /**
     * Filter the Meta-KG operations based on specific criteria
     * @param {Object} - filtering criteria, each key represents the field to be quried
     */
    filter(criteria) {
        return ft(this.ops, criteria);
    }
}

module.exports = MetaKG;
