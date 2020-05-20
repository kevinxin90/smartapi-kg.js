const fs = require("fs");
const smartapi = require("smartapi-parser");
const jsnx = require('jsnetworkx');

class KnowledgeGraph {
    constructor() {
        this.G = new jsnx.MultiDiGraph();
        this.api_list = this.listAllSpecs();
        this.loadSmartAPIs();
    }

    listAllSpecs = () => {
        return fs.readdirSync('./smartapi_specs');
    }

    loadSmartAPIs = () => {
        let spec_path;
        let api;
        let ops;
        let op;
        for (let spec_name of this.api_list) {
            spec_path = './smartapi_specs/' + spec_name;
            api = new smartapi.API(spec_path);
            ops = api.fetchAllOpts();
            for (let op of ops) {
                this.G.addEdge(
                    op.association.input_id,
                    op.association.output_id,
                    op
                )
            }
        }
    }
}

exports.KnowledgeGraph = KnowledgeGraph;