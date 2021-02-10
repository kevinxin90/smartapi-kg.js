const reasoner = require('../built/reasoner');


describe('test parsePredicatesEndpoint', () => {

    test("test if result is an empty object", () => {
        let doc = {};
        let res = reasoner.parsePredicatesEndpoint(doc);
        expect(res).toHaveLength(0);
    });

    test("test if predicate is not an array", () => {
        let doc = {
            chemical_substance: {
                chemical_substance: "related_to"
            }
        };
        let res = reasoner.parsePredicatesEndpoint(doc);
        expect(res).toHaveLength(1);
        expect(res[0].association.input_type).toBe("ChemicalSubstance");
        expect(res[0].association.predicate).toBe("related_to");
    });

    test("test if predicate is not an array or string", () => {
        let doc = {
            chemical_substance: {
                chemical_substance: {
                    "k": "c"
                }
            }
        };
        let res = reasoner.parsePredicatesEndpoint(doc);
        expect(res).toHaveLength(0);
    });
});