const parser = require("smartapi-parser");
const jsnx = require('jsnetworkx');
const dataload = require("./dataload");
const utils = require("./utils");
const reasonerParser = require("./reasoner");

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

    /**
     * Construct API Meta Knowledge Graph based on SmartAPI Specifications.
     * @param {boolean} includeReasoner - specify whether to include reasonerStdAPI into meta-kg
     */
    async constructMetaKG(includeReasoner = false) {
        let api;
        let specs = await dataload.loadSpecs();
        let reasoner = {};
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
                //console.log(err);
            }
        });
        if (includeReasoner === true && Object.keys(reasoner).length > 0) {
            let reasonerOps = await reasonerParser.fetchReasonerOps(reasoner);
            this.ops = [...this.ops, ...reasonerOps];
        }
    }

    /**
     * Construct API Meta Knowledge Graph based on SmartAPI Specifications.
     * @param {string} source - specify where the smartapi specs is located, should be either 'local' or 'remote'
     */
    constructMetaKGSync(category = undefined) {
        let api, specs;
        if (category === "biothings") {
            specs = dataload.loadBioThingsSpecsSync();
        } else {
            specs = dataload.loadSpecsSync();
        }
        specs.map(spec => {
            try {
                api = new parser(spec);
                api.metadata.operations.map(op => {
                    this.ops.push(op);
                    this.graph.addEdge(
                        op.association.input_id,
                        op.association.output_id,
                        op
                    )
                })
            } catch (err) {
                //console.log(err);
            }
        })
    }

    /**
     * Filter the Meta-KG operations based on specific criteria
     * @param {Object} - filtering criteria, each key represents the field to be quried
     */
    filter(criteria) {
        return utils.filterAssociations(this.ops, criteria);
    }
}

module.exports = MetaKG;
