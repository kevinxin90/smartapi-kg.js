const kg = require("../../src/index");


describe('Test constructMetaKG from local stored specs using BioThings tag', () => {
    test("Test construct meta-kg with tag equal to biothings", () => {
        const meta_kg1 = new kg();
        meta_kg1.constructMetaKGSync("biothings");
        expect(meta_kg1.ops).toBeInstanceOf(Array);
        expect(meta_kg1.ops.length).toBeGreaterThan(0);
        expect(meta_kg1.ops[0].tags).toContain("biothings");
    });
});
