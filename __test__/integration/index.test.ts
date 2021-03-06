import { MetaKG } from '../../src/index';
import path from "path";

describe('Test constructMetaKG from remote', () => {
    test("Test construct meta-kg based on team name", async () => {
        const meta_kg = new MetaKG();
        await meta_kg.constructMetaKG(false, { teamName: "Text Mining Provider" });
        expect(meta_kg.ops).toBeInstanceOf(Array);
        expect(meta_kg.ops.length).toBeGreaterThan(0);
        expect(meta_kg.ops[0].association["x-translator"].team).toContain("Text Mining Provider");
    });

    test("Test construct meta-kg with tag equal to biothings", async () => {
        const meta_kg = new MetaKG();
        await meta_kg.constructMetaKG(false, { tag: "biothings" });
        expect(meta_kg.ops).toBeInstanceOf(Array);
        expect(meta_kg.ops.length).toBeGreaterThan(0);
        expect(meta_kg.ops[0].tags).toContain("biothings");
    });

    test("Test construct meta-kg with not existing tag", async () => {
        const meta_kg = new MetaKG();
        await meta_kg.constructMetaKG(false, { tag: "fakj;kjkj" });
        expect(meta_kg.ops).toBeInstanceOf(Array);
        expect(meta_kg.ops.length).toEqual(0);
    });

    test("Test construct meta-kg with smartapi id", async () => {
        const meta_kg = new MetaKG();
        await meta_kg.constructMetaKG(false, { smartAPIID: "5076f09382b38d56a77e376416b634ca" });
        expect(meta_kg.ops).toBeInstanceOf(Array);
        expect(meta_kg.ops.length).toBeGreaterThan(0);
        expect(meta_kg.ops[0].association.smartapi.id).toEqual("5076f09382b38d56a77e376416b634ca");
        expect(meta_kg.ops[0].association.api_name).toEqual("Clinical Risk KP API");
    });

    test("Test construct meta-kg with component name", async () => {
        const meta_kg = new MetaKG();
        await meta_kg.constructMetaKG(false, { component: "KP" });
        expect(meta_kg.ops).toBeInstanceOf(Array);
        expect(meta_kg.ops.length).toBeGreaterThan(0);
        expect(meta_kg.ops[0].association["x-translator"].component).toEqual("KP");
        expect(meta_kg.ops[4].association["x-translator"].component).toEqual("KP");
    });

    test("Test construct meta-kg including reasoner tags", async () => {
        const meta_kg = new MetaKG();
        await meta_kg.constructMetaKG(true, { smartAPIID: "912372f46127b79fb387cd2397203709" });
        expect(meta_kg.ops).toBeInstanceOf(Array);
        expect(meta_kg.ops.length).toBeGreaterThan(0);
        expect(meta_kg.ops[0].association.input_type).toEqual("biolink:ChemicalSubstance")
    });

    test("Test construct meta-kg including reasoner tags with no restrictions", async () => {
        const meta_kg = new MetaKG();
        await meta_kg.constructMetaKG(true, {});
        expect(meta_kg.ops).toBeInstanceOf(Array);
        expect(meta_kg.ops.length).toBeGreaterThan(0);
    });
});

describe('Test constructMetaKG from local stored specs', () => {
    test("Test construct meta-kg from local provided file path is successful", () => {
        const file_path = path.resolve(__dirname, '../data/smartapi_multiomics_kp_query.json');
        let meta_kg = new MetaKG(file_path);
        meta_kg.constructMetaKGSync({});
        expect(meta_kg.ops).toBeInstanceOf(Array);
        expect(meta_kg.ops.length).toBeGreaterThan(0);
    });

    test("Test construct meta-kg from default file stored with the package", () => {
        let meta_kg = new MetaKG();
        meta_kg.constructMetaKGSync({});
        expect(meta_kg.ops).toBeInstanceOf(Array);
        expect(meta_kg.ops.length).toBeGreaterThan(0);
    });

    test("Test construct meta-kg with tag equal to biothings", () => {
        const meta_kg = new MetaKG();
        meta_kg.constructMetaKGSync({ tag: "biothings" });
        expect(meta_kg.ops).toBeInstanceOf(Array);
        expect(meta_kg.ops.length).toBeGreaterThan(0);
        expect(meta_kg.ops[0].tags).toContain("biothings");
    });

    test("Test construct meta-kg with smartapi id", async () => {
        const meta_kg = new MetaKG();
        meta_kg.constructMetaKGSync({ smartAPIID: "5076f09382b38d56a77e376416b634ca" });
        expect(meta_kg.ops).toBeInstanceOf(Array);
        expect(meta_kg.ops.length).toBeGreaterThan(0);
        expect(meta_kg.ops[0].association.smartapi.id).toEqual("5076f09382b38d56a77e376416b634ca");
        expect(meta_kg.ops[0].association.api_name).toEqual("Clinical Risk KP API");
    });

    test("Test construct meta-kg with component name", async () => {
        const meta_kg = new MetaKG();
        meta_kg.constructMetaKGSync({ component: "KP" });
        expect(meta_kg.ops).toBeInstanceOf(Array);
        expect(meta_kg.ops.length).toBeGreaterThan(0);
        expect(meta_kg.ops[0].association["x-translator"].component).toEqual("KP");
        expect(meta_kg.ops[4].association["x-translator"].component).toEqual("KP");
    });

});


