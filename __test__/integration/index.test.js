const kg = require("../../src/index");


describe('Test constructMetaKG from remote', () => {
    test("Test construct meta-kg based on team name", async () => {
        const meta_kg = new kg();
        await meta_kg.constructMetaKG(false, "translator", undefined, "Text Mining Provider");
        expect(meta_kg.ops).toBeInstanceOf(Array);
        expect(meta_kg.ops.length).toBeGreaterThan(0);
        expect(meta_kg.ops[0].association["x-translator"].team).toContain("Text Mining Provider");
    });
})