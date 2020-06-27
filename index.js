const parser = require("smartapi-parser");
const jsnx = require('jsnetworkx');
const dataload = require("./dataload");
const utils = require("./utils");

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
     * @param {string} source - specify where the smartapi specs is located, should be either 'local' or 'remote'
     */
    async constructMetaKG() {
        let api;
        let specs = await dataload.loadSpecs();
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
     * Construct API Meta Knowledge Graph based on SmartAPI Specifications.
     * @param {string} source - specify where the smartapi specs is located, should be either 'local' or 'remote'
     */
    constructMetaKGSync() {
        let api;
        let specs = dataload.loadSpecsSync();
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
