const main = require("../index");
const _ = require("lodash");

test("load smartapi into networkx", () => {
    const kg = new main.KnowledgeGraph();
    const ncbi_mondo_edges = _.filter(kg.G.edges(true), function (o) { return o[0] === 'NCBIGene' && o[1] === 'MONDO' });
    expect(ncbi_mondo_edges.length).toBeGreaterThan(1);
})